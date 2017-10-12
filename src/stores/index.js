import {
  observable,
  action,
  computed,
  runInAction,
  extendObservable
} from 'mobx';
import { post, get } from '../utils/fetch';
import { resolveGist } from '../utils';
import { client_id, client_secret, redirect_uri } from '../../../config';
import { notification } from 'antd';
import Gists from 'gists';

export class Store {
  gistsApi = null; // Gists Api实例
  isLoading = observable(false); // 加载状态
  access_token = observable(''); // 访问Token
  userInfo = observable(null); // 用户信息
  allGists = observable([]); // 所有Gists
  openGist = observable(null); // 打开Gist
  newGist = observable(null); // 新建Gist
  filesByLanguage = observable([]); // 语言过滤
  gistsByTag = observable([]); // 标签过滤
  selected = observable({
    type: '',
    val: ''
  });

  constructor() {
    extendObservable(this, {
      // 获取所有语言
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
      },

      // 获取所有语言数量
      get getLanguagesLength() {
        let res = 0;
        Object.keys(this.getLanguages).forEach(item => {
          res += this.getLanguages[item];
        });
        return res;
      },

      // 获取所有标签
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
      },

      // 获取所有语言数量
      get getTagsLength() {
        let res = 0;
        Object.keys(this.getTags).forEach(item => {
          res += this.getTags[item];
        });
        return res;
      },

        // 获取用户信息
  getUserInfo: action(async (code, callback) => {
    let data = await get(
      `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`
    );

    let userInfo = await get(
      `https://api.github.com/user?access_token=${data.access_token}`
    );

    if (userInfo.id) {
      // chrome.storage.local.set({ access_token: data.access_token }, () => {
      //   chrome.storage.local.set({ userInfo }, () => {
      //     runInAction(() => {
      //       this.access_token = data.access_token;
      //       this.userInfo = userInfo;
      //       this.reset();
      //       callback && callback();
      //     });
      //   });
      // });
    } else {
    }
  }),

  // 设置用户信息
  setUserInfo: action((userInfo, callback) => {
    this.userInfo = userInfo;
    callback && callback();
  }),

  // 设置token
  setToken: action((setToken, callback) => {
    this.access_token = setToken;
    callback && callback();
  }),

  // 设置loading
  setLoading: action((val, callback) => {
    this.isLoading = val;
    callback && callback();
  }),

  // 登出
  logout: action(callback => {
    this.userInfo = null;
    //.storage.local.clear();
    callback && callback();
  }),

  // 重置
  reset: action(callback => {
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
  }),

  // 实例化Gists Api
  setGistsApi: action((token, callback) => {
    this.gistsApi = new Gists({
      token: token
    });
    callback && callback();
  }),

  // 获取gists
  getGists: action(callback => {
    this.gistsApi.list({ user: this.userInfo.login }, (err, res) => {
      if (err) throw new TypeError(err);
      runInAction(() => {
        this.allGists = res.map(gist => resolveGist(gist));
        callback && callback();
      });
    });
  }),

  // 获取某语言下的Gists
  getGistsByLanguage: action((val, callback) => {
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
  }),

  // 获取某标签下的Gists
  getGistsByTag: action((val, callback) => {
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
  }),

  // 打开Gist
  getGistsOpen: action((id, callback) => {
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
  }),

  // 新建Gist
  createGist: action((opts, callback) => {
    console.log(opts);
  })

  // 删除Gist

  // 编辑Gist

  // 标记Gist
    });
  }
}

export default new Store();
