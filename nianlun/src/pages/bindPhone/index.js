import Taro from '@tarojs/taro';
import { View, Text, Input, Image } from '@tarojs/components';
import { AtButton, AtCountdown } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { sendSmsCaptcha } from '../../services/sms'
import { updateMobile } from '../../services/mine'


import { checkPhone, showToast } from '@utils/utils'
import { FetchGetUserInfo, SetUserMobile } from '../../store/actions/user'
import './index.scss'

const cancel = `${Taro.IMG_URL}/cancel.png`
const bindSuccessIcon = `${Taro.IMG_URL}/bind-success.png`

let timer = null
@connect(({ user }) => ({
  mobile: user.mobile ? true : false
}), (dispatch) => ({
  fetchGetUserInfo(data) { dispatch(FetchGetUserInfo(data)) },
  setUserMobile(data) { dispatch(SetUserMobile(data)) }

}))
export default class BindPhone extends Taro.Component {

  constructor() {
    super()
    this.state = {
      bindStauts: false,
      phone: '',
      verify: '',
      isPhone: false,
      isVerify: false,
      timeOut: 0,
    }
  }
  config = {
    navigationBarTitleText: '绑定手机号',
    comment: true
  }
  handleChangePhone = (e) => {
    const { value } = e.detail
    let isPhone = checkPhone(value)
    this.setState({ phone: value, isPhone })
  }

  handleClearPhone = () => {
    this.setState({ phone: '' })
  }

  handleVerify = (e) => {
    const { isPhone } = this.state
    const { value } = e.detail
    let isVerify = (value.length > 3 && isPhone) ? true : false
    this.setState({ verify: value, isVerify })
  }

  handleToBack = () => {
    console.log('-----------')
    const { path, tab } = this.$router.params

    if(tab) {
      this.props.fetchGetUserInfo()
      Taro.switchTab({ url: path })
    } else {
      Taro.redirectTo({  url: path })
    }
  }

  // 绑定手机号
  handleSetBindStatus = () => {
    const { phone, verify } = this.state
    updateMobile({mobile: phone, captcha: verify, ifGive7Days: true }).then( res => {
      if(res.data.returnCode === 0) this.setState({ bindStauts: true })
    } )
  }

  handleSendSms = () => {
    const { phone, isPhone } = this.state
    if(!phone) {
      showToast('请输入正确手机号')
      return
    }
    sendSmsCaptcha(phone).then( res => {
      showToast('验证码发送成功')
      cb()
    } )
    let cb = () => {
      this.setState({ timeOut: 10 }, () => {
        let { timeOut } = this.state
        clearInterval(timer)
        timer = setInterval( () => {
          timeOut--
          if(timeOut <= 0) {
            clearInterval(timer)
          }
          this.setState({ timeOut })
        }, 1000 )
      })
    }
  }

  // 


  componentWillUnmount() {
    clearInterval(timer)
  }

  render() {
    const { phone, isPhone, verify, isVerify, bindStauts, timeOut } = this.state
    return (
      <View className='bind'>
        {
          !bindStauts ? (
            <View className='binding'>
              <View className='phone'>
                <View className='content'>
                  <View className='deal'>+86</View>
                  <Input 
                    className='input' 
                    value={phone} 
                    maxlength={11} 
                    onInput={this.handleChangePhone} 
                    placeholder='输入手机号' type='number' 
                  />
                </View>
                <View onClick={this.handleClearPhone} className='close'><Image src={cancel}/></View>
              </View>
              <View className='verify'>
                  <Input
                    type='number' 
                    placeholder='请输入验证码' 
                    maxLength={6}
                    onInput={this.handleVerify}
                    value={verify}
                    />
                  <View className={ `verify-btn ${isPhone && 'can-use'}` } onClick={this.handleSendSms}>
                    {
                      !timeOut ? '获取验证码' : `${timeOut}`
                    }
                  </View>
              </View>
              <AtButton disabled={!isVerify} onClick={this.handleSetBindStatus}>绑定</AtButton>
            </View>
          ) : (
            <View className='binded'>
              <View className='binded-content'>
                <View className='img-wrap'>
                  <Image src={bindSuccessIcon} />
                  <View className='bind-text'>恭喜，绑定成功！</View>
                </View>
              </View>
              <AtButton onClick={ this.handleToBack }>返回</AtButton>
            </View>
          )
        }
      </View>
    );
  }
}
