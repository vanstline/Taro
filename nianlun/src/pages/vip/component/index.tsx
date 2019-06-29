import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'
interface TitleProps{
  icon: any;
  title: string;
  content: string;
}
export default class Title extends Component<TitleProps, any>{
  constructor(props) {
    super(props);
    
  }
  render(){
    const { icon, title, content } = this.props;
    return <View className='vip-title-container'>
      <View className='vip-title-container-icon'>
        <Image src={icon}/>
      </View>
      <View className='vip-title-container-content'>
        <View className='vip-title-container-content-title'>{title}</View>
        <View className='vip-title-container-content-body'>{content}</View>
      </View>
    </View>
  }
}