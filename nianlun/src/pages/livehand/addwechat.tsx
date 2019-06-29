import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { LButton } from '../../components/common'

const livehand = `${Taro.IMG_URL}/livehand.png`

import './addwechat.scss'

export default class Livehand extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
  }
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '添加微信'
    })
  }

  render() {
    const { data } = this.state;
    return (
      <View className='add-weChat-container'>
        <View>1. 打开手机端微信，然后点击右上角位置的+添加符号,点击添加朋友</View>
        <View></View>
        <View>2. 进入添加朋友的搜索栏中，在这里黏贴微信号：weixin1234，搜索</View>
        <View></View>
        <View>3. 找到信息栏，点击-添加到通讯录</View>
        <View></View>
        <View>4. 在验证框中输入“年轮学员”，最后点击发送</View>
        <View className='add-weChat-button'>
          <LButton style={{width: '100%'}}>添加微信</LButton>
        </View>
      </View>
    )
  }
}