import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Empty from './components/empty'
import api from '../../services/api'
import { Host } from '../../services/config'
import './index.scss'

export default class Message extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      pageIndex: 0,
      lastPage: 1,
      pageSize: 20,
      list: [],
      noMore: false,
    }
  }

  handleClick(value) {
    this.setState({
      current: value,
    })
  }

  getList = async (pageIndex, pageSize) => {
    const response = await api.post(`${Host}/personalcenter/queryUserNotificationListPage`, { pageIndex, pageSize })
    if (response.data.returnCode === 0) {
      const { list } = this.state;
      this.setState({
        list: [...list, ...response.data.data.list],
        pageIndex,
        lastPage: response.data.data.lastPage,
      })
    }
  }
  onScroll = () => {
    const {pageIndex, pageSize, lastPage} = this.state;
    if(pageIndex === lastPage){
      this.setState({
        noMore: true,
      })
      return ;
    }
    this.getList(pageIndex + 1, pageSize)
  }
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '我的消息'
    })
    this.getList(0, 20)
  }

  onClick = async (item) => {
    const response = await api.post(`${Host}/personalcenter/changeUserNotificationStatus`, { id: item.id });
    if (response.data.returnCode === 0) {
      if (item.linkUrl) {
        Taro.navigateTo({
          url:item.linkUrl
        })
      }
    }
  }

  render() {

    const { list, noMore } = this.state

    return (
      <View className='message-wrap'>

        {
          list.length === 0 ? <View className='message'>
            <Empty title='消息' />
          </View> : <ScrollView
            className='scroll-view'
            scrollY
            enableBackToTop
            lowerThreshold={50}
            onScrollToLower={this.onScroll}
          >
            {
              list.map(item => <View className={`message-item ${item.status===1?'has-read':''}`} onClick={() => {
                this.onClick(item);
              }} key={item.id}>
                <View className='message-title'>
                  <Text>{item.title}</Text>
                  <Text className='message-time'>{item.gmtModified}</Text>
                </View>
                <View className='message-content'>
                  <Text className='message-notifyBody'>{item.notifyBody}</Text>
                  {item.linkUrl&&<Text className='message-link'>点击查看</Text>}
                </View>
              </View>)
            }
          </ScrollView>
        }
        {
          noMore && <View className='no-more-message'>无更多数据</View>
        }
      </View>
    )
  }
}