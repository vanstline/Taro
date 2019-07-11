import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import './index.scss'

@connect(({system}) => ({ system }))
export default class Footer extends Component {

  render() {

    // console.log(this.props, '----footer')
    return(
      <View className='my-footer' style={{ paddingBottom: this.props.system.paddinBottom }}>
        {this.props.children}
      </View>
    )
  }
}