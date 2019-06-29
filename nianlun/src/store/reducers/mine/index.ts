import { GET_MINE_MESSAGE_LIST } from '../../constants/mine'

const INITIAL_STATE = {
  messageList: [],
  info: {},
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_MINE_MESSAGE_LIST:{

    }
    case GET_MINE_MESSAGE_LIST:
      return {
        ...state,
      }
    default:
      return state
  }
}