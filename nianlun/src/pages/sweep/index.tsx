import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtCurtain, AtButton } from 'taro-ui'
import pageInit from '../pageInit'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import { activateCard, findCardType, getUserInfo, bindMobile } from '../../services/mine'
import { showToast, add_date } from '../../utils/utils'
// import activation21 from '@images/activation-21.png'

import './index.scss'

const activation21 = `${Taro.IMG_URL}/sweepbg.png`
const successBg = `${Taro.IMG_URL}/action-success.png`


@pageInit()
export default class Sweep extends Taro.Component {

  constructor() {
    super()
    this.state = {
      activtionStatus: false,
      isOpened: true,
      cardData: {},
      user: {},
      activtionIsOpened: true
    }
  }

  // // // 授权
  // tobegin = (res) => {    
  //   const { errMsg, encryptedData, iv } = res.detail
  //   const _this = this
  //   if(errMsg === 'getPhoneNumber:ok') {
  //     let openId = Taro.getStorageSync('code2Session').openid
  //     let obj = { openId, encryptedData, iv, ifGive7Days: 1 }
  //     bindMobile(obj)
  //       .then( res => {
  //         if(res.data.returnCode === 0) {
  //           showToast('绑定成功， 正在激活中请稍后')
  //           this.handleSweep()
  //         }
  //       } )
  //   }
  // } 

  config = {
    navigationBarTitleText: '年轮学堂',
  }

  onClose = () => {
    Taro.switchTab({
      url: '/pages/school/index'
    })
  }

  componentDidMount() {

    getUserInfo()
      .then( res => {
        if(res.data.returnCode === 0) {
          console.log(res, '-----------res')
          this.setState({ user: res.data.data })
        }
      } )

    findCardType({cardPassword: 'A10686DB'})
      .then( res => {
        if(res.data.returnCode === 0) {
          console.log(res, '-----------res')
          this.setState({ cardData: res.data.data })
        }
      } )

      
  } 

  handleSweep = () => {
    // const { uid, did } = this.$router.params
    activateCard({
      shareUnionId: Taro.__nianlun_scene.uid || '',
      cardPassword: Taro.__nianlun_scene.cardPassword || '',
      distributorId: Taro.__nianlun_scene.did || ''
    }).then( res => {
      if(res.data.returnCode === 0) {
        this.setState({ activtionStatus: true })
      } else {
        showToast('激活失败, 请联系书童!')
        // this.setState({ activtionStatus: true })

        setTimeout(() => Taro.navigateTo({url: '/pages/livehand/index'}), 1000)
      }
    } )
  }

  render() {
    
    const { cardData, user, activtionStatus, isOpened, activtionIsOpened } = this.state
    return (
      <View className='wrap'>
        {
          !activtionStatus ? (
            <AtCurtain
              isOpened={isOpened}
              onClose={this.onClose.bind(this)}
            >
              <View className='sweep' style={{backgroundImage: `url(${activation21})`}}>
                <Image className='card-img' src={cardData.imgCover} />
                <View className='sweep-text'>
                  已成功领取该卡片，激活后可免费解 锁所有课程和书籍，是否立即激活？
                </View>
                <View className='btn'>
                  {/* {
                    user.mobile
                    ? <AtButton size='small' onClick={this.handleSweep} >立即激活</AtButton>
                    : <AtButton size='small' 
                        openType="getPhoneNumber" 
                        onGetPhoneNumber={this.tobegin}
                      >立即激活</AtButton>
                  } */}
                  <GetPhoneBtn size='small' onBtn={this.handleSweep.bind(this)} title='立即激活'/>
                </View>
              </View>
            </AtCurtain>
          ) : (
            <View>
              <AtCurtain
              isOpened={activtionIsOpened}
                onClose={this.onClose.bind(this)}
              >
                <View className='sweep-success' style={{backgroundImage: `url(${successBg})`}}>
                  <View>恭喜你</View>
                  <View>成功激活{cardData.typeName}</View>
                  <View className='expiry'>有效期至{add_date(cardData.validValue || 0, '.')}</View>
                  <AtButton onClick={() => Taro.switchTab({url: '/pages/mine/index'})}>立即学习</AtButton>
                </View>
              </AtCurtain>
            </View>
          )
        }
      </View>
    );
  }
}
