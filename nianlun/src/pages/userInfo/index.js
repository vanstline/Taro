import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtCurtain, AtButton, AtIcon, AtList, AtListItem,AtAvatar } from 'taro-ui'
import { connect } from '@tarojs/redux';
import pageInit from '../pageInit'
import WhiteSpace from '../../components/WhiteSpace'
import connectUesr from '../../connect/user'
import { FetchGetUserInfo, SetUserMobile } from '../../store/actions/user'
import { updateUserInfo } from '../../services/user'
import { sign,showToast } from '../../utils/utils'
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
@connectUesr
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
  handleGetCode = async()=>{
    const { user: { distributorId, userId } } = this.props
    const res = await api.post(`${Host}/wechat/getWxacodeUnlimit`, { 
      scene: `uid=${userId}&did=${distributorId}`, 
      appId: global.common.appid,
      width:160 },true)
    if(res.data.returnCode===0){
      this.setState({weappCode:res.data.data},()=>this.setState({isOpened:true}))
    }
    
  }
  onCloseModal = () => {
    this.setState({isOpened:false})
  }
  handleSavePhoto = async()=>{
    let self = this;
    let codeUrl= await Taro.downloadFile({url: this.state.weappCode});
    codeUrl = codeUrl.tempFilePath;
    Taro.saveImageToPhotosAlbum({
      filePath: codeUrl,
      success: function (data) {
        Taro.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        })
        // setTimeout(() => {
        //   self.setData({show: false})
        // }, 6000);
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("当初用户拒绝，再次发起授权")
          self.secondGetPhoteAuthor();
        } else {
          showToast("请截屏保存分享");
        }
      },
      complete(res) {
        wx.hideLoading();
        console.log(res);
      }
    })
  }
  /**
     * 二次弹窗获取 相册权限
     */
    secondGetPhoteAuthor() {
      let self = this;
      wx.showModal({
        title: '保存二维码',
        content: '需要你提供保存相册权限',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取 相册 权限成功，给出再次点击图片保存到相册的提示。');
                  self.saveImg()
                } else {
                  wx.hideLoading();
                  util.showToast("保存失败");
                  console.log('获取 相册 权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            })
          } else {
            wx.hideLoading();
            util.showToast("保存失败");
          }
        }
      });
  }
  render() {
    const { userInfo={},isOpened=false,weappCode } = this.state;
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
            <AtListItem title='性别' onClick={this.handleToUpdateGender.bind(this,userInfo.gender)} extraText={userInfo.gender?(userInfo.gender===1?'男':'女'):'暂未设置'} arrow='right'/>
            <AtListItem title='绑定手机号' onClick={this.handleToBindPhone.bind(this)} extraText={userInfo.mobile || '暂未设置'} arrow='right'/>
    </AtList>
    <WhiteSpace />
    <AtList hasBorder={false}>
    <AtListItem title='我的专属二维码' onClick={this.handleGetCode.bind(this)}  arrow='right'/>
     
    </AtList>
    <AtCurtain 
          isOpened={isOpened}
          onClose={this.onCloseModal.bind(this, true) }
        >
          <View className='exclusive-code'>
              <View className='title'>{userInfo.distributorName}</View>
              <View className='userinfo'>
                <AtAvatar className='avatar' circle size='large' image={userInfo.headImg} />
                <View className="nickname">{userInfo.nickname}</View>
              </View>
              <View className="code">
                {weappCode&&<Image  src={weappCode}/>}
              </View>
              <View className="footer">
              <AtButton className="button" onClick={this.handleSavePhoto.bind(this)}>保存到我的相册</AtButton>
              <Text className="tip">保存后可在的手机相册中查看</Text>
              </View>
              
          </View>
        </AtCurtain>
  </View>
  }

}
export default UserInfo