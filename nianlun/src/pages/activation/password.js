import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import connect from '../../connect/user'
import { AtButton } from 'taro-ui'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import { activateCard, getUserInfo } from '@services/mine'
import { checkPhone, showToast } from '@utils/utils'
import './index.scss'
import { resolve } from 'path';

@connect
export default class ActivationPassword extends Taro.Component {

  constructor() {
    super()
    this.state = {
      value: '',
      user: {}
    }
  }

  config = {
    navigationBarTitleText: '使用激活码',
  }

  componentDidMount() {

  }

  handleSetPassword = e => {
    this.setState({value: e.detail.value})
  }


  handleSubmit = async () => {
    const { value } = this.state
    if(!value) {
      showToast('请输入8位数字的激活码')
      return
    }
    const response = await activateCard({
      cardPassword:value
    })
    if (response.data.returnCode === 0) {
    
      Taro.showToast({
        title: '激活成功',
        icon: 'success',
        duration: 3000
      }).then(res => Taro.navigateTo({
        url: `/pages/mine/index`
      }))
    }
  }
  
  render() {
    return (
      <View className='activation-password'>
        <View className='remind'>
          请输入8位数字的激活码
        </View>
        <View className='input'>
          <Input value={this.state.value} onInput={this.handleSetPassword} maxLength={8} type='number' />
          <GetPhoneBtn fullName='btn' title="立即激活" onBtn={this.handleSubmit.bind(this)}  />
        </View>
      </View>
    );
  }
}
