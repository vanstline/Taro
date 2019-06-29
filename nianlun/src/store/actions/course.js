import { GET_COURSE_DETAIL } from '../constants/course'
import { bookCourseDetail } from '../../services/book'

export const FetchBookCourseDetail = (data, cb) => {
  return async dispatch => {
    let res = await bookCourseDetail(data)
    try {
      dispatch({ type: GET_COURSE_DETAIL, payload: res.data.data })
      if(cb &&typeof cb === 'function') {
        cb(res.data.data)
      }
    } catch (error) {}
  }
}