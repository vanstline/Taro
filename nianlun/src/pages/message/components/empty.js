import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

const nullIcon = `${Taro.IMG_URL}/null.png`
export default class Empty extends Component {

  render() {
    const {title} = this.props;
    return (
      <View className='empty'>
        <Image src={nullIcon} />
        <View className='dec'>没有任何{title}~</View>
      </View>
    )
  }
}