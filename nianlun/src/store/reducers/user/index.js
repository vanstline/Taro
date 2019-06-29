import { GET_USER_INFO, SET_USER_MOBILE } from '../../constants/user'

const user = { handleMobile: true }

export default function counter (state = user, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        ...action.payload
      }
    case SET_USER_MOBILE:
      return {
        ...state,
        handleMobile: action.payload
      }
     default:
       return state
  }
}
