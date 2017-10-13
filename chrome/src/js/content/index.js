// 发送到页面
const sendMessage = data => {
  document.body.dispatchEvent(
    new CustomEvent('__snippets_box_hood__', {
      detail: data
    })
  );
};

// 接收来自后台
chrome.runtime.onMessage.addListener(message => {
  if (!message) return;
  sendMessage(message);
});

// 接收来自缓存
chrome.storage.local.get('gistCache', storage => {
  if (!storage.gistCache) return;
  sendMessage(storage.gistCache);
  chrome.storage.local.remove('gistCache');
});
