import Taro from '@tarojs/taro';
import { View, WebView} from '@tarojs/components';

export default class AddWecaht extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      showupgrade:false,
    }
  }
  config = {
    navigationBarTitleText: '添加微信',
    comment: true
  } 
  render() {
    



    return (<WebView src={`${global.common.host}/h5_static/addWecaht.html`}/>)
  }
}