import { GET_ALL_HOME_WORK, GET_ANTHOUER_HOME_WORK, GET_MINE_HOME_WORK } from '../../constants/homework'
import { on } from 'cluster';

const defaultState = {
  allList: [],
  mineList: [],
  anthouerList: []
}

export default ( state = defaultState , {type, payload} ) => {
  switch(type) {
    case GET_ALL_HOME_WORK:
      return {
        ...state,
        allList: payload
      }
    case GET_MINE_HOME_WORK:
      return Object.assign({}, {
        ...state,
        mineList: payload
      })
    case GET_ANTHOUER_HOME_WORK:
        return Object.assign({}, {
          ...state,
          anthouerList: payload
        })
    default:
      return state
  }
}