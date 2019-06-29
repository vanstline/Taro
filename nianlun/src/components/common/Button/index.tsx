import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import './index.scss';
export default class Button extends Taro.Component<any, any>{
  constructor(props) {
    super(props);

  }

  render() {
    const { style, onClick } = this.props;
    return <View className='container' style={style} onClick={onClick}>{this.props.children}</View>
  }
}