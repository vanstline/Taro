import Taro from '@tarojs/taro'
import api from '../api'
import { Host } from '../config'
const MINI_PROGRAM = 'MINI_PROGRAM'

// 黑卡下单购买 /order/blackCardOrder
export const blackCardOrder = async(data) => {
  let openId = getOpenId()
  let header = { 'x-app-platform': MINI_PROGRAM }
  return await api.post(`${Host}/order/blackCardOrder`, { serviceType: MINI_PROGRAM, openId, ...data }, false, header)
}

// 课程下单购买 /order/bookCourseOrder
export const bookCourseOrder = async(data) => {
  let openId = getOpenId()
  let header = { 'x-app-platform': MINI_PROGRAM }
  return await api.post(`${Host}/order/bookCourseOrder`, { serviceType: MINI_PROGRAM, openId, ...data }, false, header)
}

// 我的书币充值 /order/bookCurrencyRechargeOrder
export const bookCurrencyRechargeOrder = async(data) => {
  let openId = getOpenId()
  let header = { 'x-app-platform': MINI_PROGRAM }
  return await api.post(`${Host}/order/bookCurrencyRechargeOrder`, { serviceType: MINI_PROGRAM, openId, ...data }, false, header)
}

// 书单下单购买 /order/bookListOrder
export const bookListOrder = async(data) => {
  let openId = getOpenId()
  let header = { 'x-app-platform': MINI_PROGRAM }
  return await api.post(`${Host}/order/bookListOrder`, { serviceType: MINI_PROGRAM, openId, ...data }, false, header)
}

// 书籍下单购买 /order/bookOrder
export const bookOrder = async(data) => {
  let openId = getOpenId()
  let header = { 'x-app-platform': MINI_PROGRAM }
  return await api.post(`${Host}/order/bookOrder`, { serviceType: MINI_PROGRAM, openId, ...data }, false, header)
}


// 获取openId
function getOpenId () {
  let res = Taro.getStorageSync('code2Session')
  return res.openid
}