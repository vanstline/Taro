# fandeng-nianlun

樊登年轮  小程序

## 项目介绍

该项目是使用 taro 打造的一款小程序应用， 主要技术栈有 react, redux, taro-cli, taro-ui, axios

## 实现功能

1. 通过 axios 对接口进行再封装，根据签名规则， 对请求参数自动添加签名， 防止请求被恶意抓取篡改， 大大提高前后台数据交互的安全性
2. 添加无感页面阻塞处理， 在阻塞期间，可以自动实现对项目token 刷新，鉴权、 公众号获取openId 等一系列处理， 处理完成后恢复正常页面访问， 此处属于无感操作， 适用于所有页面
3. 根据项目，编写提取多处公共组件， 实现组件样式，功能复用
4. 实现视频播放， 音频背景播放， 悬浮播放器， 可拖拽进度条， 录音，微信支付， 扫码访问等功能




## api 请求
目前支持 get, post 两种请求方式 默认 post

使用方式如下

```javascript

api.get(url, data)   // get请求

api.post(url, data)   // post 简单请求
api.post(url, data, true)   // post 复杂请求

```