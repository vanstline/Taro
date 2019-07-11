import api from '../api'
import { Host } from '../config'

// 广告位查询 
// /school/queryAdvertising
export const queryAdvertising = (data) => {
  return api.post(`${Host}/school/queryAdvertising`, data)
}

// 课程章节文稿列表 
// /school/queryBookCourseAllList
export const queryBookCourseAllList = (data) => {
  return api.post(`${Host}/school/queryBookCourseAllList`, data)
}

// 课程章节文稿列表 

export const queryBookCourseList = (data) => {
  return api.post(`${Host}/school/queryBookCourseList`, { pageIndex: 1, pageSize: 10, ...data})
}

// 课程章节文稿列表 
// /school/queryCategoryList
export const queryCategoryList = (data) => {
  return api.post(`${Host}/school/queryBookList`, { pageIndex: 1, pageSize: 10, ...data})
}

// 课程章节文稿列表 
//  /school/queryContentCategoryList
export const queryContentCategoryList = (data) => {
  return api.post(`${Host}/school/queryContentCategoryList`, { pageIndex: 1, pageSize: 10, ...data})
}

// 课程章节文稿列表 
// /school/queryNewBookCourseList
export const queryNewBookCourseList = (data) => {
  return api.post(`${Host}/school/queryNewBookCourseChapterList`, { pageIndex: 1, pageSize: 10, ...data})
}
// 好书推荐查询
export const queryBookCommendPageList = (data) => {
  return api.post(`${Host}/school/queryBookCommendPageList`, { pageIndex: 1, pageSize: 10, ...data})
}
// 精品课程查询
export const queryCourseQualityPageList = (data) => {
  return api.post(`${Host}/school/queryCourseQualityPageList`, { pageIndex: 1, pageSize: 10, ...data})
}
// 每日新知小餐查询
export const queryContentDailyList = (data) => {
  return api.post(`${Host}/school/queryContentDailyList`, { pageIndex: 1, pageSize: 10, ...data})
}

// 学习日志
export const addLearnLog =  async(data) => {
  return await api.post(`${Host}/school/addLearnLog`, { ...data })
}
// 点击日志
export const addClickLog =  async(data) => {
  return await api.post(`${Host}/school/addClickLog`, { ...data })
}

