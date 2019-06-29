import Taro, { Component } from '@tarojs/taro'
// import { connect } from '@tarojs/redux'
import { View, Image } from '@tarojs/components'
import Numeral from 'numeral';
import connect from '../../connect/user'
import { AtModal, AtButton } from 'taro-ui'
import { blackCardOrder } from '../../services/order'
import MySwiper from '../../components/MySwiper'
import { findCardTypeDetailList, bindMobile } from '../../services/mine'
import { WhiteSpace } from '@app';
import Title from './component'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import { showToast } from '../../utils/utils'
import './index.scss'

const bgImg = `${Taro.IMG_URL}/tyx.png`
const vipImg = `${Taro.IMG_URL}/vip.png`
const vipTitle1 = `${Taro.IMG_URL}/vip-title1.png`
const vipTitle2 = `${Taro.IMG_URL}/vip-title2.png`
const icon1 = `${Taro.IMG_URL}/vip-icon-1.png`
const icon2 = `${Taro.IMG_URL}/vip-icon-2.png`
const icon3 = `${Taro.IMG_URL}/vip-icon-3.png`
const icon4 = `${Taro.IMG_URL}/vip-icon-4.png`
const icon5 = `${Taro.IMG_URL}/vip-icon-5.png`
// @connect(({}) =>({}))
@connect
export default class Vip extends Component <any, any>{

  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      cardList: [],
      isOpened: false
    }
  }

  handleClick (value) {
    this.setState({
      current: value,
    })
  }

  // 查询卡列表
  fetchCardList () {
    findCardTypeDetailList().then( res => {
      if(res.data.returnCode === 0) {
        this.setState({
          cardList: res.data.data || []
        })
      }
    } )
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '年轮学堂会员卡'
    })
    console.log(2131)
    // this.props.dispatch(getMessageListAsync({}))
    this.fetchCardList()
  }

  // 微信支付
  async wechatPay(pay) {
    console.log(pay, '-----pay')
    const { timeStamp, nonceStr, sign, signType } = pay
    Taro.requestPayment({
      timeStamp,
      nonceStr,
      signType,
      paySign: sign,
      package: pay.package,
      success(res) {
        Taro.switchTab({ url: '/pages/mine/index' })
      },
      fail(res) {
        console.log(res, '----支付 fail')
      }
    })
  }

  // // 授权
  // tobegin = (res) => {    
  //   const { errMsg, encryptedData, iv } = res.detail
  //   const _this = this
  //   if(errMsg === 'getPhoneNumber:ok') {
  //     let openId = Taro.getStorageSync('code2Session').openid
  //     let obj = { openId, encryptedData, iv, ifGive7Days: 1 }
  //     bindMobile(obj)
  //       .then( res => {
  //         if(res.data.returnCode === 0) {
  //           // showToast('绑定成功， 正在激活中请稍后')
  //           this.handleToBindPhone()
  //         }
  //       } )
  //   }
  // }

  // 支付
  async fetchBookCourseOrder () {
    
    const { cardList } = this.state
    const user = this.props.user
    
    const { userId, distributorId } = user
    let cardTypeId
    cardList.forEach( item => {
      if(item.validValue === 365) {
        cardTypeId = item.cardTypeId
      }
    } )
    let data = {
      payType: 2,
      cardTypeId,
      shareUserId: userId,
      distributorId
    }
    let res = await blackCardOrder(data)
    try {
      console.log(res, '------购买课程')
      if(res.data.returnCode === 0) {
        let { data: { pb } } = res.data
        pb = JSON.parse(pb)
        this.wechatPay(pb)
      }
    } catch (error) {}
  }

  handleToBindPhone = () => {
    if(this.props.system.IOS) {
      this.setState({ isOpened: true })
      return
    } 
    this.fetchBookCourseOrder()
  }


  handleConfirm = () => {
    this.setState({ isOpened: false })
  }

  handleCancel = () => {
    this.setState({ isOpened: false })
    Taro.navigateTo({ url: '/pages/livehand/index' })
  }

  handleCheckCard = (i) => {
    this.setState({current: i})
  }

  render() {
    const { cardList, current } = this.state
    const { user:  { mobile } } = this.props
    const { system } = this.props
    let bannerList = cardList.map( item => ({id: item.cardTypeId ,mediaPath: item.imgCover}) )
    let price = system.IOS ? cardList[current].iosPrice : cardList[current].price
    return(
      <View className='vip'>
        <View className='header'>
          <Image className='bg-img' src={bgImg}/>
          {/* <Image  src={vipImg}/> */}
          <View className='img-banner'>
            <MySwiper 
              bannerList={bannerList} 
              onCallback={this.handleCheckCard.bind(this)}
            />
          </View>
          
        </View>
        <View className="content">
          <View className='title-img'>
            <Image src={vipTitle1}/>
          </View>
          <WhiteSpace size='xs'/>
          <Title 
            icon={icon1}
            title='健康栏目'
            content='由知名医学专家倾情打造，每周5期音频畅听'
          />
          <WhiteSpace size='sm'/>
          <Title 
            icon={icon2}
            title='书籍解读'
            content='经典书籍图文、音频、视频解读（非电子版原著）'
          />
          <WhiteSpace size='sm'/>
          <Title 
            icon={icon3}
            title='兴趣课程'
            content='英语、法律、朗诵、书法……各类精品课程免费畅学'
          />
          <WhiteSpace size='sm'/>
          <Title 
            icon={icon4}
            title='线上社群'
            content='基于兴趣课的专属社群，交流互动更方便'
          />
          <WhiteSpace size='sm'/>
          <Title 
            icon={icon5}
            title='线下活动'
            content='优享授权点组织的丰富多彩的线下活动'
          />
          <WhiteSpace/>
          <View className='title-img'>
            <Image src={vipTitle2}/>
          </View>
          <WhiteSpace size='xs'/>
          <View className='buy-have-know'>
            <View>1. 本产品为年付费制，购买成功后可在 一年内免费畅学樊登年轮学堂内所有优 质内容</View>
            <View>2. 欲咨询详情，欢迎拨打樊登年轮学堂客服热线 410-888-2130</View>
          </View>
          {/* {
            mobile ? (
              <AtButton 
                className='to-do-buy'
                onClick={this.handleToBindPhone}
              >
                  ￥{Numeral(price/100).format('0, 0.00')} 立即开通
              </AtButton>
            ) : (
              <AtButton 
                className='to-do-buy'
                openType='getPhoneNumber'
                onGetPhoneNumber={this.tobegin}
              >
                  ￥{Numeral(price/100).format('0, 0.00')} 立即开通
              </AtButton>
            )
          } */}
          <GetPhoneBtn fullName='to-do-buy' onBtn={this.handleToBindPhone.bind(this)} title={`￥${Numeral(price/100).format('0, 0.00')} 立即开通`} />
        </View>
        <AtModal
          isOpened={this.state.isOpened}
          title='提示'
          cancelText='联系书童'
          confirmText='确认'
          onClose={ this.handleClose }
          onCancel={ this.handleCancel }
          onConfirm={ this.handleConfirm }
          content='由于相关规范，iOS功能暂不可用'
        />
      </View>    
    )
  }
}