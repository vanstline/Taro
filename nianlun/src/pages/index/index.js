import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton, AtRate,AtProgress } from 'taro-ui'
import { connect } from '@tarojs/redux'
import pageInit from '../pageInit'
// import request from '@@/services/request'
import MyCard from '../../components/MyCard'
import MyGraphic from '../../components/MyGraphic'
import WhiteSpace from '../../components/WhiteSpace'
import {myBookCourseListPage,
  myBookDeskListPage,
  queryActivityPage} from '../../services/studyroom';
import {
  getUserInfo
} from '../../services/user';
import './index.scss'

@connect(({ counter, user }) => ({
  counter,
  mobile: user.mobile ? true : false
}), (dispatch) => ({
}))
@pageInit()
class Index extends Component {

  constructor() {
    super()
    this.state = {
      rate: 7,
      nowRate: 5,
      userInfo:{},
      myBookDesk:[],
      myBookCourse:[],
      myBookDeskLen:3,
      myBookCourseLen:3,
      activity:[],
    }
  }

  config = {
    navigationBarTitleText: '自习室',
    comment: true
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidShow() {
      
      this.fetchPages()
  }

  componentWillUnmount () { }


  componentDidHide () { }
  // 获取页面数据
  async fetchPages() {
    Promise.all([
      getUserInfo(),
      myBookCourseListPage(),
      myBookDeskListPage(),
      queryActivityPage()
    ])
      .then( resArr => {
        this.setState({
          userInfo: resArr[0].data.data || {},
          myBookCourse: resArr[1].data.data || {},
          myBookDesk: resArr[2].data.data || {},
          activity: resArr[3].data.data.list || [],
          isBindPhone: resArr[0].data.data.mobile ? true : false
        })
      } )
  }
  //  1 课程 2书桌
  handleUnfold =(type,isPackUp)=>{
    const len = isPackUp?3:100
    if(type===1){
      this.setState({myBookCourseLen:len})
    }
    if(type===2){
      this.setState({myBookDeskLen:len})
    }
  }
  // // 我的信息
  // async getUserInfo() {
  //   let res = await getUserInfo()
  //   this.setState({ userInfo: res.data.data || {} })
  // }
  
  // // 我的课程
  // async myBookCourseListPage() {
  //   let res = await myBookCourseListPage()
  //   this.setState({ myBookCourseList: res.data.data.list || [] })
  // }
  // // 我的书桌
  // async myBookDeskListPage() {
  //   let res = await myBookDeskListPage()
  //   this.setState({ myBookDeskList: res.data.data.list || [] })
  // }
  // // 获取活动
  // async queryActivityPage() {
  //   let res = await queryActivityPage({pageIndex: 1,pageSize:1})
  //   this.setState({ activity: res.data.data.list || [] })
  // }
  handleToCredit =()=>{
    Taro.navigateTo({ url: `/pages/credit/index` })
  } 
  handleToSubject = (media,item) => {
    if(media === 'study') {
      Taro.navigateTo({ url: `/pages/${media}/index?id=${item.bookCourseId}&chapterId=${item.bookCourseChapterId}` })

    } else {
      Taro.navigateTo({ url: `/pages/${media}/index?id=${item.bookId}` })
    }
  }
  handleToActivity =()=>{
    Taro.navigateTo({ url: `/pages/activity/index` })
  }
  handleToActivityDetail = (id) => {
    Taro.navigateTo({ url: `/pages/activity/detail?id=${id}&tab=1` })
  }

  formatDate = (sec,type="m")=>{
  
    sec = sec || 0
    let time = 1;
    if(type==='h'){
      time = 60 * 60
      return parseFloat(sec/time).toFixed(1) || 0
    }
    if(type==='m'){
      time = 60
    }
    return parseInt(sec/time) || 0
  }
  
  render () {
    const { rate,userInfo,myBookCourse,myBookDesk,myBookCourseLen,myBookDeskLen, nowRate,activity } = this.state
    const { mobile } = this.props
    return (
      <View className='index'>

        <View className='head'>
          <View className='card'>
            <View className='sign'>{userInfo.distributorName||''}</View>
            <View className='card-content'>
              <View className='info'>
                <View className='level'>
                  <Text className='txt'>{userInfo.nameFirst||''}</Text>
                  <Text className='icon'>{userInfo.nameSecond||''}</Text>
                </View>
                <View className='rate'><AtRate max={rate} value={userInfo.levelSecond||0} /></View>
                <View className='progress' onClick={this.handleToCredit}>已获<Text>{userInfo.credit||0}</Text>学分 再获<Text>{userInfo.promoteCredit||0}</Text>学分晋级</View>
              </View>
              <View className='img'>
                <Image src={userInfo.avatar} />
              </View>
            </View>
            <View className='learn-log'>
                <View className='learn-log-items'>
                  <View>今日学习</View>
                  <View className='time'><Text>{this.formatDate(userInfo.todayLearnTime)}</Text>分钟</View>
                </View>
                <View className='learn-log-items'>
                  <View>连续学习</View>
                  <View className='time'><Text>{userInfo.continuousLearnDays}</Text>天</View>
                </View>
                <View className='learn-log-items'>
                  <View>累计学习</View>
                  <View className='time'><Text>{this.formatDate(userInfo.totalLearnTime ,'h')}</Text>小时</View>
                </View>
                <View className='learn-log-items'>
                  <View>学习分享</View>
                  <View className='time'><Text>{userInfo.shareCnt ||0}</Text>次</View>
                </View>
              </View>
          </View>
        </View>
        <View className='content' style={{paddingTop:0}}>
          <MyCard title={`我的课程（${myBookCourse.total||0}门课程）`}>
            <View style={{ height: '24px' }} />
            {
              myBookCourse.list && myBookCourse.list.map((item,i)=>(i<myBookCourseLen&& item.bookCourseId&&<View className='books' style={{ paddingBottom: '24px' }}  onClick={this.handleToSubject.bind(this, 'study',item)}>
              <MyGraphic title={item.title} img={item.imgMain}>
                <View className="graphic-describe">
                  <View className='graphic-content'>
                      <AtProgress percent={item.learnRate} strokeWidth={4} />
                      <View className="progress-text">
                        <View className="last-study">上次学习<View className="last-study-num"> 第{item.lastLearnChapter}期</View></View>
                        <View className="already-study">已学习{item.learnRate}%</View>
                      </View>
                  </View>
                  <View className='graphic-button'>共{item.issueNum}期</View>
                </View>
              </MyGraphic>
            </View>))
            }
            
            {myBookCourse.total>3&&<View className='btn'>{myBookCourseLen===3?<View className='sub-btn' onClick={this.handleUnfold.bind(this,1,false)}>展开所有</View>:<View className='sub-btn' onClick={this.handleUnfold.bind(this,1,true)}>收起</View>}</View>}
            
          </MyCard>
          <WhiteSpace />
          <MyCard title={`我的书桌（${myBookDesk.total||0}本书）`}>
            <View style={{ height: '24px' }} />
            {
              myBookDesk.list && myBookDesk.list.map((item,i)=>i<myBookDeskLen && item.bookId&& <View className='books' onClick={this.handleToSubject.bind(this, 'detailsBook',item)} style={{ paddingBottom: '24px' }} >
              <MyGraphic title={item.bookTitle} img={item.imgMain}>
                
                <View className="graphic-describe">
                  <View className='graphic-content'>{item.commendTitle}</View>
                  <View className='graphic-button'>
                  <AtProgress className={item.reRead?'progress-reRead':''} percent={item.learnRate} strokeWidth={4} />
                      <View className="progress-text">
                        {item.reRead?<View className="reRead-study">复听{item.learnRate}%</View>:<View className="already-study">已听{item.learnRate}%</View>}
                      </View>
                  </View>
                 
                </View>
              </MyGraphic>
            </View>)
            }
            {myBookDesk.total>3&&<View className='btn'>{myBookDeskLen===3?<View className='sub-btn' onClick={this.handleUnfold.bind(this,2,false)}>展开所有</View>:<View className='sub-btn' onClick={this.handleUnfold.bind(this,2,true)}>收起</View>}</View>}
          </MyCard>
          <WhiteSpace />
          <MyCard title='年轮活动' extra='更多' extraClick={this.handleToActivity}>
            {
              activity.map((item,index)=>(index===0&&<View key={index+''} onClick={this.handleToActivityDetail.bind(this,item.id)} className='actives' style={{paddingTop: '16px'}}>
              <Image src={item.activityCover}/>
              <View className='main'>
                <View className='title'>{item.activitySubject}</View>
                <View className='cont'>
                  <View>时间：{(item.startDate||'').substr(0,16)}-{(item.endDate||'').substr(11,5)}</View>
                  <View>地点：{item.place}</View>
                  {item.status===1&&<AtButton size='small'>报名参加</AtButton>}
                </View>
              </View>
            </View>))

            }
            
          </MyCard>
        </View>
      </View>
    )
  }
}

export default Index


