import api from '../api'
import { Host } from '../config'

// 短信验证码发送 /sms/sendSmsCaptcha
export const sendSmsCaptcha = async(mobile) => {
  return await api.post(`${Host}/sms/sendSmsCaptcha`, { mobile })
}