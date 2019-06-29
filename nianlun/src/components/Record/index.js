import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss'

export default class Test extends Taro.Component {

  state = {
    playStatus: false
  }

  // 播放
  handlePlay = () => {
    console.log(this.props.audioUrl)
    const { timeLength } = this.props
    let _this = this
    if(!timeLength) {
      return
    }
    if(Taro.GlobalRecordCtx) {
      _this.setState({ playStatus: false })
      Taro.GlobalRecordCtx.destroy()
    }
    
    let recordCtx = Taro.createInnerAudioContext()
    recordCtx.src = this.props.audioUrl
    // console.log(recordCtx, '-----recordCtx')
    _this.setState({ playStatus: true })
    recordCtx.play()
    recordCtx.offEnded(() => {
      _this.setState({ playStatus: false })
    }) 
    Taro.GlobalRecordCtx = recordCtx
  }

  render() {
    return (
      // <View>
        <View className='audio' onClick={ this.handlePlay }>
          {this.props.timeLength || 0 }''
          <Text className={ this.state.playStatus ? 'play' : 'pause' } />
        </View>
      // </View>
    );
  }
}
