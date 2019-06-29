import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Rate from '../Progress'
import { addLearnLog } from '../../services/school'
import { getTime } from '../../utils/utils'
import './index.scss'

const startIcon = `${Taro.IMG_URL}/player.png`
const pauseIcon = `${Taro.IMG_URL}/pause.png`
const radioIcon = `${Taro.IMG_URL}/radio.png`
let timer = null

interface Props  {
  audioObj: Object
}

export default class MyAudio extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = { 
      audioObj: props.audioObj,
      header: props.header
    }
  }
  initDate = 0

  // 转换音视频
  transMedia(media) {
    const cacheAudio = Taro.getStorageSync('AUDIODATA')
    if(cacheAudio.mediaId === media.id) {
      media.learnPointTime = cacheAudio.learnPointTime || 0
    }
    return ({
      ...media,
      paused: true,
      currentTime: media.learnPointTime || 0
    })
  }

  // 设置音频
  setAudio() {
    const { audioObj } = this.state
    let audioCtx = Taro.getBackgroundAudioManager()
    audioCtx.src = audioObj.filePath
    this.audioCtx = audioCtx
    this.setState(
      { audioObj: this.transMedia(audioObj) }, 
      () => {
        const { paused, currentTime } = this.state.audioObj
        this.handlePushAudio(paused, currentTime)
      }
    )
  }

   // 控制播放器
   handlePushAudio = (paused, currentTime) => {
    let { audioObj, audioObj: { durationTime } } = this.state
    
    clearInterval(timer)
    if(paused) {
      this.audioCtx.seek(currentTime)
      this.audioCtx.play()
      timer = setInterval(() => {
        if(currentTime >= durationTime) {
          this.handlePushAudio(!paused, currentTime)
          return
        }
        currentTime++
        this.initDate++
        audioObj.currentTime = currentTime
        this.setState({ audioObj })
      }, 1000)
    } else {
      this.initDate = 0
      this.audioCtx.pause()
    }
    audioObj.paused = !paused
    this.setState({ audioObj })
  }

  componentDidMount() {
    this.setAudio()
  }

  // 拖拽音频进度条
  handleDragAudio = (currentTime) => {
    let audioObj = {
      ...this.state.audioObj,
      currentTime
    }
    this.setState({ audioObj })
  }

  // 进度条发生改变
  progressChagnge = (nowProgress) => {
    const { paused } = this.state.audioObj
    this.handlePushAudio(!paused, nowProgress )
  }

  componentWillUnmount() {
    this.sendLog()
  }

  sendLog() {
    let gap = this.initDate
    const { audioObj, header } = this.state
    Taro.setStorageSync('AUDIODATA', {...audioObj,
      type: header.type,
      mediaId: audioObj.id,
      title: header.title, 
      src: audioObj.filePath,
      paused: audioObj.paused
    })

    // 似乎没有必要发消息
    // if(gap <= 2) return

    // addLearnLog({
    //   type: 1,
    //   id: header.id,
    //   mediaId: audioObj.id,
    //   learnDurationTime: gap,
    //   learnPointTime: audioObj.currentTime,
    // })
  }

  render() {
    const { audioObj }  = this.state
    let { paused, currentTime, durationTime } = audioObj
    
    return (
      <View className='audio' >
        <Image className='bg' src={radioIcon} />
        <Image className={`btn ${!paused && 'pauseIcon'}`} src={ paused ? startIcon : pauseIcon} onClick={this.handlePushAudio.bind(this, paused, currentTime)} />
        <View className='rate'>
          <Rate 
            currentTime={currentTime} 
            durationTime={durationTime} 
            onDrag={this.handleDragAudio}
            onProgressChange={this.progressChagnge} 
          />
        </View>
        <Text className='start'>{getTime(currentTime || 0)}</Text>
        <Text className='end'>{getTime(durationTime)}</Text>
      </View>
    )
  }
}