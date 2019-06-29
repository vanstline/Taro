import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Rate from '../Progress'
import { getTime, clientRect } from '../../utils/utils'

const startIcon = `${Taro.IMG_URL}/player.png`
const pauseIcon = `${Taro.IMG_URL}/pause.png`
const radioIcon = `${Taro.IMG_URL}/radio.png`
const timer = []

interface Props  {
  audioObj: {}
}

export default class MyAudio extends Component<Props, any> {

  constructor() {
    super()
    this.state = { 
      audioObj: this.props.audioObj || {}
    }
  }

  componentDidMount() {
    console.log(this.state, '----yinp')
  }

  // 播放音频
  handlePushAudio = (status, currentTime) => {
    const { audioObj } = this.state
    this.audioCtx.seek(currentTime)
    audioObj.paused = !status

    let cb = () => {
      if(status) {
        this.audioCtx.play()
        clearInterval(timer[1])
        timer[1] = setInterval( () => {

          let { currentTime, durationTime, paused } = this.state.audioObj
          let newAudioObj = Object.assign({}, audioObj)
          if(currentTime < durationTime) {
            currentTime++
            this.audioPlayTime++  // 播放时长
            console.log(this.audioPlayTime, '---当前播放时间')
            this.audioCurrentTime = currentTime
            newAudioObj.currentTime = currentTime
          } else {
            this.audioCtx.pause()
            clearInterval(timer[1])
            newAudioObj.paused = !paused
            newAudioObj.currentTime = durationTime
          }
          this.setState({ audioObj: newAudioObj})
        }, 1000 )
      } else {
        this.audioCtx.pause()
        clearInterval(timer[1])
      }
    }
    this.setState({ audioObj: {...audioObj, currentTime} }, cb)
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

  render() {
    let { paused, currentTime, startTime, durationTime } = this.state.audioObj
    return (
      <View className='audio' 
      >
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
        <Text className='start'>{getTime(currentTime)}</Text>
        <Text className='end'>{getTime(durationTime)}</Text>
      </View>
    )
  }
}