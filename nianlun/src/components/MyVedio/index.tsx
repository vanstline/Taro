import Taro, { Component } from '@tarojs/taro'
import { Video } from '@tarojs/components'
import { addLearnLog } from '../../services/school'
import './index.scss'

let timer = null

interface Props  {
  vedioObj: Object
}

export default class MyAudio extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = { 
      vedioObj: props.vedioObj,
      header: props.header
    }
  }
  vedioCurrentTime = 0 
  t1 = parseInt(Date.now()/1000)
  t2 = 0

  componentWillReceiveProps(nextProps) {
    if(nextProps.vedioObj.id !== this.state.vedioObj.id) {
      this.sendLog()
      this.setState({ vedioObj: nextProps.vedioObj })
    }
  }

  componentDidMount() {
    let { vedioObj } = this.state
    Taro.getBackgroundAudioManager().pause()
    this.setGlobalLog(false)
    const vedioData = Taro.getStorageSync('VEDIODATA')
    if(vedioData.mediaId === vedioObj.id) {
      vedioObj.learnPointTime = vedioData.learnPointTime || 0
    }
    this.setState({ vedioObj })
  }

  // 视频进度发生变化
  handleTimeUpdate = (e) => {
    this.vedioCurrentTime = Math.floor(e.target.currentTime)
  }

  onPause = () => {
    this.setGlobalLog(false)
    this.t2 = parseInt(Date.now()/1000) - this.t1 + this.t2
    this.t1 = 0
  }

  onPlay = () => {
    this.setGlobalLog(true)
    this.t1 = parseInt(Date.now()/1000)
  }

  // 设置全局播放记录
  setGlobalLog(bool = false) {
    Taro.CourseVedioCtxPause = bool
  }
  componentWillUnmount() {
    this.setGlobalLog(false)
    this.sendLog()
  }

  sendLog() {
    let t2 = this.t1 ? parseInt(Date.now()/1000) - this.t1 + this.t2 : this.t2
    const { vedioObj, header } = this.state
    Taro.setStorageSync('VEDIODATA', {...vedioObj,
      type: 2,
      mediaId: vedioObj.id,
      title: header.title, 
      src: vedioObj.filePath,
      paused: vedioObj.paused,
      learnPointTime: this.vedioCurrentTime,
      chapterId: vedioObj.chapterId || '' ,
    })
    if(t2 >= 3600 * 4) return
    if(header.id){
      addLearnLog({
        id: header.id,
        type: header.type,
        chapterId: vedioObj.chapterId || '' ,
        mediaId: vedioObj.id,
        learnDurationTime: t2,
        learnPointTime: this.vedioCurrentTime,
      })
    }
    
  }

  handlePlayEnd = () => {
    this.setGlobalLog(false)
    if(this.props.callback && typeof this.props.callback === 'function') {
      this.props.callback()
    }
  }

  render() {
    const { vedioObj }  = this.state
    console.log(Taro.CourseVedioCtxPause)
    return (
      <Video 
        src={vedioObj.filePath || ''} 
        initialTime={vedioObj.learnPointTime || 0}
        autoplay
        onPause={this.onPause}
        onPlay={this.onPlay}
        onEnded={this.handlePlayEnd}
        onTimeUpdate={this.handleTimeUpdate}
      ></Video>
    )
  }

}