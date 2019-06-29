import { GET_BANNER } from '../constants/banner'
import { queryAdvertising } from '../../services/school'

export function GetBanner (data) {
  return async dispatch => {
    let res = await queryAdvertising(data)
    dispatch({ type: GET_BANNER, payload: res.data.data || [] })
  }
}