
import api from '../api'
import { Host } from '../config'
import { getAuthToken } from '../../utils/auth'

// 获取消息列表
export const queryUserContentMessagePage = async(data) => {
  return await api.post(`${Host}/personalcenter/queryUserContentMessagePage`, data)
}
// 获取我的书童信息
export const findDistributorHotlineInfo = async(data) => {
  return await api.post(`${Host}/personalcenter/findDistributorHotlineInfo`, data)
}

// 卡激活接口
export const activateCard = async(data) => {
  return await api.post(`${Host}/personalcenter/activateCard`, data)
}

// 查询会员卡类型详情
export const findCardType = async(data) => {
  return await api.post(`${Host}/personalcenter/findCardType`, data)
}

// 修改手机号
export const updateMobile = async(data) => {
  return await api.post(`${Host}/personalcenter/updateMobile`, data)
}

// 绑定手机号
export const bindMobile = async(data) => {
  return await api.post(`${Host}/personalcenter/bindMobile`, data, true)
}

// 查询会员卡类型详情列表
export const findCardTypeDetailList = async(data) => {
  return await api.post(`${Host}/personalcenter/findCardTypeDetailList`, data)
}
// 获取详情
export const getUserInfo = async() => {
  return await api.post(`${Host}/user/getUserInfo`)
}

// 我的订单-书课订单列表查询
export const queryOrderBookAndCoursePage = async(data) => {
  return await api.post(
    `${Host}/personalcenter/queryOrderBookAndCoursePage`,
    {pageIndex: 1, pageSize: 50, ...data}
  )
}

// 分享赠送会期
export const giveAwardDaysAfterShare = () => {
  return api.post( `${Host}/personalcenter/giveAwardDaysAfterShare`)
}
// 成为年轮大使
export const toBePromoter = () => {
  return api.post( `${Host}/personalcenter/toBePromoter`)
}
