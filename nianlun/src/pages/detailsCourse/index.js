import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Form, Switch, Button } from '@tarojs/components'
import Numeral from 'numeral';
import { AtTabs, AtTabsPane } from 'taro-ui'
// import { connect } from '@tarojs/redux'
import connect from '../../connect/course'
import connectUser from '../../connect/user'

import { thubmbsUp, getWorkListPage } from '@services/homework'
import { giveAwardDaysAfterShare } from '@services/mine'
import '../../services/order'
import { bookCourseDetail } from '@services/book'
import MyCard from '../../components/MyCard'
import WhiteSpace from '../../components/WhiteSpace'
import Footer from '../../components/Footer'
import HomeWork from '../../components/Homework'
import ToHtml from '../../components/WxParse/index'
import { clientRect, getTime } from '../../utils/utils'
import pageInit from '../pageInit'


import './index.scss'

const play = `${Taro.IMG_URL}/play.png`
const player = `${Taro.IMG_URL}/player.png`
@connect
@connectUser
@pageInit()
export default class Subject extends Component {

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      recommendTop: 0,
      catalogTop: 0,
      homeworkTop: 0,
      isScrool: false,
      homeworkList: [],
    }
  }

  handleClick (value) {
    this.setState({
      current: value,
      isScrool: true
    })
  }

  handleClickToStudy = (item, i) => {
    const id = this.$router.params.id || global.common.bookCourseId
    const { course: { purchased, unitPrice, iosPrice, member, bccList } } = this.state
    if(purchased || member) {
      // 会员直接进入阅读页  有章节 传章节 没有就首页
      if(item) {
        Taro.navigateTo({url: `/pages/study/index?id=${id}&chapterId=${item.id}`})

      } else {
        Taro.navigateTo({url: `/pages/study/index?id=${id}&chapterId=${bccList[0].id}`})
      }
    } else {
      // 非会员 看当前是否可以试听 没有去购买页
      if(item) {
        if(item.trial) {
          Taro.navigateTo({url: `/pages/study/index?id=${id}&chapterId=${item.id}`})
        } else {
          Taro.navigateTo({url: `/pages/buy/index?id=${id}&unitPrice=${unitPrice}&member=${member}&type=3`})
        }
      } else {
        Taro.navigateTo({url: `/pages/study/index?id=${id}&chapterId=${bccList[0].id}`})
      }
    }
  }

  componentDidMount() {
    // this.fetchLesson()
   
   
  }

  componentDidShow() {
    this.fetchRequset()
    console.log(this.props, '------------this.props')
    Taro.getSystemInfo({
      success:function(res) {
        console.log(res, '-----getSystemInfo')
      }
    })
  }

  fetchRequset() {
    let bookCourseId = this.$router.params.id || global.common.bookCourseId 
    this.fetchBookCourseDetail(bookCourseId)
    this.fetchHomework(bookCourseId)
  }

  // 获取课程详情
  async fetchBookCourseDetail(bookCourseId) {
    let res =  await bookCourseDetail({bookCourseId})
    try {
      if(res.data.returnCode === 0) {
        Taro.setNavigationBarTitle({ title: res.data.data.title })
        this.setState({ course: res.data.data })
      }
    } catch (error) {}
  }
  // 获取作业信息
  async fetchHomework(bookCourseId) {
    let res = await getWorkListPage({bookCourseId, type: 3})
    try {
      if(res.data.returnCode === 0) {
        Taro.setNavigationBarTitle({ title: res.data.data.title })
        this.setState({ homeworkList: res.data.data.list })
      }
    } catch (error) {}
  }

  onShareAppMessage(res) {
    const { title, imgSharePosters, imgMain } = this.state.course
    const { user: { distributorId, unionid } } = this.props
    giveAwardDaysAfterShare()
    let obj =  {
      title: title,
      path: `${this.$router.path}?uid=${unionid}&did=${distributorId}`,
      imageUrl: imgSharePosters || imgMain,
    }
    return obj
  }

  // 获取目录高度
  getTop = (name, Top) => {
    let _this = this
    clientRect(name).exec( res => {
      _this.setState({ [Top]: res[0].top })
    } )
  }

  // 点赞
  handleAdmire = async(id, list) => {
    await thubmbsUp({ userBookCourseWorkId: id })
    try {
      this.setState({ homeworkList: list })
    } catch (error) {}
  }

  handleContact(e) {
    // console.log(e.path, '--------用户所点消息的页面路径path')
    // console.log(e.query, '-----------------对应的参数query')
  }


  render() {
    const tabList = [{ title: '介绍' }, { title: '目录' }, { title: '作品区' }]
    const { current, homeworkList, course  } = this.state
    
    const imgMedia = course.imgMedia || global.common.imgMedia
    const bccList = course.bccList || []
    return (
      <View className='subject'>
        <View className='header'>
          <View className='banner'>
            <Image src={imgMedia} />
            <View className='player'>
              <Image className='player-image' onClick={this.handleClickToStudy.bind(this, null)} src={player} />
              {
                !course.purchased && <View className='audition'  onClick={this.handleClickToStudy.bind(this, null)}>立即试听</View>
              }
            </View>
          </View>
          
        </View>

        <View className='content' style={{ marginBottom: this.props.system.paddinBottom }}>

        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
           {
             tabList.map( (item, i) => {
               return <AtTabsPane key={item.title} className='tab-items' index={i} current={this.state.current} />
             } )
           }
          </AtTabs>
          {
            current === 0 && (
              <View className='recommend' ref={ recommend => this.recommend = recommend  }>
                <WhiteSpace />
                <MyCard title={course.title}>
                  <View className='recommend-body'>
                    <View className='status'>
                      <View className='recent'>更新至{course.updatedChapters}期</View>
                      <View className='man'>{course.studyNum || 0}人学习</View>
                    </View>
                    <View className='price'>{`￥${Numeral(course.unitPrice/100).format('0, 0.00')}`}元</View>
                        <View className='member'>
                          <View className='member-price'>￥0元</View>
                          <View className='member-icon'>会员</View>
                        </View>
                    {/* {
                      course.member && (
                      ) */}
                    {/* } */}
                  </View>
                </MyCard>
                <WhiteSpace />
                <View className='dec'>
                  <ToHtml html={course.courseDesc} />
                </View>
              </View>
            )
          }
          {
            (current === 1 || current === 0) && (
              <View>
                <WhiteSpace />
                <View className='catalog'>
                  <MyCard title='课程名称'>
                    <View className='catalog-body'>
                      {
                        bccList.map( (item, i) => {
                          // let playText = (course.member || course.purchased) ? '播放' : ( !item.trial ? '解锁' : '试学' )

                          // let grayClass = (!course.member || !course.purchased || !item.trial ) ? 'gary' : ''
                          let lessonBtnStatus = (course.member || course.purchased) ? 'lesson-play' : ( !item.trial ? 'lesson-lock' : 'lesson-try' )
                          let isVedio = false
                          isVedio = item.bookCourseMediaVideoRespList && item.bookCourseMediaVideoRespList.some( ele => ele.fileType === 1 )
                          return (
                            <View key={item.id} className='catalog-li at-row' onClick={this.handleClickToStudy.bind(this, item, i) }>
                              <View className='lesson at-col at-col-8'>
                                <View className='lesson-name'>{item.name}</View>
                                <View className='info at-row'>
                                  <View className='type at-col at-col-3'>{!!isVedio ? '视频' : '音频'}</View>
                                  <View className='time at-col at-col-5'>时长 {item.durationTime ? getTime(item.durationTime) : getTime(1244)}</View>
                                </View>
                              </View>
                              <View className='btn-wrap'>
                                <View className={lessonBtnStatus} />
                                {/* <View className={`btn at-col ${grayClass}`}>
                                  <Image className='at-col at-col-4' src={play} />
                                  <Text className='at-col at-col-6'>{playText}</Text>
                                </View> */}
                              </View>
                            </View>
                          )
                        } )
                      }
                    </View>
                  </MyCard>
                </View>
              </View>
            )
          }
          {
            (current === 2 || current === 0) && (
              <View>
                <WhiteSpace />
                <View className='homework'>
                  <MyCard title='学友们的作品'>
                    {
                      !!homeworkList.length ? <HomeWork list={homeworkList} onHandleAdmire={this.handleAdmire} /> : '暂无作业'
                    }
                    
                  </MyCard>
                </View>
              </View>
            )
          }
        </View>
        <Footer>
          <View className='footer'>
              <Button openType='contact' onContact={this.handleContact}>在线咨询</Button>
              <Button onClick={this.handleClickToStudy.bind(this, null)}>试听学习</Button>
              <Button openType='share'>分享</Button>
            </View>
        </Footer>
      </View>
    )
  }
}
