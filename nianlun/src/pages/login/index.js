import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import auth from '../../utils/auth'
import { getUserInfo, updateUserInfo } from '../../services/user'
import { getAuditInfo } from '../../services/common'
import './index.scss'

// let isWapp = process.env.TARO_ENV;

// @pageInit()
class UserLogin extends Component {   

  constructor() {
    super()
    this.state = {
      user: {},
      isAudit: false
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
  
    if(!user.avatar || !user.nickname) {
      const { avatarUrl, nickName } = res.detail.userInfo
      let params = {
        avatarUrl: !user.avatar ? avatarUrl : '',
        nickname: !user.nickname ? nickName : ''
      }
      updateUserInfo(params)
    }
    // Taro.switchTab({ url: '/pages/school/index' })
    this.navToHome()
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
    // this.getAuditInfo()
    this.checkAuth()

    let userInfo = Taro.getStorageSync('userinfo')
    if(!!userInfo) {
      this.navToHome()
      // Taro.switchTab({ url: '/pages/school/index' })
    }
  }

  getAuditInfo = () => {
    getAuditInfo().then(({data}) => {
      if(data.returnCode === 0) {
        this.setState({ isAudit: data.data.auditFlag || false })
      }
    })
  }

  navToHome = () => {
    // const { isAudit } = this.state
    // if(!isAudit) {
    //   Taro.switchTab({ url: '/pages/index/index' })
    // } else {
      Taro.switchTab({ url: '/pages/school/index' })
    // }

  }

  render() {  
    const userInfo = Taro.getStorageSync('userinfo')
    return (      
      <View className='user-login' style={{ display: !userInfo && 'block' }}>   
        <View className='icon'/>
        <View className='text'>是否登录并继续使用该小程序</View>
        <AtButton openType='getUserInfo' onGetUserInfo={this.tobegin} >微信登陆</AtButton>
    </View>
    )  
  }
}
export default UserLogin;