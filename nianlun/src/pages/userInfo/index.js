import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtAvatar, AtButton, AtIcon, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux';
import pageInit from '../pageInit'
import WhiteSpace from '../../components/WhiteSpace'
import { FetchGetUserInfo, SetUserMobile } from '../../store/actions/user'
import { updateUserInfo } from '../../services/user'
import { sign } from '../../utils/utils'
import { Host } from '../../services/config'
import api from '../../services/api'
import './index.scss'
let mapState = ({user}) => ({
  mobile: user.mobile ? true : false,
  // userInfo:user
})
let mapActions = (dispatch) => ({
  fetchGetUserInfo(data) { dispatch(FetchGetUserInfo(data)) },
})
@connect(mapState, mapActions)

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    }
  }
  config = {
    navigationBarTitleText: '个人信息',
    comment: true
  }
  componentDidMount() {
    this.gitInfo()

  }
  gitInfo = async () => {
    const response = await api.post(`${Host}/personalcenter/getPersonalCenterBaseInfo`)
    if (response.data.returnCode === 0) {
      // response.data.data.headImg ='https://test-nianlun-static.oss-cn-hangzhou.aliyuncs.com/avatar_default.jpg'
      this.setState({
        userInfo: response.data.data,
      })
    }
  }
  handleChangeAvatar=()=>{
    const that = this;
    Taro.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths // tempFilePaths 的每一项是一个本地临时文件路径
        //这里是上传操作
        
        const token = Taro.getStorageSync('token_type') + ' ' + Taro.getStorageSync('authorize').token
        wx.uploadFile({
          url: `${Host}/common/uploadByStream?${sign({fileCode:'head'})}`, //里面填写你的上传图片服务器API接口的路径 
          filePath: tempFilePaths[0],//要上传文件资源的路径 String类型 
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",//记得设置
            "Authorization": token,
          },
          // formData: {
          //   fileCode:'head'
          // },
          success: function(res) {
            if (res.statusCode = 200) {
              const data = JSON.parse(res.data||'{}').data
              if(data){
                that.handleSubmit(data)
              }
             
            }
          }
        })
      }
    })
  }
  handleToUpdate =(title,value)=>{
    
    Taro.navigateTo({
      url: `/pages/userInfo/update?title=${title}&value=${value}`
    })
  }
  handleToUpdateGender =(value)=>{
    
    Taro.navigateTo({
      url: `/pages/userInfo/updateGender?value=${value}`
    })
  }
  handleToBindPhone =()=>{
    const { path } = this.$router
    Taro.navigateTo({
      url: `/pages/bindPhone/index?path=${path}`
    })
   
  }
  handleSubmit = async (url) => {
    const response = await updateUserInfo({
      avatarUrl:url
    })
    if (response.data.returnCode === 0) {
    
      Taro.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 3000
      }).then(res => this.gitInfo())
    }
  }
  onDateChange = async(e) => {
    const value = e.detail.value
    const response = await updateUserInfo({
      birthday:value
    })
    if (response.data.returnCode === 0) {
    
      Taro.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 3000
      }).then(res => this.setState({
        birthday: value
      }))
    }
    
  }
  render() {
    const { userInfo={} } = this.state;
    return <View className='info-list'>
      <WhiteSpace />
    <AtList hasBorder={false} >
      <AtListItem onClick={this.handleChangeAvatar.bind(this)} title='头像' extraThumb={userInfo.headImg}  arrow='right'/>
    </AtList>
    <WhiteSpace />
    <AtList hasBorder={false}>
      <AtListItem title='昵称' onClick={this.handleToUpdate.bind(this,'昵称',userInfo.nickname)} extraText={userInfo.nickname} arrow='right'/>
      {/* <AtListItem title='简介' extraText={'暂无'} arrow='right'/> */}
      
      <View>
              <Picker mode='date' onChange={this.onDateChange}>
                <View className='picker'>
                 
                  <AtListItem title='生日' extraText={userInfo.birthday ||this.state.birthday||'暂未设置'} arrow='right'/>
                </View>
              </Picker>
            </View>
      {/* <AtListItem title='生日' onClick={this.handleToUpdate.bind(this,'生日',userInfo.xx)} extraText={userInfo.xxx ||'暂未设置'} arrow='right'/> */}
    </AtList>
    <WhiteSpace />
    <AtList hasBorder={false}>
      <AtListItem title='绑定手机号' onClick={this.handleToBindPhone.bind(this)} extraText={userInfo.mobile || '暂未设置'} arrow='right'/>
     
    </AtList>
  </View>
  }

}
export default UserInfo