import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import WhiteSpace from '../../components/WhiteSpace'
import MyCard from '../../components/MyCard'
import Empty from '../message/components/empty'
import api from '../../services/api'
import { Host } from '../../services/config'

import './index.scss'

const rulePng = `${Taro.IMG_URL}/award-ruler.png`
export default class Award extends Component {

  constructor() {
    super()
    this.state = {
      noMore: false,
      list: [],
      pageIndex: 0,
      pageSize: 20,
      isLastPage: false,
      isOpened: false,
    }
  }
  gitInfo = async () => {
    const response = await api.post(`${Host}/personalcenter/getPersonalCenterBaseInfo`)
    if (response.data.returnCode === 0) {
      this.setState({
        info: response.data.data,
      })
    }
  }
  getList = async(pageIndex, pageSize) => {
    const response = await api.post(`${Host}/personalcenter/findMyAwardList`, {pageIndex, pageSize})
    if(response.data.returnCode === 0){
      const { list } = this.state;
      this.setState({
        list: [...list, ...response.data.data.list],
        isLastPage: response.data.data.isLastPage,
        pageIndex,
      })
    }
  }
  componentDidMount() { 
    Taro.setNavigationBarTitle({
      title: '奖励记录'
    })
    this.getList(0, 20)
    this.gitInfo()
  }

  // calcCount = (list) => {
  //   if(list.length === 0){
  //     return 0;
  //   }else if(list.length === 1){
  //     return list[0].awardDays
  //   }else{
  //     return list.reduce(a,b => Number(a) + Number(b))
  //   }

  // }

  onScroll = () => {
    const {pageIndex, pageSize, isLastPage} = this.state;
    if(isLastPage){
      this.setState({
        noMore: true,
      })
      return ;
    }
    this.getList(pageIndex + 1, pageSize)
  }

  render() {
    const { noMore, list, isOpened,info } = this.state
    return(
      <View className='award'>
        <View className='header'>
          <View className='title'>累计奖励</View>
          <View className='days'><Text>{info.rewardDays}</Text>天</View>
          <View onClick={() => this.setState({isOpened: true})} className='rule' ><Image src={rulePng} /></View>
        </View>
        <WhiteSpace />
        <MyCard title='奖励列表'>
          <ScrollView 
            className='award-list'
            scrollY
            enableBackToTop
            lowerThreshold={50}
            onScrollToLower={this.onScroll}
          >
            {
              list.length > 0 ? list.map( item => {
                return (
                  <View key={item.id} className='award-items'>
                    <View className='title'>
                      <View className='info'><Text>{item.awardDetails}</Text></View>
                      <View className='incentive'>+{item.awardDays }天</View>
                    </View>
                    <View className='time'>{item.gmtCreate}</View>
                  </View>
                )
              } ) : <Empty title='奖励记录' />
            }
          </ScrollView>
          {
            noMore && <View className='no-more-message'>无更多数据</View>
          }
        </MyCard>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>奖励细则</AtModalHeader>
          <AtModalContent>
            <View className='force-list-item'>1. 每天首次分享海报或链接，即可获得1天奖励会期</View>
            <View className='force-list-item'>2. 好友通过您的分享的海报或链接，进入程序，并完成手机验证，您可获得7天奖励会期</View>
            <View className='force-list-item'>3. 好友通过您的分享的海报或链接，进入小程序，完成手机验证，并付费成为会员，您可获得30天奖励会期</View>
          </AtModalContent>
          <AtModalAction> <Button onClick={() => this.setState({isOpened: false})}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}