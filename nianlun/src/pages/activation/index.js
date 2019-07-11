import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtCurtain, AtButton } from 'taro-ui'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import pageInit from '../pageInit'
// import activation21 from '@images/activation-21.png'

import './index.scss'

const activation21 = `${Taro.IMG_URL}/activation-21.png`
const activation365 =`${Taro.IMG_URL}/activation-365.png`
@pageInit()
export default class Activation extends Taro.Component {

  constructor() {
    super()
    this.state = {
      isOpened: true
    }
  }

  // // 授权
  // tobegin = (res) => {    
  //   const { errMsg, userInfo  } = res.detail
  //   if(errMsg === 'getPhoneNumber:ok') {
  //     // 保存用户信息微信登录    
  //     Taro.setStorage({      
  //       key: "userinfo",      
  //       data: userInfo     
  //     });  
  //     this.handleToBind()
  //   }
  // } 

  config = {
    navigationBarTitleText: '识践串串',
  }

  onClose = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  componentDidMount() {
    
  }

  handleToBind = () => {
  }


  render() {
    return (
      <View className='wrap'>
        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View className='activation' style={{backgroundImage: `url(${activation21})`}}>
            <View className='activation-text'>
              已成功领取该卡片，激活后可免费解 锁所有课程和书籍，是否立即激活？
            </View>
            <View className='btn'>
              <GetPhoneBtn fullName='btn' title="立即激活" onBtn={this.handleToBind.bind(this)}  />
            </View>
          </View>
        </AtCurtain>
      </View>
    );
  }
}
