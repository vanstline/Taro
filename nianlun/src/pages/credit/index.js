import Taro from '@tarojs/taro';
import { View, Image} from '@tarojs/components';
import { AtCard, AtButton, AtProgress, AtToast  } from 'taro-ui'
import MyGraphic from '../../components/MyGraphic'
import MyCard from '../../components/MyCard'


import {getActivityDetail,signUpActivity} from '../../services/studyroom'




import './index.scss'

export default class Credit extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      showToast:false,
    }
  }
  config = {
    navigationBarTitleText: '年轮学分',
    comment: true
  } 
  componentDidMount() {
    
    // this.getActivityDetail()
  }



  // 获取活动
  async getActivityDetail() {
    const {id } = this.$router.params;
    let res = await getActivityDetail({offlineActivityId:id})
    this.setState({ data: res.data.data || {} })
  }
  

  render() {

    const { data,
      toastStatus,
      toastText,
      showToast
    } = this.state
    const { type } = this.$router.params
    const {
    
    }= data;
    return(
        
        <View className='credit-detail'>
          <View className='header'>
            <View className="level">
              <View className="cur">
                <View className="cur-score">当前学分：<View className="score">50分</View></View>
                <View>等级：5星学童</View>
              </View>
              <View className="lack">还差<View className="score">20分</View>可升级</View>
            </View>
          </View>
          <View className="body">
            <View className="title">奖励规则</View>
            <View className="item">
              <View>每日登录</View>
              <View className="score">+1学分</View>
            </View>
            <View className="item">
              <View>每日学习每10分钟</View>
              <View className="score">+1学分</View>
            </View>
            <View className="item">
              <View>每连续登录3天</View>
              <View className="score">+1学分</View>
            </View>
          </View>
            
          <AtToast status={toastStatus} text={toastText} hasMask={true} isOpened={showToast}/>

          
        </View>
        
        

          
        
    )
  }
}