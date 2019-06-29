import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Rate from '../../../components/Progress'
import MyAudio from '../../../components/MyAudio'
import MyVedio from '../../../components/MyVedio'
import { getTime, clientRect } from '../../../utils/utils'
import { addLearnLog } from '../../../services/school'
import throttle from '../../../common/throttle'
import './media.scss'

const startIcon = `${Taro.IMG_URL}/player.png`
const pauseIcon = `${Taro.IMG_URL}/pause.png`
const radioIcon = `${Taro.IMG_URL}/radio.png`
const timer = []

export default class Media extends Component {

  constructor(props) {
    super(props)
    this.state = {
      source: {},
      course: props.course,
      audioObj: {
        paused: true,
        currentTime: 0,
        startTime: 0,
        length: 0,
      },
      mediaType: true
    }
    this.vedioPlayTime = 0
    this.vedioCurrentTime = 0
    this.audioPlayTime = 0
    this.audioCurrentTime = 0

    // this.handleTimeUpdate = throttle(this.handleTimeUpdate.bind(this), 750)
  }

  // 转换音视频
  transMedia(media, ctx) {
    return ({
      ...media,
      paused: ctx.paused,
      currentTime: ctx.currentTime,
      startTime: ctx.startTime,
      durationTime: media.durationTime,
      learnPointTime: media.learnPointTime,
      ...ctx
    })
  }

  componentWillReceiveProps(n) {
    const { source } = n
    if(this.audioCtx) {
      this.audioCtx.destroy()
    }
    this.returnAudio()
    this.returnVedio()
    if(source.id !== this.state.source.id) {
      let mediaType
      if(source.bookCourseMediaAudioRespList) {
        mediaType = false
        this.returnAudio()
       
        let audio = source.bookCourseMediaAudioRespList[0]
       
        let audioCtx = Taro.createInnerAudioContext()
        // console.log(audioCtx, '---audioCtx')
        if( audio ) {
          audioCtx.src = audio.filePath
          this.audioCtx = audioCtx
          // audioCtx.play()
          // console.log(this.audioCtx.duration, '---this')
          this.setState({ audioObj: this.transMedia(audio, audioCtx) }, 
            () => {
              // console.log(this.state.audioObj, '------audioObj')
              const learnPointTime = this.state.audioObj.learnPointTime || 0
              this.handlePushAudio(true, learnPointTime)
            }
          )
        }
      } else {
        this.returnVedio()
        if(Taro.myVedio) {
          // console.log(Taro.myVedio, '------Taro.myVedio')
          Taro.myVedio.pause()
        }
        Taro.myVedio = Taro.createVideoContext('myVedio')
        // console.log(Taro, '------全局taro')
        // Taro.myVedio.pause()
        Taro.myVedio.play()
        mediaType = true
      }
      this.setState({
        source,
        mediaType
      })
    }
  }

  componentDidMount() {
    
    // console.log('chongxin更新至')
  }

  // 视频进度发生变化
  handleTimeUpdate = (e) => {
    let cb = () => {
      this.vedioPlayTime++
      this.vedioCurrentTime = Math.floor(e.target.currentTime)
    }
    // cb
    setTimeout(cb, 750)
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
          if(currentTime === durationTime) {
            // console.log('音频播放结束')
            this.handlePlayEnd()
          }
          if(currentTime < durationTime) {
            currentTime++
            this.audioPlayTime++  // 播放时长
            // console.log(this.audioPlayTime, '---当前播放时间')
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

  componentWillUnmount() {
    this.returnAudio()
    this.returnVedio()
    this.audioCtx.destroy()
  }

  getTimeLogObj () {
    const { source } = this.props
    return ({
      type: 2,
      id: this.props.course.id,
      chapterId: this.state.source.id,
      
    })
  }

  // 音频时长
  returnAudio() {
    if( this.audioPlayTime > 1 && this.state.source.bookCourseMediaAudioRespList ){
      // const { currentIndex,  } = this.props
      let obj = this.getTimeLogObj()

      addLearnLog({
        ...obj,
        mediaId: this.state.source.bookCourseMediaAudioRespList[0].id,
        learnPointTime: this.audioCurrentTime,
        learnDurationTime: this.audioPlayTime
      })
      this.audioPlayTime = 0
      this.audioCurrentTime = 0
    }
  }

  // 视频时长
  returnVedio() {
    if(this.vedioPlayTime > 1 && this.state.source.bookCourseMediaVideoRespList) {
      let obj = this.getTimeLogObj()
      addLearnLog({
        ...obj,
        mediaId: this.state.source.bookCourseMediaVideoRespList[0].id,
        learnPointTime: this.vedioCurrentTime,
        learnDurationTime: this.vedioPlayTime
      })
      this.vedioPlayTime = 0
      this.vedioCurrentTime = 0
    }
  }

  handlePlayEnd = () => {
    this.props.onNextLesson()
  }

  render() {
    const { mediaType, source, audioObj, course } = this.state
    let { paused, currentTime, startTime, durationTime } = audioObj
    const header = {
      id: course.id,
      type: 2,
      title: course.title
    }
    return (
      <View className='media'>
        {/* {
          mediaType && source.bookCourseMediaVideoRespList && (
            <Video id='myVedio'
              src={source.bookCourseMediaVideoRespList[0].filePath}
              initialTime={source.bookCourseMediaVideoRespList[0].learnPointTime || 0}
              autoplay
              onTimeUpdate={this.handleTimeUpdate}
              onEnded={this.handlePlayEnd}
            />
          )
        }
        {
          !mediaType && (
            <View className='audio'>
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
        } */}
        {
          mediaType && source.bookCourseMediaVideoRespList && <MyVedio header={header} vedioObj={source.bookCourseMediaVideoRespList[0]} />
        }
        {
          !mediaType && <MyAudio header={header} audioObj={source.bookCourseMediaAudioRespList[0]} />
        }
      </View>
    )
  }
}