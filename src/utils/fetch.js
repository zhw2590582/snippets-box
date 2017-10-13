export default function request(method, url, body) {
  method = method.toUpperCase();
  body = body && JSON.stringify(body);

  console.log('请求方法：' + method);
  console.log('请求接口：' + url);
  console.log('请求数据：' + body);
  console.log('%c----------------------------------------', 'color: blue');

  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body
  }).then(res => {
    if (res.status === 404) {
      return Promise.reject('Unauthorized.');
    } else {
      return res.json();
    }
  });
}

export const get = url => request('GET', url, undefined);
export const post = (url, body) => request('POST', url, body);