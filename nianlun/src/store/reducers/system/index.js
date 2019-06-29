import { STATUS_BAR_HEIGHT, IS_IPHONE_X, IS_IOS } from '../../constants/system'

const system = {
  statusBarHeight: 0,
  paddinBottom: 0,
  IOS: false
}

export default function counter (state = system, action) {
  switch (action.type) {
    case STATUS_BAR_HEIGHT:
      return {
        ...state,
        statusBarHeight: action.data
      }
    case IS_IPHONE_X:
      return {
        ...state,
        paddinBottom: '34px'
      }
    case IS_IOS:
      return {
        ...state,
        IOS: true
      }
    default:
       return state
  }
}
