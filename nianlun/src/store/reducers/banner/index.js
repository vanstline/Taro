import { GET_BANNER } from '../../constants/banner'

const defalutState = {
  bannerList: []
}

export default (state = defalutState, action) => {
  switch (action.type) {
    case GET_BANNER:
      return {
        ...state,
        bannerList: action.payload
      }
     default:
       return state
  }
}