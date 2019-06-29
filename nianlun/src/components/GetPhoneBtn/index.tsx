import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import connect from '../../connect/user'
import { bindMobile } from '../../services/mine'
// import
interface Props {
  title: string,
  onBtn: any,
  fullName: string,
  size: string,
}

@connect
export default class GetPhoneBtn extends Component<Props, any> {

  // 授权
  tobegin = (res) => {    
    const { errMsg, encryptedData, iv } = res.detail
    const _this = this
    if(errMsg === 'getPhoneNumber:ok') {
      let openId = Taro.getStorageSync('code2Session').openid
      let obj = { openId, encryptedData, iv, ifGive7Days: 1 }
      bindMobile(obj)
        .then( res => {
          if(res.data.returnCode === 0) {
            _this.callbck()
          }
        } )
    }
  } 
  
  handleClick = () => {
    this.callbck()
  }

  callbck = () => {
    if(this.props.onBtn && typeof this.props.onBtn === 'function') {
      this.props.onBtn()
    }
  }

  render() {
    const { fullName = '', title = '', user: { mobile }, size = 'normal' } = this.props
    return (
      <View>
        {
          !mobile 
          ? <AtButton 
              className={fullName} 
              size={size} 
              openType='getPhoneNumber' 
              onGetPhoneNumber={this.tobegin}>{title}</AtButton>
          : <AtButton 
              className={fullName} 
              size={size} 
              onClick={this.handleClick}>{title}</AtButton>
        }
      </View>
    )
  }
}