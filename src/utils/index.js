import { notification } from 'antd';

// 运行环境
export const isProduction = process.env.NODE_ENV === 'production';

// 查询url参数
export const getQueryString = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 解析description
export const descriptionParser = payload => {
  const rawDescription = payload || 'No description';
  const regexForTitle = rawDescription.match(/\[.*\]/)
  const rawTitle = (regexForTitle && regexForTitle[0]) || '';
  const name = ((rawTitle.length > 0) && rawTitle.substring(1, regexForTitle[0].length - 1)) || '';
  const descriptionAndTags = rawDescription.substring(rawTitle.length, rawDescription.length).split(' #tags:');
  const description = descriptionAndTags[0].trim();
  const tags = descriptionAndTags[1] ? descriptionAndTags[1].split(', ') : [];
  return { name, description, tags };
}

// 解析gist
export const resolveGist = gist => {
  const newGist = descriptionParser(gist.description);
  gist.name = newGist.name;
  gist.description = newGist.description;
  gist.tags = newGist.tags;
  gist.filenames = Object.keys(gist.files).map(name => name);
  return gist;
};

// 合成gist
export const constructGist = gistInfo => {
  let description = '[' + (gistInfo.name || 'new_gist') + ']' + (gistInfo.description || 'No description') + ' #tags:' + gistInfo.tags.join(', ');
  let isPublic = gistInfo.public;
  let files = {};
  gistInfo.files.map((file, index) => {
    let name = file.filename || 'new_gist_file_' + index;
    if(file === null){
      files[name] = null;
    } else {
      files[name] = {
        content: file.content || '_'
      };
      if(file.newFilename){
        files[name].filename = file.newFilename;
      } 
    }
  });
  return {
    description: description,
    public: isPublic,
    files: files
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