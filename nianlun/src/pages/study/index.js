import Taro, { Component } from '@tarojs/taro'
import { View, Video, Button } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import pageInit from '../pageInit'
import { Catalog, Draft, Showroom } from './components'
import connect from '../../connect/course'
import connectUesr from '../../connect/user'
import WhiteSpace from '../../components/WhiteSpace'
import { giveAwardDaysAfterShare } from '@services/mine'
import Footer from '../../components/Footer'
import { bookCourseChapterWorkPage, bookCourseDetail, bookCourseChapterManuscriptPage } from '../../services/book'
import { showToast } from '../../utils/utils'
import Media from './components/media'
// import animation from '../../assets/test-avi.avi'

import './index.scss'
const banner1 = `${Taro.IMG_URL}/banner1.jpg`
@connect
@connectUesr
@pageInit()
export default class Study extends Component {

  constructor (props) {
    super(props)
    this.state = {
      current: this.$router.params.currentTab || 0,
      currentIndex: 0,
      course: {},
      courseDetail: {},
      bccList: [],
      homeworkType: [],
      mineList: [],
      anthouerList: [],
      draft: {},
      bookCourseChapterId: 0
    }
  }

  // 分享
  onShareAppMessage(res) {
    const { title, imgSharePosters, imgMain } = this.state.courseDetail
    const { user: { distributorId, unionid } } = this.props

    giveAwardDaysAfterShare()
    let obj =  {
      title: title,
      path: `${this.$router.path}?uid=${unionid}&did=${distributorId}`,
      imageUrl: imgSharePosters || imgMain,
    }
    return obj
  }

  // 改变当前页
  handleClick (value) {
    this.setState({
      current: value
    })
  }

  // 获取书籍文稿
  async fetchBooks() {
    const { courseDetail: { id: bookCourseId }, bookCourseChapterId } = this.state
    let res = await bookCourseChapterManuscriptPage({bookCourseId, bookCourseChapterId})
    try {
      if(res.data.returnCode === 0 ) {
        this.setState({ draft: res.data.data.list[0] })
      }
    } catch (error) { }
  }
  
  componentDidShow() {
    Taro.setNavigationBarTitle({
      title: this.state.course.title
    })
    this.fetchCourse()
    Taro.GlobalBgAudioCtx.pause()
  }


  // 获取课程详情
  async fetchCourse() {
    const bookCourseId = this.$router.params.id || 1
    const chapterId = this.$router.params.chapterId || 0
    let res = await bookCourseDetail({bookCourseId})

    try {
      if(res.data.returnCode === 0) {
        const resData = res.data.data
        const bookCourseChapterId = chapterId || resData.bccList[0].id
        let currentIndex = 0
        if(resData.bccList) {
          resData.bccList.forEach( (item, i) => {
            if(item.id == bookCourseChapterId) {
              currentIndex = i
            }
          } )
          
        }
        this.setState(
          { courseDetail: res.data.data, bookCourseChapterId, currentIndex }, 
          () => {
            this.setNavTitle()
            this.fetchBooks()  
            this.fetchHomework()
          }
        )
      }
    } catch (error) { }
  }

  // 获取作业类型
  async fetchHomeworkType (data) {
    let res = await bookCourseChapterWorkPage(data)
    let list = res.data.data.list
    try {
      let homeworkType = [ ]
      homeworkType = list.length ? list : homeworkType
      this.setState({ homeworkType })
    } catch (error) { }
  }

  // 获取作业
  fetchHomework() {
    const { courseDetail: { bookCourseId } ,bookCourseChapterId } = this.state
    let data = { bookCourseId, bookCourseChapterId }
    this.props.getWorkListPage({...data, type: 1}, 'mine')
    this.props.getWorkListPage({...data, type: 2}, 'other')
    this.fetchHomeworkType(data)
  }

  handleTurnPage = (gap) => {
    let { currentIndex, courseDetail: { bccList }, courseDetail, bookCourseChapterId } = this.state

    currentIndex += gap
    // const Toast = (title) => Taro.showToast({icon: 'none', title })
    
    if(currentIndex < 0) {
      showToast('当前已是第一节')
      return
    }
    if( currentIndex >= bccList.length ) {
      showToast('当前已是最后一节')
      return
    }
    if(!bccList[currentIndex].trial && !courseDetail.purchased) {
      showToast('该课程不能试听, 需解锁购买')
      return
    }
    
    this.setState({currentIndex, bookCourseChapterId: bccList[currentIndex].id}, () => {
      this.setNavTitle()
      this.fetchHomework()
      this.fetchBooks(courseDetail.bookCourseId, courseDetail.bccList[currentIndex].id)
    })

  }


  // 设置头部信息
  setNavTitle() {
    const { courseDetail: { bccList }, bookCourseChapterId } = this.state
    let title = ''
    bccList.forEach( item => {
      if(item.id === bookCourseChapterId) {
        title = item.name
      }
    } )
    Taro.setNavigationBarTitle({title})
  }

  onToPage = (currentIndex) => {
    const { courseDetail: { bccList }, bookCourseChapterId } = this.state
    this.setState(
      {currentIndex, bookCourseChapterId: bccList[currentIndex].id},
      () => { this.setNavTitle() }
    )
  }

  componentWillUnmount() {
    // const { getWorkListPage } = this.props
    // const bookCourseId = this.state.courseDetail.id
    // getWorkListPage({ bookCourseId, type: 3 }, 'all')

  }

  // 播放结束 自动续波下一节
  handleNextLesson = () => {
    const { currentIndex, courseDetail: { bccList } } = this.state
    if(currentIndex >= bccList.length - 1) {
      showToast('恭喜学完全部课程！')
      return
    }
    this.handleTurnPage(1)
  }

  render() {
    const tabList = [{ title: '目录' }, { title: '文稿' }, { title: '作品区' }]
    const { mineList, anthouerList } = this.props
    const { 
      currentIndex, current, homeworkType, bccList, course, draft, bookCourseChapterId, courseDetail
    } = this.state
    const { cantry } = this.$router.params
    const bookCourseId = this.$router.params.id || 1
    // let bookCourseChapterId = bccList[currentIndex].id
    const buttonStyle = {
      padding: 0,
      lineHeight: '39px',
      height: '39px',
      fontSize: '18px',
      fontWeight: '400'
    }

    return (
      <View className='study'>
        <View className='banner'>
          {
            courseDetail && <Media source={courseDetail.bccList[currentIndex]} course={courseDetail} onNextLesson={this.handleNextLesson}/>
          }
        </View>
        <View style={{ marginBottom: this.props.system.paddinBottom }}>
          <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
            <AtTabsPane current={current} index={0} >
              <WhiteSpace />
              {
                courseDetail.id && (
                  <Catalog 
                    currentIndex={currentIndex} 
                    courseDetail={courseDetail} 
                    onTurnPage={this.onToPage} 
                    cantry={cantry}
                  />
                )
              }
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <WhiteSpace />
              <Draft draft={draft}/>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <WhiteSpace />
              <Showroom 
                currentIndex={currentIndex} 
                homeworkType={homeworkType} 
                bookCourseId={bookCourseId} 
                bookCourseChapterId={bookCourseChapterId}
                mineList={mineList}
                anthouerList={anthouerList}
              />
            </AtTabsPane>
          </AtTabs>
        </View>
        <Footer >
          <View className='study-footer'>
            <Button style={buttonStyle} onClick={ () => Taro.switchTab({ url: '/pages/school/index' }) }>回学堂</Button>
            <Button style={buttonStyle} onClick={this.handleTurnPage.bind(this, -1)}>上一节</Button>
            <Button style={buttonStyle} onClick={this.handleTurnPage.bind(this, 1)}>下一节</Button>
            <Button style={buttonStyle} openType='share'>分享</Button>
          </View>
        </Footer>
      </View>
    )
  }
}