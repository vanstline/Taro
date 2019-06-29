import { connect } from '@tarojs/redux'
import { GetWorkListPage } from '../store/actions/homework'
import { FetchBookCourseDetail } from '../store/actions/course'

const mapStateToProps = ({homework, system, course}) => ({
  course,
  system,
  bccList: course.bccList,
  allList: homework.allList,
  mineList: homework.mineList,
  anthouerList: homework.anthouerList,
});

const mapDispatchProps = (dispatch) => ({
  getWorkListPage(data, key, cb) { dispatch(GetWorkListPage(data, key, cb)) },
  fetchBookCourseDetail(data, cb) { dispatch(FetchBookCourseDetail(data, cb)) }
})

export default connect(
  mapStateToProps,
  mapDispatchProps
)