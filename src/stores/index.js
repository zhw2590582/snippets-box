import { observable, action, computed, runInAction } from 'mobx';
import { post, get } from '../utils/fetch';
import { resolveGist, errorHandle } from '../utils';
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

export class Stores {
  gistsApi = null; // Gists Api实例
  @observable logging = false; // 登录中
  @observable isLoading = false; // 加载状态
  @observable access_token = ''; // 访问Token
  @observable userInfo = null; // 用户信息
  @observable allGists = []; // 所有Gists
  @observable allStarred = []; // 收藏Gists
  @observable gistsList = []; // 当前Gists
  @observable openGist = null; // 打开Gist
  @observable newGist = null; // 新建Gist
  @observable // 过滤条件
  selected = {
    type: 'all', // 类型
    tagName: '', // 值
    id: '', // 当前选中gist
    public: 'all', // 公开排序
    updated: false, // 更新排序
    keywork: '' // 关键词
  };

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

  // 重置
  @action
  reset = callback => {
    this.setLoading(true);
    // 还原默认值
    this.selected = {
      type: 'all', // 类型
      tagName: '', // 值
      id: '', // 当前选中gist
      public: 'all', // 公开排序
      updated: false, // 更新排序
      keywork: '' // 关键词
    };
    this.setGistsApi(this.access_token, () => {
      // 获取全部gists, 且打开第一个gist
      this.setSelected({ type: 'all' }, () => {
        callback && callback();
      });
      // 获取全部starred,只为显示其数量
      this.getStarred();
    });
  };

  // 获取全部gists
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

  // 获取全部starred
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
    this.getGists(() => {
      this.allGists.forEach(gist => {
        if (gist.tags.length > 0 && gist.tags.includes(tagName)) {
          gistsByTag.push(gist);
        }
      });
      callback && callback(gistsByTag);
    });
  };

  // 更新选择方式
  @action
  setSelected = (opt, callback) => {
    this.selected = Object.assign({}, this.selected, opt);
    switch (this.selected.type) {
      case 'all':
        this.getGists(gists => {
          this.updateGists(gists);
          callback && callback();
        });
        break;
      case 'starred':
        this.getStarred(gists => {
          this.updateGists(gists);
          callback && callback();
        });
        break;
      case 'tag':
        this.getGistsByTag(this.selected.tagName, gists => {
          this.updateGists(gists);
          callback && callback();
        });
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
      if(this.gistsList.length > 0){
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
    this.selected.id = id;
    this.gistsApi.download({ id }, (err, gist) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.openGist = resolveGist(gist);
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
      notification.success({
        message: 'Notification',
        description: 'Star Success!'
      });
      // 只为更新数量
      this.getStarred(() => {
        this.setLoading(false);
        callback && callback();
      });
    });
  };

  // 解除star
  @action
  unstar = (id, callback) => {
    this.gistsApi.unstar({ id }, err => {
      if (err) errorHandle('Please check your network!');
      notification.success({
        message: 'Notification',
        description: 'Unstar Success!'
      });
      // 更新当前表
      that.setSelected(that.selected, () => {
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
          notification.success({
            message: 'Notification',
            description: 'Delete Success!'
          });
          // 更新当前表
          that.setSelected(that.selected, () => {
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
  searchGist = (opts, callback) => {
    console.log(opts);
  };

  // 新建Gist
  @action
  createGist = (opts, callback) => {
    console.log(opts);
  };

  // 编辑Gist
  @action
  editGist = (opts, callback) => {
    console.log(opts);
  };

  // 系统设置
  @action
  setting = (opts, callback) => {
    console.log(opts);
  };
}

export default new Stores();
