import api from '../api'
import { Host } from '../config'

// 用户详情 
export const getUserInfo = (data) => {
    return api.post(`${Host}/user/getUserInfo`, data)
}
export const updateUserInfo = (data) => {
    return api.post(`${Host}/user/updateUserInfo`, data)
}

