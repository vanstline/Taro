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
  // vedioPlayTime = 0
  vedioCurrentTime = 0 
  t1 = parseInt(Date.now()/1000)
  t2 = 0

  componentDidMount() {
    let { vedioObj } = this.state
    Taro.getBackgroundAudioManager().pause()
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
    this.t2 = parseInt(Date.now()/1000) - this.t1 + this.t2
    this.t1 = 0
  }

  onPlay = () => {
    this.t1 = parseInt(Date.now()/1000)
  }

  componentWillUnmount() {

    let t2 = this.t1 ? parseInt(Date.now()/1000) - this.t1 + this.t2 : this.t2
   
    const { vedioObj, header } = this.state
    Taro.setStorageSync('VEDIODATA', {...vedioObj,
      type: 2,
      mediaId: vedioObj.id,
      title: header.title, 
      src: vedioObj.filePath,
      paused: vedioObj.paused,
      learnPointTime: this.vedioCurrentTime
    })
    addLearnLog({
      id: header.id,
      type: header.type,
      mediaId: vedioObj.id,
      learnDurationTime: t2,
      learnPointTime: this.vedioCurrentTime,
    })
  }

  render() {
    const { vedioObj }  = this.state
    return (
      <Video 
        src={vedioObj.filePath || ''} 
        initialTime={vedioObj.learnPointTime || 0}
        autoplay
        onPause={this.onPause}
        onPlay={this.onPlay}
        onTimeUpdate={this.handleTimeUpdate}
      ></Video>
    )
  }

}