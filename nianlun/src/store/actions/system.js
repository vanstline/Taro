import Taro from '@tarojs/taro'
import {
  STATUS_BAR_HEIGHT,
  IS_IPHONE_X,
  IS_IOS
} from '../constants/system'

// export const getUserStatusBarHeight = () => {
//   return {
//     type: STATUS_BAR_HEIGHT
//   }
// }

// 异步的action
export function GetStartBarHeight () {
  return dispatch => {
    Taro.getSystemInfo({})
      .then(res  => {
        dispatch({
          type: STATUS_BAR_HEIGHT,
          data: res.statusBarHeight || 0
        })
      }
    )
  }
}

export const Is_ipone_X = () => ({type: IS_IPHONE_X})

export const Is_IOS = () => ({type: IS_IOS})