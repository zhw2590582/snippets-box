import '../../utils/hotReload';
import { default_url } from '../../config';

// 打开唯一页面
window.openPage = (url, callback) => {
  chrome.tabs.query({ currentWindow: true, url: url }, tabs => {
    if (tabs.length === 0) {
      chrome.tabs.create({ url: url }, tab => {
        callback && callback('create', tab);
      });
    } else {
      chrome.tabs.highlight({ tabs: tabs[0].index }, () => {
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
  title: 'Add to Snippets Box',
  contexts: ['all']
});

// 新建Gist
window.creatGist = (name, description, content, callback) => {
  goSnippets((type, snippetTab) => {
    // 拼接Gist信息
    let gistCache = {
      type: 'creatGist',
      name: name,
      description: description,
      tags: [],
      public: false,
      files: [
        {
          filename: 'new_gist_file',
          content: content,
          delFile: false,
          oldName: ''
        }
      ]
    };

    // 假如页面未打开则先缓存，等待组件创建完再新建Gist
    if (type === 'create') {
      chrome.storage.local.set({ gistCache });
      return;
    }

    // 假如页面已打开则新建Gist
    chrome.tabs.sendMessage(snippetTab.id, gistCache);
  });
};

// 菜单新建Gist
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  creatGist(tab.title, tab.url, info.selectionText);
});

// 代码块新建Gist
chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(message => {
    creatGist(message.name, message.description, message.content);
  });
});
