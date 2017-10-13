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
  } else {
    gist.name = '';
    gist.tags = [];
  }
  return gist;
};
