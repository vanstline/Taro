# fandeng-nianlun

樊登年轮  小程序


## api 请求
目前支持 get, post 两种请求方式 默认 post

使用方式如下

```javascript

api.get(url, data)   // get请求

api.post(url, data)   // post 简单请求
api.post(url, data, true)   // post 复杂请求

```