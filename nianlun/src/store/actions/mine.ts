import * as mine from '../constants/mine';
import { queryUserContentMessagePage, getUserInfo } from '../../services/mine';
export const getMessageList = (payload) => ({
  type: mine.GET_MINE_MESSAGE_LIST,
  payload
})
export const getMineInfo = () => ({
  type: mine.GET_MINE_INFO_DATA,
})

export const getMessageListAsync = (payload) => async(dispatch) => {
  const data = await queryUserContentMessagePage(payload);
}
export const getMineInfoAsync = () => async(dispatch) => {
  const data = await getUserInfo();
}