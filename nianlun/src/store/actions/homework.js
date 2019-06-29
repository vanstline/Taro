import { getWorkListPage, thubmbsUp } from '../../services/homework/index'
import { GET_ALL_HOME_WORK, GET_ANTHOUER_HOME_WORK, GET_MINE_HOME_WORK } from '../constants/homework'


const mapObj = {
  all: GET_ALL_HOME_WORK,
  mine: GET_MINE_HOME_WORK,
  other: GET_ANTHOUER_HOME_WORK
}

export const GetWorkListPage = (data, key, cb) =>  {
  return async dispatch => {
    let res = await getWorkListPage(data)
    try {
      if(res.data.returnCode === 0) {
        dispatch({ type: mapObj[key] || mapObj.all, payload: res.data.data.list || []  })
        if(cb && typeof cb === 'function') {
          cb()
        }
      }
    } catch (error) { }
  }
}
