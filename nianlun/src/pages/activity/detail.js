import Taro from '@tarojs/taro';
import { View, Image} from '@tarojs/components';
import { AtCard, AtButton, AtProgress, AtToast  } from 'taro-ui'
import MyGraphic from '../../components/MyGraphic'
import MyCard from '../../components/MyCard'
import ToHtml from '../../components/WxParse/index'


import {getActivityDetail,signUpActivity} from '../../services/studyroom'




import './index.scss'

export default class ActivityDetail extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      showToast:false,
    }
  }
  config = {
    navigationBarTitleText: '年轮活动',
    comment: true
  } 
  componentDidMount() {
    
    this.getActivityDetail()
  }



  // 获取活动
  async getActivityDetail() {
    const {id } = this.$router.params;
    let res = await getActivityDetail({offlineActivityId:id})
    this.setState({ data: res.data.data || {} })
  }
  // 获取活动
  async signUpActivity(id,signedUp) {
    let res = await signUpActivity({offlineActivityId:id})
    if(res.data.data){
   
      this.setState({
        showToast:true,
        toastStatus:'success',
        toastText:signedUp?'取消成功':'报名成功'
      })
      this.getActivityDetail()
    }
    
  }
  handleGps =(adress)=>{
    Taro.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
       var latitude = res.latitude
       var longitude = res.longitude
       Taro.openLocation({
        latitude: latitude,
        longitude: longitude,
        name:adress,
        scale: 28
       })
      }
  })
  }

  render() {

    const { data,
      toastStatus,
      toastText,
      showToast
    } = this.state
    const { type } = this.$router.params
    const {
      signUpNum=0,
      attendNum=1
    }= data;
    return(
        
        <View className='actives-detail'>
          <View className='header'>
            <Image src={data.activityCover}/>
            <View className='main'>
              <View className='title'>{data.activitySubject}</View>
              <View className="progress">
                <View style={{width:'70%'}}>
                <AtProgress percent={(signUpNum/attendNum)*100} strokeWidth={4} />
                </View>
              
                <View className="signUpNum">{signUpNum}/{attendNum}已报名</View>
              </View>
              
              <View className='cont'>
                <View>时间：{(data.startDate||'').substr(0,16)}-{(data.endDate||'').substr(11,5)}</View>
                <View className='place'>地点：{data.place}</View>
                {data.place&&<View className="gps" onClick={this.handleGps.bind(this,data.place)}><Text className='nav-bg'/>导航</View>}
              </View>
            </View>
            
          </View>
          <View className='body'>
            <View className='title'>【活动详情】</View>
            <View className='lecturer'>讲师：{data.narrator}</View>
            <View className='info'>
              <ToHtml html={data.activityDetail} />
            </View>

          </View>
          <View className='footer'>
            <View className='sign-up'>
              {data.signedUp?<AtButton type="primary" style={{ background: '#ff6105' }} onClick={this.signUpActivity.bind(this,data.id,data.signedUp)} >取消报名</AtButton>:
              (signUpNum===attendNum?<AtButton className="unJoin">报名人数已满</AtButton>: <AtButton onClick={this.signUpActivity.bind(this,data.id,false)} >报名参加</AtButton>)
              }
            </View>
          </View>
          <AtToast status={toastStatus} text={toastText} hasMask={true} isOpened={showToast}/>

          
        </View>
        
        

          
        
    )
  }
}