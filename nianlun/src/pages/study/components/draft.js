import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import MyCard from '../../../components/MyCard'
import ToHtml from '../../../components/WxParse'
import '../index.scss'

export default class Draft extends Component {
  render() {
    const { draft } = this.props
    return (
      <View className='draft'>
        {/* <MyCard title={draft.name || ''}>
          <View className='draft-content'> */}
          <ToHtml html={draft.manuscriptContent || ''} />
          {/* </View>
        </MyCard> */}
      </View>
    )
  }
}