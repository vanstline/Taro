import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { findDistributorHotlineInfo } from '../../services/mine';
import { LButton } from '../../components/common'

import WhiteSpace from '../../components/WhiteSpace'
import MyCard from '../../components/MyCard'

import './index.scss'

const livehand = `${Taro.IMG_URL}/livehand.png`
export default class Livehand extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
  }

  getInfo = async () => {
    const response = await findDistributorHotlineInfo({});
    if (response.data.returnCode === 0) {
      this.setState({
        data: response.data.data,
      })
    }
  }
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '我的书童'
    })
    this.getInfo();
  }

  doNotKnowAdd = () => {
    Taro.navigateTo({
      url: `/pages/h5Static/addWecaht`
    })
  }
  makePhoneCall = () => {
    Taro.makePhoneCall({phoneNumber: this.state.data.mobile})
  }
  addWeChat = () => {
    Taro.setClipboardData({
      data: this.state.data.wechatNo,
    })
   }
  render() {
    const { data } = this.state;
    return (
      <View className='livehand'>
        <View className='image-container'>
          <Image src={livehand} />
          <View className='livehand-content'>
            <View className='livehand-content-title'>亲爱的同学：</View>
            {
              data.wechatNo ? <View className='livehand-content-body'>
              很高兴与您见面，我是您的学习书童，我的微信号是{data.wechatNo || ''}，点击下方“添加书童”，添加我的微信，也可以直接通过电话与我联系，有任何问题都可以找我，希望与您在识践串串共同成长。
            </View> : <View className='livehand-content-body' style={{textAlign: 'center'}}>
              <View>该分院正在聘请书童</View>
              <View>敬请期待</View>
            </View>
            }
            
          </View>
        </View>
        {
          data.wechatNo ? <View className='livehand-button-container'>
          <View className='lbtn' onClick={this.addWeChat}>添加微信</View>
          <View className='lbtn' onClick={this.makePhoneCall}>拨打电话</View>
        </View> : <View className='livehand-button-container'>
          <View className='lbtn' style={{background: 'rgba(187,187,187,1)', color: '#fff'}}>添加微信</View>
          <View className='lbtn' style={{background: 'rgba(187,187,187,1)', color: '#fff'}}>拨打电话</View>
        </View>
        }
        <View className='livehand-button-container-after'>
          <Text onClick={this.doNotKnowAdd}>不会添加点这里</Text>
        </View>
      </View>
    )
  }
}