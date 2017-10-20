import '../../styles/content.scss';

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
  setTimeout(() => {
    sendMessage(storage.gistCache);
    chrome.storage.local.remove('gistCache');
  }, 500);
});

// 查询页面代码块
setTimeout(() => {
  const codes = [].slice.call(document.querySelectorAll('pre'));
  codes.forEach(function(ele) {
    ele.classList.add('snippets-box-code');
    ele.insertAdjacentHTML('beforeend', '<div class="snippets-box-btn"></div>');
    ele.querySelector('.snippets-box-btn').addEventListener('click', () => {
      const port = chrome.runtime.connect({ name: 'content' });      
      port.postMessage({
        name: document.title,
        description: window.location.href,
        content: ele.innerText
      });
    });
  });
}, 1000);
