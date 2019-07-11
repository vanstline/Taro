import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtCard, AtButton, AtRate } from 'taro-ui'
import MyGraphic from '../../components/MyGraphic'
import MyCard from '../../components/MyCard'


import {queryActivityPage,signUpActivity} from '../../services/studyroom'




import './index.scss'

export default class Activity extends Taro.Component {

  constructor() {
    super()
    this.state = {
      activity: [],
    }
  }
  config = {
    navigationBarTitleText: '年轮活动',
    comment: true
  } 
  componentDidMount() {
    this.queryActivityPage()
  }



  // 获取活动
  async queryActivityPage() {
    let res = await queryActivityPage()
    this.setState({ activity: res.data.data.list || [] })
  }
  handleToDetail = (id) => {
    Taro.navigateTo({ url: `/pages/activity/detail?id=${id}` })
  }
  render() {

    const { activity } = this.state
    const { type } = this.$router.params
    return(
      <View>
        <View className={`content ${!activity.length ? 'no-cont' : ''}`}>
          {
            activity && activity.length ? (
              <MyCard>
              {
                activity.map((item,index)=>(<View key={index+''} onClick={this.handleToDetail.bind(this,item.id)} className='actives'>
                  <Image src={item.activityCover}/>
                  <View className='main'>
                    <View className='title'>{item.activitySubject}</View>
                    <View className='cont'>
                      <View>时间：{(item.startDate||'').substr(0,16)}-{(item.endDate||'').substr(11,5)}</View>
                      <View>地点：{item.place}</View>
                      {item.signedUp?<AtButton type="primary" size='small'>取消报名</AtButton>:<AtButton size='small'>报名参加</AtButton>}
                    </View>
                  </View>
                </View>))
              }
              </MyCard>
            ) : <View />
          }
        </View>
      </View>
    )
  }
}