import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { showToast } from '../../utils/utils'
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

    if(Taro.CourseVedioCtxPause || Taro.CourseAudioCtxPause) {
      // console.log(Taro.CourseVedioCtxPause, '---')
      showToast('当课程资源正在播放， 请先暂停播放后才能播放录音文件')
      return
    }

    if(Taro.GlobalRecordCtx) {
      _this.setState({ playStatus: false })
      Taro.GlobalRecordCtx.destroy()
    }
    
    let recordCtx = Taro.createInnerAudioContext()
    recordCtx.src = this.props.audioUrl
    Taro.GlobalRecordCtx = recordCtx
    setTimeout(()=> _this.setState({ playStatus: false }), timeLength * 1000)
    recordCtx.play()
    _this.setState({ playStatus: true })
    
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
