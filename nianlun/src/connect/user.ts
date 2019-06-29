import { connect } from '@tarojs/redux'
import { FetchGetUserInfo } from '../store/actions/user'

const mapStateToProps = ({user, system}) => ({
  user,
  system
});

const mapDispatchProps = (dispatch) => ({
  fetchGetUserInfo(data, key) { dispatch(FetchGetUserInfo(data, key)) },
})

export default connect(
  mapStateToProps,
  mapDispatchProps
)