import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
// import { withRouter } from '@tarojs/router'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtAvatar, AtIcon } from 'taro-ui'
// import connect from '../../../connect/course'
import { getTime } from '@utils/utils'
import '../index.scss'

// @connect
export default class Catalog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rect: {
        width: 0
      },
    }
  }

  handleTouch = (e) => {
    e.stopPropagation()
  }

  handleChoiceLesson = (lesson) => {
    
    const { cantry, courseDetail } = this.props
    // const { bccList } = this.state
    if(cantry && !lesson.trial) {
      Taro.showToast({ icon: 'none', title: '该课程不能试听, 需解锁购买' })
      return
    }
    courseDetail.bccList.forEach( (item, i) => {
      if(item.id === lesson.id) {
        this.props.onTurnPage(i)
      }
    } )
  }

  componentDidMount() {
    this.getWidth()

  }

  getWidth = () => {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select('.lesson-items-wrap').boundingClientRect().exec(res => {
      this.setState({ rect: res[0] })
    })
  }

  handleDetail = () => {
    Taro.navigateTo({ url: `/pages/detailsCourse/index?id=${this.props.courseDetail.id}` })
  }

  render() {
    const { rect } = this.state
    const { courseDetail={}, currentIndex = 0 } = this.props
    const { purchased, bccList = [], updatedChapters = 0, title = '' } = courseDetail
    let nowBcc = bccList ? bccList[currentIndex] : {}
    let leftWidth = currentIndex ? currentIndex * rect.width - rect.width/2 : 0
    
    return (
      <View className='catalog'>
        <View className='catalog-body'>
          <View className='catalog-li'>
            <View className='lesson at-col at-col-9'>
              <View >{courseDetail.title}</View>
              <View className='info'>
                <View className='type at-col-2'>更新至{updatedChapters}期</View>
                <View className='time at-col-4'>时长 {getTime(nowBcc?nowBcc.durationTime:0)}</View>
              </View>
            </View>
            <View className='btn-wrap at-col-3'>
              <View className='at-col-6' onClick={this.handleDetail}>详情</View>
              <AtIcon value='chevron-right' size='16'></AtIcon>
            </View>
          </View>
        </View>
        <View className='catalog-content' onTouchMove={this.handleTouch}>
          <ScrollView 
            className='scroll'
            scrollX={true}
            scrollWithAnimation
            scrollLeft={leftWidth}
          >
            {
              bccList && bccList.map( item => {
                let fileType = item.bookCourseMediaVideoRespList ? '视频' : '音频'
                return (
                  <View key={item.id} className='lesson-items-wrap'>
                    <View 
                      className={`lesson lesson-items ${nowBcc.id === item.id && 'active'}`} 
                      onClick={() => this.handleChoiceLesson(item)}
                    >
                      <View className='lesson-name'>{item.name}</View>
                      <View className='sign'>{fileType}</View>
                      { (!purchased && item.trial) && <View className='try'>可试学</View> }
                      {(!purchased && !item.trial) && <View className='lock' />  }
                    </View>
                  </View>
                )
              } )
            }
          </ScrollView>
        </View>
      </View>
    )
  }
}


