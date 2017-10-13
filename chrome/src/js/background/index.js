import '../../utils/hotReload';
import { default_url } from '../../config';

// 打开唯一页面
window.openPage = (url, callback) => {
  chrome.tabs.query({ currentWindow: true, url: url }, tabs => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: url }, () => {
        callback && callback('create', tabs);
      });
    } else {
      chrome.tabs.highlight({ tabs: tabs[0].index }, () => {
        callback && callback('highlight', tabs);
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
  goSnippets((type, tabs) => {
    // 拼接Gist信息
    let gistCache = {
      type: 'creatGist',
      name: tab.title + ' --- ' + tab.url,
      description: info.selectionText
    };

    console.log(gistCache, tabs);
  });
});
