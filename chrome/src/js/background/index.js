import '../../utils/hotReload';
import { default_url } from '../../config';

let port = null;

// 打开唯一页面
window.openPage = (url, callback) => {
  chrome.tabs.query({ currentWindow: true, url: url }, tabs => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: url }, tab => {
        port = chrome.runtime.connect({ name: 'background' });
        callback && callback('create', tab);
      });
    } else {
      chrome.tabs.highlight({ tabs: tabs[0].index }, () => {
        port = chrome.runtime.connect({ name: 'background' });
        callback && callback('highlight', tabs[0]);
      });
    }
  });
};

// 打开snippets-box
window.goSnippets = callback => {
  chrome.storage.local.get('snippetsUrl', storage => {
    openPage(storage.snippetsUrl || default_url, (type, tabs) => {
      callback && callback(type, tabs);
    });
  });
};

// 打开后台选项
chrome.browserAction.onClicked.addListener(function(tab) {
  const optionsUrl = chrome.extension.getURL('pages/options.html');
  openPage(optionsUrl);
});

// 创建右键菜单
chrome.contextMenus.create({
  id: 'SnippetsBox',
  title: 'Add to SnippetsBox',
  contexts: ['all']
});

// 菜单新建Gist
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  goSnippets((type, tab) => {
    // 拼接Gist信息
    let gistCache = {
      type: 'creatGist',
      name: tab.title + ' --- ' + tab.url,
      description: info.selectionText
    };

    // 假如页面未打开则先缓存，等待组件创建完再新建Gist
    if (type === 'create') {
      chrome.storage.local.set({ gistCache });
      return;
    }

    // 假如页面已打开则新建Gist
    chrome.tabs.sendMessage(tab.id, gistCache);
  });
});
