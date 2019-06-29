import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import auth from '../../utils/auth'
import { getUserInfo, updateUserInfo } from '../../services/user'
import './index.scss'

// let isWapp = process.env.TARO_ENV;

// @pageInit()
class UserLogin extends Component {   

  constructor() {
    super()
    this.state = {
      user: {}
    }
  }
  
  config = {
    navigationBarTitleText: '授权登录'  
  }  

  tobegin = (res) => {   
    const { user } = this.state
    // 保存用户信息微信登录    
    Taro.setStorage({      
      key: "userinfo",      
      data: res.detail.userInfo    
    });
    
    if(!user.avatar) {
      updateUserInfo({avatarUrl:res.detail.userInfo.avatarUrl})
    }
    Taro.switchTab({ url: '/pages/school/index' })
  }  

  async getUser() {
    let res = await getUserInfo()
    try {
      if(res.data.returnCode === 0) {
        this.setState({ user: res.data.data }) 
      }
    } catch (error) {}
  }

  async checkAuth() {
    let res = await auth.appCheckAuth()
    res && this.getUser()
  }
  componentWillMount() {
    
    this.checkAuth()
    let userInfo = Taro.getStorageSync('userinfo')
    if(!!userInfo) {
      Taro.switchTab({ url: '/pages/school/index' })
    }
  }

  render() {    
    return (      
      <View className='user-login'>   
        <View className='icon'/>
        <View className='text'>是否登录并继续使用该小程序</View>
        <AtButton openType='getUserInfo' onGetUserInfo={this.tobegin} >微信登陆</AtButton>
    </View>
    )  
  }
}
export default UserLogin;