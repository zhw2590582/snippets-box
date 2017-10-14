import 'normalize.css';
import '../../styles/options.scss';
import { default_url } from '../../config';

window.onload = () => {
  chrome.storage.local.get('snippetsUrl', storage => {
    const inputDom = document.querySelector('.input');
    const btnDom = document.querySelector('.btn');
    inputDom.value = storage.snippetsUrl ? storage.snippetsUrl : default_url;
    btnDom.addEventListener('click', e => {
      e.preventDefault();
      if (!inputDom.value || !inputDom.value.match(/^http/)) {
        alert('Please enter the correct URL!!!');
        return;
      }
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
