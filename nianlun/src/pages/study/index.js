import Taro, { Component } from '@tarojs/taro'
import { View, Video, Button } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtModal } from 'taro-ui'
import pageInit from '../pageInit'
import { Catalog, Draft, Showroom } from './components'
import connect from '../../connect/course'
import connectUesr from '../../connect/user'
import WhiteSpace from '../../components/WhiteSpace'
import MyAudio from '../../components/MyAudio'
import MyVedio from '../../components/MyVedio'
// import { giveAwardDaysAfterShare } from '@services/mine'
import Footer from '../../components/Footer'
import { bookCourseChapterWorkPage, bookCourseDetail, bookCourseChapterManuscriptPage } from '../../services/book'
import { showToast } from '../../utils/utils'

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

  config = {
    navigationBarTitleText: '拼命加载中...',
  }

  // 分享
  onShareAppMessage(res) {
    const { courseDetail: { title, imgSharePosters, imgMain, bccList }, currentIndex } = this.state
    const { id } = this.$router.params
    const chapterId = bccList[currentIndex].id
    let obj =  {
      title: title,
      path: `${this.$router.path}?id=${id}&chapterId=${chapterId}&${res}`,
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
    
    this.fetchCourse()
    
  }


  // 获取课程详情
  async fetchCourse() {
    const bookCourseId = this.$router.params.id || 1
    // const chapterId = this.$router.params.chapterId || 0
    let res = await bookCourseDetail({bookCourseId})
    
    try {
      if(res.data.returnCode === 0) {
        const resData = res.data.data
        let { currentIndex = 0, courseDetail } = this.state
        let chapterId = this.$router.params.chapterId || 0
        if(courseDetail.bccList) {
          chapterId = courseDetail.bccList[currentIndex].id
        }
        const bookCourseChapterId = chapterId || resData.bccList[0].id
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
    const { IOS } = this.props.system
    currentIndex += gap
    
    if(currentIndex < 0) {
      showToast('当前已是第一节')
      return
    }
    if( currentIndex >= bccList.length ) {
      showToast('当前已是最后一节')
      return
    }
    if(!bccList[currentIndex].trial && !courseDetail.purchased) {
      IOS ? this.setState({isOpened: true}) : showToast('该课程不能试听, 需解锁购买')
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
    const { courseDetail: { bccList }, bookCourseChapterId, currentIndex } = this.state
    let title = ''
    bccList.forEach( (item,i) => {
      // if(item.id === bookCourseChapterId) {
      //   title = item.name
      // }
      if(i === currentIndex) {
        title = item.name
      }
    } )
    if(!title) {
      title = bccList[0].name
    }
    Taro.setNavigationBarTitle({title})
  }

  onToPage = (currentIndex) => {
    let prevIndex = this.state.currentIndex
    this.handleTurnPage(currentIndex-prevIndex)
  }

  componentWillUnmount() {
  }

  // 播放结束 自动续波下一节
  handleNextLesson = () => {
    const { currentIndex, courseDetail: { bccList } } = this.state
    if(currentIndex >= bccList.length - 1) {
      // showToast('恭喜学完全部课程！')
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
    const header = {
      id: courseDetail.id,
      type: 2,
      
      title: courseDetail.title
    }
    let mediaType = true
    let vedioObj = {}
    let audioObj = {}
    if(courseDetail.bccList&&courseDetail.bccList[currentIndex].bookCourseMediaVideoRespList) {
      vedioObj = courseDetail.bccList[currentIndex].bookCourseMediaVideoRespList[0]
      vedioObj.chapterId = courseDetail.bccList[currentIndex].id,
      mediaType = true
    }
    if(courseDetail.bccList&&courseDetail.bccList[currentIndex].bookCourseMediaAudioRespList) {
      audioObj = courseDetail.bccList[currentIndex].bookCourseMediaAudioRespList[0]
      audioObj.chapterId = courseDetail.bccList[currentIndex].id,
      audioObj.chapterName = courseDetail.bccList[currentIndex].name,
      mediaType = false
    }
    const buttonStyle = {
      padding: 0,
      lineHeight: '39px',
      height: '39px',
      fontSize: '18px',
      fontWeight: '400'
    }
    // console.log(vedioObj, currentIndex)
    return (
      <View className='study'>
        <View className='banner' key={currentIndex}>
          {
            mediaType && vedioObj.id && <MyVedio header={header} vedioObj={vedioObj} callback={this.handleNextLesson} />
          }
          {
            !mediaType && audioObj.id && <MyAudio header={header} audioObj={audioObj} callback={this.handleNextLesson} />
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
        <AtModal
          isOpened={this.state.isOpened}
          title='提示'
          cancelText='联系书童'
          confirmText='确认'
          onClose={ () => this.setState({ isOpened: false }) }
          onCancel={ () => this.setState({ isOpened: false }, () => Taro.navigateTo({ url: '/pages/livehand/index' })) }
          onConfirm={ () => this.setState({ isOpened: false }) }
          content='由于相关规范，iOS功能暂不可用'
        />
      </View>
    )
  }
}