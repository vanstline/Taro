import Taro from '@tarojs/taro'
import api from '../api'
// import axios from 'axios'
import { Host } from '../config'

// 文件上传 /common/uploadByBase64
export const uploadByBase64 = (data) => {
  return api.post(`${Host}/common/uploadByBase64`, { fileCode: 'material', ...data })
}

// 文件上传 /common/uploadByStream
export const uploadByStream = (data) => {
  return api.post(`${Host}/common/uploadByStream`, { fileCode: 'material', ...data })
}

// 获取APP审核信息 /common/getAuditInfo
export const getAuditInfo = () => {
  return Taro.request({
    method: 'POST',
    url: `${Host}/common/getAuditInfo`,
    data: { 'x-app-ver-code': global.common.versions },
  })
}

