import Taro from '@tarojs/taro'
import { HTTP_STATUS } from './constants'
import { logError } from '../utils/logError'
import { sign } from '../utils/utils'


// const token = 'bearer Authorization'
export default {

  baseOptions(params, method = 'POST', extraHeader) {
    let { url, data } = params
    const token = Taro.getStorageSync('token_type') + ' ' + Taro.getStorageSync('authorize').token
    let contentTypeFormData = 'application/x-www-form-urlencoded'
    let contentTypeJSON = 'application/json;charset=UTF-8'
    let contentType = params.contentType ? contentTypeJSON : contentTypeFormData
    let header = { 'content-type': contentType, 'Authorization': token, ...extraHeader }
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: url,
      data: data,
      method: method,
      header,
      success(res) {
        if(res.data.returnCode === -110) {
          Taro.clearStorageSync()
          Taro.redirectTo({ url: '/pages/login/index' })
          return
        }
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          if(res.data.returnCode !== 0) {
            console.log(res.data)
            if(res.data.error ==='invalid_token'){
              Taro.clearStorageSync();
            }
            return logError('api', res.data.returnMsg ? res.data.returnMsg : '请求接口出现问题')
          }
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },

  get(url, data = '') {
    url = `${url}?${sign(data)}`
    let option = { url, data }
    return this.baseOptions(option, 'GET')
  },

  post(url, data, contentType = false, header) {
    if(contentType) {
      url = `${url}?${sign(data, contentType)}`
    } else {
      data =  sign(data, contentType)
    }
    let params = { url, data, contentType }
    // console.log(params, '----------params')
    return this.baseOptions(params, 'POST', header)
  }
}