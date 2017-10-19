import { observable, action, computed, runInAction, toJS } from 'mobx';
import { post, get, patch } from '../utils/fetch';
import { resolveGist, constructGist, errorHandle } from '../utils';
import {
  setStorage,
  getStorage,
  delStorage,
  cleanStorage
} from '../utils/storage';
import { client_id, client_secret, redirect_uri } from '../config';
import { notification, Modal } from 'antd';
import Gists from 'gists';
import moment from 'moment';
import Fuse from 'fuse.js';

export class Stores {
  constructor() {
    // 同步用户信息
    getStorage('userInfo', storage => {
      if (!storage) return;
      this.setUserInfo(storage);
    });

    // 同步access_token, 并重置gists信息
    getStorage('access_token', storage => {
      if (!storage) return;
      this.setToken(storage, () => {
        this.reset();
      });
    });

    // 同步配置信息
    getStorage('options', storage => {
      if (!storage) return;
      this.setOptions(storage);
    });
  }

  gistsApi = null; // Gists Api实例
  gistsFuse = null; // Fuse实例
  @observable
  options = {
    fromCache: true // 是否从缓存中读取gists
  };
  gistsCache = {}; // 缓存的gists
  @observable logging = false; // 登录中
  @observable isLoading = false; // 加载状态
  @observable access_token = ''; // 访问Token
  @observable userInfo = null; // 用户信息
  @observable allGists = []; // 所有Gists
  @observable allStarred = []; // 收藏Gists
  @observable gistsList = []; // 当前Gists
  @observable openGist = null; // 打开Gist
  @observable // 过滤条件
  selected = {
    type: 'all', // 类型
    tagName: '', // 值
    id: '', // 当前选中gist
    public: 'all', // 公开排序
    updated: false // 更新排序
  };
  @observable editMode = false; // 编辑模式
  @observable
  editGistInfo = {
    // 编辑详情
    id: '',
    name: '',
    description: '',
    tags: [],
    public: false,
    files: [
      {
        filename: '',
        content: '',
        delFile: false,
        oldName: ''        
      }
    ]
  };

  // 获取allGists + allStarred
  @computed
  get allFavorites() {
    return this.allGists.concat(
      this.allStarred.filter(gist => gist.owner.id !== this.userInfo.id)
    );
  }

  // 获取所有标签
  @computed
  get getTags() {
    let alltags = {};
    this.allGists.forEach(gist => {
      if (gist.tags.length === 0) return;
      gist.tags.forEach(tag => {
        tag = tag.trim();
        (alltags[tag] && (alltags[tag] += 1)) || (alltags[tag] = 1);
      });
    });
    return alltags;
  }

  // 获取所有语标签的数量总和
  @computed
  get getTagsLength() {
    let res = 0;
    Object.keys(this.getTags).forEach(item => {
      res += this.getTags[item];
    });
    return res;
  }

  // 登录获取用户信息
  @action
  getUserInfo = async (code, callback) => {
    this.logging = true;
    let data = await get(
      `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`
    );

    if (!data.access_token) {
      errorHandle('Can not get token, Please login again!', () => {
        runInAction(() => {
          history.replaceState(null, '', redirect_uri);
          this.logging = false;
        });
      });
    }

    let userInfo = await get(
      `https://api.github.com/user?access_token=${data.access_token}`
    );

    if (!userInfo.id) {
      errorHandle('Can not get user info, Please login again!', () => {
        runInAction(() => {
          history.replaceState(null, '', redirect_uri);
          this.logging = false;
        });
      });
    }

    setStorage('access_token', data.access_token, () => {
      setStorage('userInfo', userInfo, () => {
        runInAction(() => {
          this.access_token = data.access_token;
          console.log(this.access_token);
          this.userInfo = userInfo;
          history.replaceState(null, '', redirect_uri);
          this.logging = false;
          this.reset();
          callback && callback();
        });
      });
    });
  };

  // 设置用户信息
  @action
  setUserInfo = (userInfo, callback) => {
    this.userInfo = userInfo;
    callback && callback();
  };

  // 设置token
  @action
  setToken = (setToken, callback) => {
    this.access_token = setToken;
    callback && callback();
  };

  // 设置loading
  @action
  setLoading = (val, callback) => {
    this.isLoading = val;
    callback && callback();
  };

  // 编辑模式
  @action
  setEditMode = (val, callback) => {
    this.editMode = val;
    if (!val) {
      this.editGistInfo = {
        id: '',
        name: '',
        description: '',
        tags: [],
        public: false,
        files: [
          {
            filename: '',
            content: '',
            delFile: false,
            oldName: ''
          }
        ]
      };
    }
    callback && callback();
  };

  // 登出
  @action
  logout = callback => {
    this.userInfo = null;
    this.access_token = null;
    cleanStorage();
    callback && callback();
  };

  // 实例化Gists Api
  @action
  setGistsApi = (token, callback) => {
    this.gistsApi = new Gists({
      token: token
    });
    callback && callback();
  };

  // 静默重置
  @action
  reset = callback => {
    this.setLoading(true);
    this.setGistsApi(this.access_token, () => {
      runInAction(() => {
        this.getGists(() => {
          this.getStarred(() => {
            // 清空gist缓存, 重新请求
            this.gistsCache = {};
            this.setEditMode(false);
            this.setSelected(this.selected, false, () => {
              callback && callback();
            });
          });
        });
      });
    });
  };

  // 获取全部自己的gists, 回调函数返回gists列表
  @action
  getGists = callback => {
    this.gistsApi.list({ user: this.userInfo.login }, (err, res) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.allGists = res.map(gist => resolveGist(gist));
        callback && callback(this.allGists);
      });
    });
  };

  // 获取全部自己starred, 回调函数返回gists列表
  @action
  getStarred = callback => {
    this.gistsApi.starred({ user: this.userInfo.login }, (err, res) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.allStarred = res.map(gist => resolveGist(gist));
        callback && callback(this.allStarred);
      });
    });
  };

  // 获取某标签下的Gists, 回调函数返回gists列表
  @action
  getGistsByTag = (tagName, callback) => {
    let gistsByTag = [];
    this.allGists.forEach(gist => {
      if (gist.tags.length > 0 && gist.tags.includes(tagName)) {
        gistsByTag.push(gist);
      }
    });
    callback && callback(gistsByTag);
  };

  // 更新Gists方式: 第一个为选项，第二个为是否读缓存，
  @action
  setSelected = (opt, fromCache, callback) => {
    this.setEditMode(false);
    this.selected = Object.assign({}, this.selected, opt);
    switch (this.selected.type) {
      case 'all':
        if (fromCache) {
          this.updateGists(this.allGists);
          callback && callback();
        } else {
          this.getGists(gists => {
            this.updateGists(gists);
            callback && callback();
          });
        }
        break;
      case 'starred':
        if (fromCache) {
          this.updateGists(this.allStarred);
          callback && callback();
        } else {
          this.getStarred(gists => {
            this.updateGists(gists);
            callback && callback();
          });
        }
        break;
      case 'tag':
        if (fromCache) {
          this.getGistsByTag(this.selected.tagName, gists => {
            this.updateGists(gists);
            callback && callback();
          });
        } else {
          this.getGists(() => {
            this.getGistsByTag(this.selected.tagName, gists => {
              this.updateGists(gists);
              callback && callback();
            });
          });
        }
        break;
    }
  };

  // 更新列表并试图打开第一个gist
  @action
  updateGists = (gists, callback) => {
    if (gists.length > 0) {
      // 更新排序
      if (this.selected.updated) {
        gists = gists.sort((a, b) => {
          return moment(a.updated_at).isBefore(b.updated_at);
        });
      }

      // 公开排序
      if (this.selected.public === 'all') {
        this.gistsList = gists;
      } else {
        this.gistsList = gists.filter(
          gist => gist.public == (this.selected.public === 'public')
        );
      }

      // 打开第一个
      if (this.gistsList.length > 0) {
        this.getGistsOpen(this.gistsList[0].id);
      } else {
        this.gistsList = [];
        this.openGist = null;
        this.setLoading(false);
      }
    } else {
      this.gistsList = [];
      this.openGist = null;
      this.setLoading(false);
    }
    callback && callback();
  };

  // 打开Gist
  @action
  getGistsOpen = (id, callback) => {
    this.setEditMode(false);
    this.selected.id = id;

    // 是否已存在缓存
    if (this.options.fromCache && this.gistsCache[id]) {
      this.openGist = this.gistsCache[id];
      this.setLoading(false);
      callback && callback();
      return;
    }

    // 发起新请求
    this.gistsApi.download({ id }, (err, gist) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.gistsCache[id] = this.openGist = resolveGist(gist);
        this.setLoading(false);
        console.log(this);
        callback && callback();
      });
    });
  };

  // 检测是否star
  @action
  isStarred = (id, callback) => {
    this.gistsApi.isStarred({ id }, err => {
      if (err) errorHandle('Please check your network!');
      callback && callback();
    });
  };

  // 添加star
  @action
  star = (id, callback) => {
    this.gistsApi.star({ id }, err => {
      if (err) errorHandle('Please check your network!');
      this.reset(() => {
        callback && callback();
      });
    });
  };

  // 解除star
  @action
  unstar = (id, callback) => {
    this.gistsApi.unstar({ id }, err => {
      if (err) errorHandle('Please check your network!');
      this.reset(() => {
        callback && callback();
      });
    });
  };

  // 删除Gist
  @action
  destroy = (id, callback) => {
    let that = this;
    Modal.confirm({
      title: 'Do you Want to delete this gist?',
      content: '',
      onOk() {
        that.setLoading(true);
        that.gistsApi.destroy({ id }, err => {
          if (err) errorHandle('Please check your network!');
          that.reset(() => {
            callback && callback();
          });
        });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  // 搜索Gist
  @action
  searchGist = (value, callback) => {
    this.setLoading(true);
    if (!value) {
      this.setSelected({ type: 'all' }, this.options.fromCache);
    } else {
      // 清除选中状态
      this.selected = {
        tagName: '',
        id: '',
        public: 'all',
        updated: false
      };

      // 合并自己和标记的gists并转换为javascript结构 => 注意自己标记自己的gist
      let searchLists = toJS(this.allGists).concat(
        toJS(this.allStarred.filter(gist => gist.owner.id !== this.userInfo.id))
      );

      // 实例化
      this.gistsFuse = new Fuse(searchLists, {
        keys: ['name', 'description', 'tags', 'filenames']
      });

      // 获取关键id
      let searchId = this.gistsFuse.search(value).map(gist => gist.id);

      // 更新
      this.updateGists(
        this.allFavorites.filter(gist => {
          return searchId.includes(gist.id);
        })
      );
    }
  };

  // 编辑动作
  @action
  createGist = (option, callback) => {
    switch (option.type) {
      case 'filename':
        this.editGistInfo.files[option.index].filename = option.value;
        break;
      case 'fileContent':
        this.editGistInfo.files[option.index].content = option.value;
        break;
      case 'deleteFile':
        this.editGistInfo.files[option.index].delFile = true;
        break;
      case 'addFile':
        this.editGistInfo.files.push({
          filename: '',
          content: ''
        });
        break;
      default:
        this.editGistInfo[option.type] = option.value;
    }
    callback && callback();
  };

  // 编辑Gist
  @action
  editGist = (gist, callback) => {
    this.editGistInfo.id = gist.id || '';
    this.editGistInfo.name = gist.name || '';
    this.editGistInfo.description = gist.description || '';
    this.editGistInfo.tags = gist.tags || [];
    this.editGistInfo.public = gist.public || false;
    this.editGistInfo.files = Object.keys(gist.files).map(filename => ({
      filename: filename,
      oldFilename: filename,
      delFile: false,
      content: gist.files[filename].content
    }));
  };

  // 创建保存gist
  @action
  saveGist = async callback => {
    let gistInfo = constructGist(this.editGistInfo);
    let data = {};
    if(this.editGistInfo.id){
      data = await patch('https://api.github.com/gists/' + this.editGistInfo.id, gistInfo);
    } else {
      data = await post('https://api.github.com/gists/', gistInfo);
    }
    if(data.id){
      this.reset(() => {
        this.setSelected({ type: 'all' }, true);
      })
      callback && callback();
    } else {
      this.setLoading(false);
      if (err) errorHandle('Please check your network!');
    }
  };

  // 系统设置
  @action
  setOptions = (option, callback) => {
    this.options = Object.assign({}, this.options, option);
    setStorage('options', this.options, () => {
      callback && callback();
    });
  };
}

export default new Stores();
