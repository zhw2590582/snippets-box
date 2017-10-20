# Snippets Box
[https://zhw2590582.github.io/snippets-box/](https://zhw2590582.github.io/snippets-box/)

事情是这样的，我一直在寻找一个简单易用的代码片段管理器，要免费，要自动同步，要跨平台的，要所见即所得，要自托管的。[Gistbox](https://app.gistboxapp.com) 基于Gist免费且功能丰富，用了一段时间后发现它准备不再维护；Mac的 [SnippetsLab](http://www.renfei.org/snippets-lab/) 虽然界面不错但收费且不支持同步；[Lepton](https://github.com/hackjutsu/Lepton) 基于Gist开源多平台支持同步等等各方面都不错，但软件界面不是很漂亮且目前还是不支持starred查询。所以还是决定自己动手写一个基于 [Gist](https://gist.github.com/) 的网页端，直接托管在 [Github Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)，加上 [Chrome Extension](https://developer.chrome.com/extensions) 可以做到所见所得，岂不是美滋滋！！！

![N1 Screenshot](https://raw.githubusercontent.com/zhw2590582/snippets-box/master/screenshot/01.png)

技术框架方面主要使用了单页面应用的[React](https://github.com/facebook/react)、[Mobx](https://github.com/mobxjs/mobx)、[Ant Design](https://github.com/ant-design/ant-design)，打包后的静态文件不超过3兆，可以存放于任何服务器运行，不过我还是选择直接放在Github Pages，便于更新迭代。

## 安装 Chrome Extension
- 扩展的源码也存在于这个项目，安装文件在： **snippets-box/chrome/snippets-box.crx**
- 安装完后点击图标，可以跳到选项页，假如你有自己托管的 Snippets Box 地址，可以填写你要的地址。
- 安装扩展后，可以在选中任意文字后右键 **Add to Snippets Box** 以创建Gist，或者在代码块的右上角点击创建Gist
![N1 Screenshot](https://raw.githubusercontent.com/zhw2590582/snippets-box/master/screenshot/02.png)

## 托管到你自己的 Github Pages

### Step 1) Fork 这个项目
然后你获取到你的 **Homepage URL** 例如: https://github.com/you-name/snippets-box

### Step 2) 在设置页面创建基于 /docs 目录的 GitHub Pages
然后你获取到你的 **Authorization callback URL** 例如: https://you-name.github.io/snippets-box/

### Step 3) 创建一个 Github OAuth App. 
打开 [https://github.com/settings/applications/new](https://github.com/settings/applications/new) ，填写信息以注册一个新的 OAuth App。

然后你获取到你的 **Client ID** 和 **Client Secret**

### Step 4) Clone 你刚刚 Fork 的项目到本地
修改配置文件 **snippets-box/src/config/index.js**

- client_id：[Your Client ID]

- client_secret：[Your Client Secret]

- redirect_uri： [Your Authorization callback URL]

重新打包，你的 docs 文件夹将会变化
```bash
$ npm install
$ npm run build
```

### Step 5) Push 你的修改，结束！！！

## 开发
项目只有四个 npm 指令，前两个用于开发单页面: 源码 src 目录，后两个用于开发 Chrome Extension: 源码 chrome 目录
```bash
$ npm run dev
$ npm run build
$ npm run devChrome
$ npm run buildChrome
```

## 已知 Bug
- 检测 Gist 是否被 Star 不准确
- Gist 的文件列表闭合展开不可控问题
- Chrome Extension 的代码块检测不准确

## 待办事项
- 添加多语言支持
- 添加多皮肤支持