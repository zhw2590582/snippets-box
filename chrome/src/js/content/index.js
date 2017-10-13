// 接收来自后台
chrome.runtime.onMessage.addListener(message => {
  console.log(message);
});

// 接收来自缓存
chrome.storage.local.get('gistCache', storage => {
  if (!storage.gistCache) return;
  console.log(storage.gistCache);
  chrome.storage.local.remove('gistCache');
});
