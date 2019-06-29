import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtActionSheet, AtActionSheetItem } from 'taro-ui'
import ToHtml from '../../components/WxParse'
import { bookManuscriptListPage } from '../../services/book'
import { showToast } from '@utils/utils'

import './index.scss'

@connect(({system}) => ({ system }))
export default class DraftList extends Component {

  state = {
    list: [],
    nowIndex: 0,
    isOpened: false
  }

  handleChangeOpened = () => {
    this.setState({ isOpened: true })
  }

  // 获取书籍列表
  async getbookList() {
    const { id } = this.$router.params
    let res = await bookManuscriptListPage({ pageSize: 20, bookId: id })
    this.setState({ list: res.data.data.list || [] })
  }
  componentDidMount() {
    const { title } = this.$router.params
    Taro.setNavigationBarTitle({ title })
    this.getbookList()
  }

  handleTrunPage = (e) => {
    let { list } = this.state
    if(e < 0) {
      showToast('已是第一章')
      return
    }
    if(e >= list.length) {
      showToast('已是最后一章')
      return
    }
    this.setState({ nowIndex: e, isOpened: false })
  }
  render() {
    const { title } = this.$router.params
    const { list, nowIndex, isOpened } = this.state
    return (
      <View className={`draft ${this.props.system.paddinBottom && 'paddingBottom'}`}>
        <View className='nowPage' >第{nowIndex+1}章</View>
        <View className='title'>{list[nowIndex].name}</View>
        <View className='content'>
          {
            list[nowIndex] && <ToHtml html={list[nowIndex].manuscriptContent} />
          }
        </View>
        <View className={`footer ${this.props.system.paddinBottom && 'paddingBottom'}`}>
          <View onClick={() => this.handleTrunPage(nowIndex-1)}>上一章</View>
          <View onClick={this.handleChangeOpened}>目录</View>
          <View onClick={() => this.handleTrunPage(nowIndex+1)}>下一章</View>
        </View>
        <AtActionSheet isOpened={isOpened} cancelText='取消' title={title}>
          {
            list.map( (item, i) => <AtActionSheetItem key={item.id} className='text-left' onClick={() => this.handleTrunPage(i)}>{item.name}</AtActionSheetItem> )
          }
        </AtActionSheet>
      </View>
    )
  }
}