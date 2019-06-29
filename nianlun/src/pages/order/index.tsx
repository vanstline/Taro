import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Numeral from 'numeral'
import Empty from '../message/components/empty'
import { queryOrderBookAndCoursePage } from '../../services/mine'
import connect from '../../connect/course'
import { WhiteSpace } from '@app'
import './index.scss'

@connect
export default class Order extends Component<any, any> {


  constructor() {
    super()
    this.state = {
      list: []
    }
  }

  config = {
    navigationBarTitleText: '我的订单'  
  }  

  componentDidMount() {

    // let list = [{
    //   "orderId": 136,
    //   "orderNo": "2019061916405475018904",
    //   "type": 2,
    //   "receivableAmount": 1,
    //   "orderTime": "2019-06-19 16:40:54",
    //   "orderAmount": 1,
    //   "dtlList": [
    //     {
    //       "imgMain": "http://xinxuan-test.oss-cn-hangzhou.aliyuncs.com/public/pic/69b8aa37a5a84bdbb3ad2f8fcbf099d7.jpeg",
    //       "title": "修真聊天群 ",
    //       "amount": 1
    //     }
    //   ]
    // }]
    // this.setState({ list })
    this.getList()
  }

  // 获取订单list
  getList() {
    queryOrderBookAndCoursePage().then( res => {
      if(res.data.returnCode === 0) {
        this.setState({ list: res.data.data.list || [] })
      }
    } )
  }

  render() {
    const { list = [] } = this.state
    return (
      <View className='order'>
        {
          list && list.map( item => {
            const pirce = Numeral(item.dtlList[0].amount/100).format('0, 0.00')
            return (
              <View>
                <WhiteSpace />
                <View key={item.orderId} className='order-items'>
                  <View className='goods-title'>订单编号：{item.orderNo}</View>
                  <View className='goods-main'>
                    <View className='goods-img'><Image src={item.dtlList[0].imgMain} /></View>
                    <View className='goods-info'>
                      <View className='goods-name'>《{item.dtlList[0].title}》</View>
                      <View className='goods-unit'>￥{pirce}</View>
                    </View>
                  </View>
                  <View className='order-footer'>
                    <View className='out-of-pocket'>实付款：<Text>￥{pirce}</Text></View>
                    <View className='to-study'>去学习</View>
                  </View>
                </View>
              </View>
            )
          } )
        }
        {
          list.length==0&&<Empty title='订单' />
        }
      </View>
    )
  }
}