import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

export default class ReceiveMember extends Taro.Component {

  componentDidMount() {
    Taro.redirectTo({ url: '/pages/sweep/index' })
  }
  render() {
    return <View />
  }
}
