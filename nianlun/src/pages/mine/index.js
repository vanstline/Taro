import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import connect from '../../connect/user'
import { AtAvatar, AtButton, AtIcon, AtList, AtListItem, AtModal } from 'taro-ui'
import NavBar from '../../components/Navbar/index'
import WhiteSpace from '../../components/WhiteSpace'
import pageInit from '../pageInit'
import api from '../../services/api'
import { Host } from '../../services/config'


import './index.scss'
const avatar = `${Taro.IMG_URL}/avatar.png`
const share = `${Taro.IMG_URL}/share.png`
const invite = `${Taro.IMG_URL}/invite.png`

const gift = `${Taro.IMG_URL}/gift.png`
const helper = `${Taro.IMG_URL}/helper.png`
const impact = `${Taro.IMG_URL}/impact.png`
const issue = `${Taro.IMG_URL}/issue.png`
const myMsg = `${Taro.IMG_URL}/myMsg.png`
const service = `${Taro.IMG_URL}/service.png`
const activationCode = `${Taro.IMG_URL}/activationCode.png`
const myOrder = `${Taro.IMG_URL}/myOrder.png`


const { tabText } = global.common

const pagesArr = ['message', 'award', 'force', 'livehand']

@connect
@pageInit()
class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      isOpened: false,
      isInvited: false,
    }
  }

  config = {
    // navigationBarTitleText: tabText[2],
    navigationBarTitleText: '个人中心',
    comment: true
  }

  gitInfo = async () => {
    const response = await api.post(`${Host}/personalcenter/getPersonalCenterBaseInfo`)
    if (response.data.returnCode === 0) {
      // response.data.data.headImg ='https://test-nianlun-static.oss-cn-hangzhou.aliyuncs.com/avatar_default.jpg'
      
      let isInvited = response.header['x-app-ver-check'] === 'false' ? true : false
      this.setState({
        info: response.data.data,
        isInvited
      })
    }
  }

  handleButton = (e) => {
    let url = '/pages/test/index'
    Taro.navigateTo({
      url
    })
  }

  handleToPage = (page) => {
    // if(page === 'livehand'){
    //   Taro.navigateTo({
    //     url: `/pages/${page}/index?mobile=${this.state.info.mobile}&username=${this.state.info.username}`
    //   })
    // }else{
    
      if(page === 'vip' && this.props.system.IOS) {
        this.setState({ isOpened: true })
        return
      }
      
      Taro.navigateTo({
        url: `/pages/${page}/index`
      })
    // }
  }
  handleToActivation = (page) => {
    Taro.navigateTo({
      url: `/pages/activation/password`
    })
  }
  handleToUserinfo = (page) => {
    Taro.navigateTo({
      url: `/pages/userInfo/password`
    })
  }
  handleToQuestion = () => {
    Taro.navigateTo({
      url: `/pages/h5Static/question`
    })
  }
  

  shareToFriends = (share, days, name, headImg) => {
    
    Taro.navigateTo({
      url: `/pages/mine/share?type=${share}&days=${days}&name=${name}&headImg=${headImg}`
    })
  }
  componentDidShow() {
    this.gitInfo()
  }

  returnVip = (type) => {
    switch(Number(type)){ //"1、体验会员2、付费会员 3 注册会员",
      case 1: return '体验会员';
      case 2: return '付费会员';
      case 3: return '注册会员';
      default: return '';
    }
  }

  render() {
    const { info } = this.state;
    // Taro.get
    const unreadNum = (info.unreadNotificationNum ||0) + (info.unreadMessageNum||0);
    return (
      <View className='user'>
        {/* <NavBar isTab tabText={tabText[2]}/> */}
        <View className='user-bg' />
        <View className='header'>
          <View className='user-info'>
            <View onClick={this.handleToPage.bind(this, 'userInfo')}>
            <AtAvatar className='mine-avatar' circle size='large' image={info.headImg} />
            </View>
            
            <View className='info'>
              <View>
                <Text onClick={this.handleToPage.bind(this, 'userInfo')}>{info.nickname}</Text> <Text className='vip-type'>{this.returnVip(info.memberType)}</Text>
              </View>
              {info.cardEndDate ? <View className='expire'>{info.cardEndDate} 到期 </View> : ''}
            </View>
            {
              this.state.isInvited && (
                <View className='member-btn'>
                  <AtButton size='small' onClick={this.handleToPage.bind(this, 'vip')}>{info.memberType==3?'开通会员':'续费会员'}</AtButton>
                  <AtIcon value='chevron-right' color='#fff' />
                </View>
              )
            }
            
          </View>
          <View className='share-invite'>
            <View onClick={() => this.shareToFriends(1, 7, info.nickname, info.headImg)} className='share'>
              <View className='icon'><Image src={share} /></View>
              <View className='txt'>
                <View>分享给好友</View>
                <View className='dec'>立即得到<Text className='date'>{info.shareGetDays || 0}天</Text>会期</View>
              </View>
            </View>
            {/* <View className='cut'>分享</View> */}
            <View onClick={() => this.shareToFriends(2, info.inviteGetDays, info.nickname, info.headImg)} className='invite'>
              <View className='icon'><Image src={invite} /></View>
              <View className='txt'>
                <View>邀请好友</View>
                <View className='dec'>立即得到<Text className='date'>{info.inviteGetDays || 0}天</Text>会期</View>
              </View>
            </View>
          </View>
        </View>
        <View className='content'>
          <View className='info-list'>
            <AtList hasBorder={false}>
              <AtListItem className='message---' title='我的消息' thumb={myMsg} arrow='right' extraText={unreadNum ?`${unreadNum }条未读`:''} onClick={this.handleToPage.bind(this, pagesArr[0])} />
              <AtListItem title='奖励记录' thumb={gift} arrow='right' extraText={info.rewardNum ? `${info.rewardNum || 0}次奖励` : ''} onClick={this.handleToPage.bind(this, pagesArr[1])} />
              <AtListItem title='我的影响力' thumb={impact} arrow='right' extraText={info.friendsNum ? `${info.friendsNum || 0}个好友` : ''} onClick={this.handleToPage.bind(this, pagesArr[2])} />
              <AtListItem title='我的订单' thumb={myOrder} arrow='right'  onClick={this.handleToPage.bind(this, 'order')} />
            </AtList>
          </View>
          <WhiteSpace />
          <View className='info-list'>
            <AtList hasBorder={false}>
              <AtListItem title='我的书童' thumb={helper} arrow='right' onClick={this.handleToPage.bind(this, pagesArr[3])} />
              <AtListItem title='常见问题' thumb={issue} arrow='right' onClick={this.handleToQuestion} />
              <AtListItem onClick={() => {
                Taro.makePhoneCall({
                  phoneNumber: '400-888-2130',
                })
              }} className="info-service" title='客服电话 400-888-2130' thumb={service} />
            </AtList>
          </View>
          <WhiteSpace />
          <View className='info-list'>
            <AtList hasBorder={false}>
              <AtListItem title='使用激活码' thumb={activationCode} arrow='right' onClick={this.handleToActivation.bind(this, 'activationCode')} />
             
            </AtList>
          </View>
        </View>
        <AtModal
          isOpened={this.state.isOpened}
          title='提示'
          cancelText='联系书童'
          confirmText='确认'
          onClose={ () => this.setState({ isOpened: false }) }
          onCancel={ () => this.setState({ isOpened: false }, () => Taro.navigateTo({ url: '/pages/livehand/index' })) }
          onConfirm={ () => this.setState({ isOpened: false }) }
          content='由于相关规范，iOS功能暂不可用'
        />
      </View>
    )
  }
}
export default Mine;

{/* <AtButton onClick={this.handleButton}>我的</AtButton>
<AtButton onClick={this.handleButton}>我的</AtButton>
<AtButton onClick={this.handleButton}>我的</AtButton> */}