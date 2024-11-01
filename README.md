# Make-Money

打工人挣钱进度条

激活打工人赚钱欲！！！

<p align="center">
  <!-- <img src="https://imgur.com/EUCZEB6.png" /> -->
  <img src="https://imgur.com/KQzZkAF.gif" />
</p>

## 下载链接
- macOS: [make-money_0.0.0_x64.dmg（暂无开发者身份，下载后无法打开，可以自行构建或者找我要dmg文件）](./download/make-money_0.0.0_x64.dmg)
- windows: TODO

## 构建dmg文件
```js
yarn
sudo yarn tauri build
```
- 构建完成后，会自动打开安装镜像
- 若需要分享给其他人安装，可以将/make-money/src-tauri/target/release/bundle/dmg/make-money_0.0.0_x64.dmg中的dmg文件复制给他人

灵感来源于[MoneyProgress](https://github.com/Lakr233/MoneyProgress)及daily work


构建时若遇到报错：

1. Blocking waiting for file lock on package cache。运行`rm -rf ~/.cargo/.package-cache`再重新构建即可。
2. failed to run bundle_dmg.sh, 运行`sudo yarn tauri build`重试一次

## 本地开发预览
1. sudo yarn build
2. yarn preview