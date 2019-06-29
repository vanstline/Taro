module.exports = {
  env: {
    NODE_ENV: '"production"',
    IMG_URL: '://nianlun-static.oss-cn-hangzhou.aliyuncs.com'
  },
  defineConstants: {
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          config: {
            limit: 1024 * 102400 // 文件大小限制
          }
        }
      }
    }
  },
  h5: {}
}
