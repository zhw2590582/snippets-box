import { notification } from 'antd';

// 运行环境
export const isProduction = process.env.NODE_ENV === 'production';

// 查询url参数
export const getQueryString = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 解析gist
export const resolveGist = gist => {
  if (gist.description && gist.description.includes('@snippetsMeta')) {
    let snippetsMeta = JSON.parse(gist.description.split('@snippetsMeta')[1]);
    gist.description = gist.description.split('@snippetsMeta')[0];
    gist.name = snippetsMeta.name;
    gist.tags = snippetsMeta.tags;
    gist.filenames = Object.keys(gist.files).map(name => name);
  } else {
    gist.name = Object.keys(gist.files)[0] || '';
    gist.tags = [];
    gist.filenames = [];
  }
  return gist;
};

// 合成gist
export const constructGist = gistInfo => {
  let description =
    gistInfo.description +
    '@snippetsMeta' +
    JSON.stringify({
      name: gistInfo.name,
      tags: gistInfo.tags
    });
  let public = gistInfo.public;
  let files = gistInfo.files;
  return {
    description,
    public,
    files
  };
};

// 错误抛出
export const errorHandle = (err, callback) => {
  notification.error({
    message: 'Error !!!',
    description: err
  });
  callback && callback();
  throw new TypeError(err);
};
