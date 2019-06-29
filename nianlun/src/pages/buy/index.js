import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtModal } from 'taro-ui'
import Numeral from 'numeral';
import connect from '../../connect/course'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import { bookCourseDetail } from '../../services/book'
import { bookCourseOrder, blackCardOrder } from '../../services/order'
import './index.scss'

const livehandBg = `${Taro.IMG_URL}/livehand-bg.png`
const shutu = 'http://img1.imgtn.bdimg.com/it/u=1878401278,1610402481&fm=26&gp=0.jpg'

@connect
export default class Buy extends Taro.Component {

  state = {
    isOpened: false,
    course: {}
  }

  config = {
   navigationBarTitleText: '购买页'
  };

  // 微信支付
  async wechatPay(pay) {
    console.log(pay, '-----pay')
    const { timeStamp, appId, nonceStr, sign, signType } = pay
    Taro.requestPayment({
      timeStamp,
      nonceStr,
      signType,
      paySign: sign,
      package: pay.package,
      success(res) {
        Taro.navigateTo({ url: '/pages/order/index' })
      },
      fail(res) {
        console.log(res, '----支付 fail')
      }
    })
  }

  async fetchBook(bookCourseId) {
    let res = await bookCourseDetail({bookCourseId})
    try {
      if(res.data.returnCode === 0) {
        this.setState({ course: res.data.data })
      }
    } catch (error) {}
  }

  componentDidMount() {
    console.log(this.$router, '----------this.$router')
    this.fetchBook(this.$router.params.id)
  }

  async fetchBookCourseOrder (i) {
    const { id, type } = this.$router.params
    if(i === 1) {
      Taro.navigateTo({ url: '/pages/vip/index' })
      return
    }
    if(this.props.system.IOS) {
      this.setState({ isOpened: true })
      return
    } 
    const payList = [
      bookCourseOrder,
      blackCardOrder
    ]
    let data = {
      payType: 2,
      contentId: id,
      contentType: type
    }
    let res = await payList[i](data)
    try {
      // console.log(res, '------购买课程')
      if(res.data.returnCode === 0) {
        let { data: { pb } } = res.data
        pb = JSON.parse(pb)
        this.wechatPay(pb)
      }
    } catch (error) {}
  }

  handleBuy = (i) => {
    // Taro.get
    this.fetchBookCourseOrder(i)
  }

  handleConfirm = () => {
    this.setState({ isOpened: false })
  }

  handleCancel = () => {
    this.setState({ isOpened: false })
    Taro.navigateTo({ url: '/pages/livehand/index' })
  }

  render() {

    // console.log(this.$router, '------this.$route')
    // console.log(this.props, '------this.props')
    // const { course } = this.props
    const { isOpened, course } = this.state
    return (
      <View className='buy-wrap'>
        <View className='goods'>
          <View className='images'>
            <Image src={course.imgMain} />
          </View>
          <View className='content'>
            <View className='title'>{course.title}</View>
            <View className='desc'>{course.commendDesc}</View>
          </View>
        </View>
        <View className='goods-details-ul'>
          <View className='goods-details-li'>
            <Text className='name'>课程章节数</Text>
            <Text className='cont chapter'>共{course.updatedChapters}期</Text>
          </View>
          <View className='goods-details-li'>
            <Text className='name'>价格</Text>
            <Text className='cont price'>{`￥${Numeral(course.unitPrice/100).format('0, 0.00')}`}</Text>
          </View>
          <View className='goods-details-li'>
            <Text className='name'>会员价</Text>
            <Text className='cont price'>{`￥${Numeral(0/100).format('0, 0.00')}`}</Text>
          </View>
        </View>
        <View className='btn-wrap'>
          {/* <Button className='buy-lesson' onClick={() => this.handleBuy(0)}>购买课程</Button>
          <Button className='buy-member' onClick={() => this.handleBuy(1)}>开通会员</Button> */}
          <GetPhoneBtn fullName='buy-lesson' title="购买课程" onBtn={() => this.handleBuy(0)}  />
          <GetPhoneBtn fullName='buy-member' title="购买课程" onBtn={() => this.handleBuy(1)}  />
          <View className='buy-info'>开通会员后可免费观看所有课程</View>
        </View>
        <AtModal
          isOpened={isOpened}
          title='提示'
          cancelText='联系书童'
          confirmText='确认'
          onClose={ this.handleClose }
          onCancel={ this.handleCancel }
          onConfirm={ this.handleConfirm }
          content='由于相关规范，iOS功能暂不可用'
        />
      </View>
    );
  }
}
