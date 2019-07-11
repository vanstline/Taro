import Taro from '@tarojs/taro';
import { View, WebView} from '@tarojs/components';

export default class Question extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      showupgrade:false,
    }
  }
  config = {
    navigationBarTitleText: '帮助中心',
    comment: true
  } 
  render() {
    



    return (<WebView src={`${global.common.host}/h5_static/question.html`}/>)
  }
}