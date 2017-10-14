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
  @observable openGist = null; // 打开Gist
  @observable newGist = null; // 新建Gist
  @observable filesByLanguage = []; // 语言过滤
  @observable gistsByTag = []; // 标签过滤
  @observable // 过滤条件
  selected = {
    type: '',
    val: ''
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
    this.setGistsApi(this.access_token, () => {
      this.getGists(() => {
        if (this.allGists.length > 0) {
          this.getGistsOpen(this.allGists[0].id);
        } else {
          this.setLoading(false);
        }
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
    this.selected = {
      type: 'all'
    };
    this.gistsApi.list({ user: this.userInfo.login }, (err, res) => {
      if (err) throw new TypeError(err);
      runInAction(() => {
        this.allGists = res.map(gist => resolveGist(gist));
        callback && callback();
      });
    });
  };

  // 获取某语言下的Gists
  @action
  getGistsByLanguage = (val, callback) => {
    this.selected = {
      type: 'language',
      val: val
    };
    this.filesByLanguage = [];
    this.allGists.forEach(gist => {
      Object.keys(gist.files).map(file => {
        val = val == 'Text' ? null : val;
        gist.files[file].language == val &&
          this.filesByLanguage.push(gist.files[file]);
      });
    });
    console.log(this);
  };

  // 获取某标签下的Gists
  @action
  getGistsByTag = (val, callback) => {
    this.selected = {
      type: 'tag',
      val: val
    };
    this.gistsByTag = [];
    this.allGists.forEach(gist => {
      gist.tags.length > 0 &&
        gist.tags.includes(val) &&
        this.gistsByTag.push(gist);
    });
    console.log(this);
  };

  // 打开Gist
  @action
  getGistsOpen = (id, callback) => {
    this.setLoading(true);
    this.gistsApi.download({ id }, (err, gist) => {
      if (err) throw new TypeError(err);
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

  // 删除Gist

  // 编辑Gist

  // 标记Gist
}

export default new Stores();
