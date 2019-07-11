import Taro from '@tarojs/taro';
import { View, WebView} from '@tarojs/components';

export default class H5Static extends Taro.Component {

  constructor() {
    super()
    this.state = {
        title:this.$router.params.title||'识践串串',
        url:this.$router.params.url
    }
  }
  config = {
    navigationBarTitleText: this.state.title,
    comment: true
  }
  render() {
    



    return (<WebView src={this.state.url}/>)
  }
}