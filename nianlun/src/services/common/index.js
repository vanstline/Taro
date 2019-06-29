import api from '../api'
import { Host } from '../config'

// 文件上传 /common/uploadByBase64
export const uploadByBase64 = (data) => {
  return api.post(`${Host}/common/uploadByBase64`, { fileCode: 'material', ...data })
}

// 文件上传 /common/uploadByStream
export const uploadByStream = (data) => {
  return api.post(`${Host}/common/uploadByStream`, { fileCode: 'material', ...data })
}

