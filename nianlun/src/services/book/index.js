import api from '../api'
import { Host } from '../config'

// 课程章节文稿列表
export const bookCourseChapterManuscriptPage = (data) => {
  return api.get(`${Host}/book/bookCourseChapterManuscriptPage`, {pageIndex: 1, pageSize: 100, ...data})
}

// 课程章节列表
export const bookCourseChapterPage = (data) => {
  return api.get(`${Host}/book/bookCourseChapterPage`, {pageIndex: 1, pageSize: 30, ...data})
}

// 课程详情(简介) /book/bookCourseChapterWorkPage
export const bookCourseChapterWorkPage = (data) => {
  return api.post(`${Host}/book/bookCourseChapterWorkPage`, {pageIndex: 1, pageSize: 50, ...data})
}

// 课程详情(简介) /book/bookCourseDetail
export const bookCourseDetail = (data) => {
  return api.post(`${Host}/book/bookCourseDetail`, data)
}

// 课程学习人数统计 /book/bookCourseStudyStat
export const bookCourseStudyStat = (data) => {
  return api.post(`${Host}/book/bookCourseStudyStat`, data)
}

// 书籍详情 /book/bookDetail
export const bookDetail = (data) => {
  return api.get(`${Host}/book/bookDetail`, data)
}

// 书籍文稿列表 /book/bookManuscriptListPage
export const bookManuscriptListPage = (data) => {
  return api.post(`${Host}/book/bookManuscriptListPage`, { pageIndex: 1, pageSize: 10, ...data} )
}

// 书籍学习人数统计 /book/bookStudyStat
export const bookStudyStat = (data) => {
  return api.post(`${Host}/book/bookStudyStat`, data)
}

// 书籍相关购买价格计算 /book/orderPrice
export const orderPrice = (data) => {
  return api.post(`${Host}/book/orderPrice`, data)
}

// 用户课程小节试听统计 /book/userBookCourseTrialStat
export const userBookCourseTrialStat = (data) => {
  return api.post(`${Host}/book/userBookCourseTrialStat`, data)
}

// 微信课程详情 /book/wxBookCourseDetail
export const wxBookCourseDetail = (data) => {
  return api.get(`${Host}/book/wxBookCourseDetail`, data)
}

// 微信书籍详情 /book/wxBookDetail
export const wxBookDetail = (data) => {
  return api.get(`${Host}/book/wxBookDetail`, data)
}

// 微信书单详情 /book/wxBookListDetail
export const wxBookListDetail = (data) => {
  return api.get(`${Host}/book/wxBookListDetail`, data)
}