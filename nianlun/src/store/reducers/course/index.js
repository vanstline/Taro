import { GET_COURSE_DETAIL } from '../../constants/course'

const defaultState = {
  course: {
    bccList: []
  }
}

export default ( state = defaultState , {type, payload} ) => {
  switch(type) {
    case GET_COURSE_DETAIL:
      return { ...payload }
    default:
      return state
  }
}