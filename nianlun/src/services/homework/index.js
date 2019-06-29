import api from '../api'
import { Host } from '../config'

// 作业列表 
// /work/getWorkListPage
export const getWorkListPage = (data) => {
  return api.post(`${Host}/work/getWorkListPage`, { pageIndex: 1, pageSize: 10, ...data })
}

// 提交/修改作品
// /work/submitWork
export const submitWork = (data) => {
  return api.post(`${Host}/work/submitWork`, data, true)
}

// 点赞/取消点赞 
// /work/thubmbsUp
export const thubmbsUp = (data) => {
  return api.post(`${Host}/work/thubmbsUp`, data)
}