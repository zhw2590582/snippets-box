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
import { notification } from 'antd';
import Gists from 'gists';

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
  @observable filesByLanguage = []; // 语言过滤
  @observable gistsByTag = []; // 标签过滤
  @observable // 过滤条件
  selected = {
    type: 'all', // 类型
    val: '', // 值
    id: '', // 当前选中gist
    sort: 'all', // 公开排序
    updated: false, // 更新排序
    keywork: '' // 关键词
  };

  // 获取所有语言
  @computed
  get getLanguages() {
    let allLanguages = {};
    this.allGists.forEach(gist => {
      Object.keys(gist.files).map(file => {
        let language = gist.files[file].language || 'Text';
        allLanguages[language] || (allLanguages[language] = 0);
        allLanguages[language] += 1;
      });
    });
    return allLanguages;
  }

  // 获取所有语言数量
  @computed
  get getLanguagesLength() {
    let res = 0;
    Object.keys(this.getLanguages).forEach(item => {
      res += this.getLanguages[item];
    });
    return res;
  }

  // 获取所有标签
  @computed
  get getTags() {
    let alltags = {};
    this.allGists.forEach(gist => {
      gist.tags.length > 0 &&
        gist.tags.map(tag => {
          tag = tag.trim();
          alltags[tag] || (alltags[tag] = 0);
          alltags[tag] += 1;
        });
    });
    return alltags;
  }

  // 获取所有语言数量
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
          this.reset();
          history.replaceState(null, '', redirect_uri);
          this.logging = false;
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
    cleanStorage();
    callback && callback();
  };

  // 重置
  @action
  reset = callback => {
    this.setLoading(true);
    this.selected.type = 'all';
    this.selected.sort = 'all';
    this.selected.updated = false;
    this.setGistsApi(this.access_token, () => {
      this.getGists(() => {
        if (this.allGists.length > 0) {
          this.getGistsOpen(this.allGists[0].id);
          runInAction(() => {
            this.gistsList = this.allGists;
          });
        } else {
          this.setLoading(false);
        }
        this.getStarredOne();
        callback && callback();
      });
    });
  };

  // 实例化Gists Api
  @action
  setGistsApi = (token, callback) => {
    this.gistsApi = new Gists({
      token: token
    });
    callback && callback();
  };

  // 获取gists
  @action
  getGists = callback => {
    this.gistsApi.list({ user: this.userInfo.login }, (err, res) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.allGists = res.map(gist => resolveGist(gist));
        callback && callback();
      });
    });
  };

  // 一次性获取starred数目
  @action
  getStarredOne = callback => {
    this.gistsApi.starred({ user: this.userInfo.login }, (err, res) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.allStarred = res.map(gist => resolveGist(gist));
      });
    });
  };

  // 获取starred
  @action
  getStarred = callback => {
    this.setLoading(true);
    this.selected.type = 'starred';
    this.gistsApi.starred({ user: this.userInfo.login }, (err, res) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.gistsList = this.allStarred = res.map(gist => resolveGist(gist));
        if (this.gistsList.length) {
          this.getGistsOpen(this.gistsList[0].id);
        } else {
          this.openGist = null;
          this.setLoading(false);
        }
        callback && callback();
      });
    });
  };

  // 获取某语言下的Gists
  @action
  getGistsByLanguage = (val, callback) => {
    this.selected.type = 'language';
    this.selected.val = val;
    this.filesByLanguage = [];
    this.allGists.forEach(gist => {
      Object.keys(gist.files).map(file => {
        val = val == 'Text' ? null : val;
        gist.files[file].language == val &&
          this.filesByLanguage.push(gist.files[file]);
      });
    });
    this.gistsList = [];
    console.log(this);
  };

  // 获取某标签下的Gists
  @action
  getGistsByTag = (val, callback) => {
    this.gistsByTag = [];
    this.allGists.forEach(gist => {
      gist.tags.length > 0 &&
        gist.tags.includes(val) &&
        this.gistsByTag.push(gist);
    });
    this.gistsList = this.gistsByTag;
    if (this.gistsList.length) {
      this.getGistsOpen(this.gistsList[0].id);
    } else {
      this.openGist = null;
      this.setLoading(false);
    }
    this.selected.type = 'tag';
    this.selected.val = val;
    this.selected.sort = 'all';
    this.selected.updated = false;
    console.log(this);
  };

  // 更新排序方式
  @action
  setSort = (sort, updated) => {
    sort && (this.selected.sort = sort);
    updated && (this.selected.updated = !this.selected.updated);
  };

  // 打开Gist
  @action
  getGistsOpen = (id, callback) => {
    this.setLoading(true);
    this.selected.id = id;
    this.gistsApi.download({ id }, (err, gist) => {
      if (err) errorHandle('Please check your network!');
      runInAction(() => {
        this.openGist = resolveGist(gist);
        this.setLoading(false);
        callback && callback();
        console.log(this);
      });
    });
  };

  // 新建Gist
  @action
  createGist = (opts, callback) => {
    console.log(opts);
  };

  // 检测star
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
    this.setLoading(true);
    this.gistsApi.star({ id }, err => {
      if (err) errorHandle('Please check your network!');
      notification.success({
        message: 'Notification',
        description: 'Star Success!'
      });
      this.getStarredOne();
      this.setLoading(false);
      callback && callback();
    });
  };

  // 解除star
  @action
  unstar = (id, callback) => {
    this.setLoading(true);
    this.gistsApi.unstar({ id }, err => {
      if (err) errorHandle('Please check your network!');
      notification.success({
        message: 'Notification',
        description: 'Unstar Success!'
      });
      this.getStarred();
      callback && callback();
    });
  };

  // 删除Gist

  // 编辑Gist

  // 标记Gist
}

export default new Stores();
