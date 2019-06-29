import api from '../api'
import { Host } from '../config'

// 活动详情 
export const getActivityDetail = (data) => {
    return api.post(`${Host}/studyRoom/getActivityDetail`, data)
}
// 活动列表全部查询 
export const queryActivityPage = (data) => {
    return api.post(`${Host}/studyRoom/queryActivityPage`, {pageIndex: 1, pageSize: 10,...data})
}
// 活动报名/取消报名 
export const signUpActivity = (data) => {
    return api.post(`${Host}/studyRoom/signUpActivity`, data)
}
// 我的课程
export const myBookCourseListPage = (data) => {
    return api.post(`${Host}/studyRoom/myBookCourseListPage`, {pageIndex: 1, pageSize: 10,...data})
}
// 我的书桌
export const myBookDeskListPage = (data) => {
    return api.post(`${Host}/studyRoom/myBookDeskListPage`, {pageIndex: 1, pageSize: 10,...data})
}

