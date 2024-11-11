# Make-Money

打工人挣钱进度条

激活打工人赚钱欲！！！

<p align="center">
  <!-- <img src="https://imgur.com/EUCZEB6.png" /> -->
  <img src="https://imgur.com/KQzZkAF.gif" />
</p>

## 下载链接
- macOS (universe): [make-money_0.0.0_universal.dmg](./download/make-money_0.0.0_universal.dmg)
- macOS (intel): [make-money_0.0.0_x64.dmg](./download/make-money_0.0.0_x64.dmg)
- macOS (M series): [make-money_0.0.0_aarch64.dmg](./download/make-money_0.0.0_aarch64.dmg)
- windows: [make-money.exe](./download/make-money.exe)

## 构建macOS可用的dmg文件
```js
yarn
sudo yarn tauri build
```

如果你使用的是M1/M2/M3芯片：
```
yarn tauri build --target aarch64-apple-darwin
```
如果你使用的是Intel芯片：
```
yarn tauri build --target x86_64-apple-darwin
```

如果想要打通用版（intel和M系列都可以用）：
```
sudo yarn tauri build -- --target universal-apple-darwin
```

- 构建完成后，会自动打开安装镜像
- 若需要分享给其他人安装，可以将/make-money/src-tauri/target/release/bundle/dmg/make-money_0.0.0_x64.dmg中的dmg文件复制给他人




## 构建windows可用的exe文件

在mac上打exe，需要使用Rust的交叉编译，需要安装工具链，llvm是一个在macOS上使用的linker。
```
brew install nsis
brew install llvm
```
向windows环境添加windows的64位Microsoft Visual C++。
安装cargo-xwin作为tauri的runner，可以自动下载windows的SDK。
```
rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
```
然后使用yarn及tauri打包。
```
yarn tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc
```

打包后的exe文件缺少WebView2Loader.dll文件
tauri.conf.json增加
```
{
  "bundle": {
    "windows": {
      "webviewInstallMode": {
        "type": "embedBootstrapper"
      }
    }
  }
}
```
官方文档：https://v2.tauri.app/zh-cn/distribute/windows-installer/#webview2-installation-options

## 本地开发预览
1. sudo yarn build
2. yarn preview

## 加速下载rust crate
```
vim ~/.cargo/config.toml
```
```
[source.crates-io]
replace-with = 'rsproxy'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

# 稀疏索引，要求 cargo >= 1.68
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"

[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"

[net]
git-fetch-with-cli = true

```


## 构建时若遇到报错

1. Blocking waiting for file lock on package cache。运行`rm -rf ~/.cargo/.package-cache`再重新构建即可。
2. failed to run bundle_dmg.sh, 运行`sudo yarn tauri build`重试一次

## 假设打出来的包不是最新的代码
运行`yarn rm-target`


## 查看rust安装了几种target
`rustup target list --installed`


灵感来源于[MoneyProgress](https://github.com/Lakr233/MoneyProgress)及daily work