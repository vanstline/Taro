import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import Empty from '../message/components/empty'
import api from '../../services/api'
import { Host } from '../../services/config'

import './index.scss'

const avatar = `${Taro.IMG_URL}/avatar.png`
export default class Force extends Component {

  constructor() {
    super()
    this.state = {
      noMore: false,
      list: [],
      pageIndex: 0,
      pageSize: 20,
    }
  }
  getList = async (pageIndex, pageSize) => {
    const response = await api.post(`${Host}/personalcenter/findMyFriends`, { pageIndex, pageSize })
    if (response.data.returnCode === 0) {
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
      title: '我的影响力'
    })
    this.getList(0, 999)
  }

  render() {

    const { list } = this.state
    return (
      <View className='force'>
        {
          list.length > 0 ? list.map(item => {
            return (
              <View key={item.id} className='force-items'>
                <View className='avatar'><Image src={item.headImg} /></View>
                <View className='infos'>
                  <View className='user'>{item.nickname}</View>
                  <View className='time'>注册时间： {item.registerTime}</View>
                </View>
              </View>
            )
          }) : <Empty title='影响力记录' />
        }
      </View>
    )
  }
}