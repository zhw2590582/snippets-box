const sendMessage = data => {
  document.body.dispatchEvent(
    new CustomEvent('__snippets_box_hood__', {
      detail: data
    })
  );
};

// 接收来自后台
chrome.runtime.onMessage.addListener(message => {
  console.log(message);
  sendMessage(message);
});

// 接收来自缓存
chrome.storage.local.get('gistCache', storage => {
  if (!storage.gistCache) return;
  console.log(storage.gistCache);
  sendMessage(storage.gistCache);
  chrome.storage.local.remove('gistCache');
});

console.log(document.getElementById('root'));
