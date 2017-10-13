import 'normalize.css';
import '../../styles/options.scss';
import { default_url } from '../../config';

window.onload = function() {
  chrome.storage.local.get('snippetsUrl', storage => {
    const inputDom = document.querySelector('.input');
    const btnDom = document.querySelector('.btn');
    inputDom.value = storage.snippetsUrl ? storage.snippetsUrl : default_url;
    btnDom.addEventListener('click', function(e) {
      chrome.storage.local.set(
        {
          snippetsUrl: inputDom.value
        },
        () => {
          alert('Saved Successfully!!!');
        }
      );
    });
  });
};
