import {  GET_USER_INFO, SET_USER_MOBILE } from '../constants/user'

import { getUserInfo,updateUserInfo } from '../../services/user';


export const FetchGetUserInfo = (data) => {
  return async dispatch => {
    let res = await getUserInfo(data)
    try {
      if(res.data.returnCode === 0) {
        dispatch ({ type: GET_USER_INFO, payload: res.data.data })
      }
    } catch (error) {}
  }
}
export const FetchUpdateUserInfo = (data,cb) => {
  return async dispatch => {
    let res = await updateUserInfo(data)
    try {
      if(res.data.returnCode === 0) {
        if(cb && typeof cb === 'function'){
          cb()
        }
        // dispatch ({ type: GET_USER_INFO, payload: res.data.data })
      }
    } catch (error) {}
  }
}

export const SetUserMobile = (data) => ({ type: SET_USER_MOBILE, payload: data })

// /user/updateUserInfo