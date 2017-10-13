import store from "store";

export function unescape(str) {
  return (str + "===".slice((str.length + 3) % 4))
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
}

export function escape(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function encode(str) {
  return escape(new Buffer(str).toString("base64"));
}

export function decode(str) {
  return new Buffer(unescape(str), "base64").toString();
}

//设置localstorage
export function setStorage(name, value) {
  store.set(name, encode(JSON.stringify(value)));
}

//读取localstorage
export function getStorage(name, callback) {
  if (!!store.get(name) === false) return false;
  callback && callback(JSON.parse(decode(store.get(name))));
}

//删除localstorage
export function delStorage(name, callback) {
  if (!!store.get(name) === false) return false;
  store.remove(name);
  callback && callback();
}

//清除localstorage
export function cleanStorage(callback) {
  store.clearAll();
  callback && callback();
}
