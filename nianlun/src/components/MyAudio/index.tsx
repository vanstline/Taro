import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Rate from '../Progress'
import { addLearnLog } from '../../services/school'
import { getTime } from '../../utils/utils'
import './index.scss'

const startIcon = `${Taro.IMG_URL}/player.png`
const pauseIcon = `${Taro.IMG_URL}/pause.png`
// const radioIcon = `${Taro.IMG_URL}/tape-bg.png`
// const radioIcon = `https://nianlun-static/assets/tape-bg.png`
// tape-bg
let timer:any = 0
interface Props  {
  audioObj: Object;
  callback?:Function
}

export default class MyAudio extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = { 
      audioObj: props.audioObj||{},
      header: props.header
    }
  }
  initDate = 0
  audioCtx:any;
  componentWillReceiveProps(nextProps) {
    if(nextProps.audioObj.id !== this.state.audioObj.id) {
      this.sendLog()
      this.setState({ audioObj: {...nextProps.audioObj,paused:true} }, ()=>this.setAudio(true))
    }
  }

  // 转换音视频
  transMedia(media) {
    const cacheAudio = Taro.getStorageSync('AUDIODATA')
    let currentTime
    if(cacheAudio.mediaId === media.id) {
      currentTime = cacheAudio.currentTime || cacheAudio.learnPointTime || 0
    } else {
      currentTime = media.learnPointTime || 0
    }
    return ({
      ...media,
      paused: true,//cacheAudio.paused?true:false,
      currentTime
    })
  }

  // 设置全局播放记录
  setGlobalLog(bool = false) {
    Taro.CourseAudioCtxPause = bool
  }

  // 设置音频 此处去除了原来setstate 回调
  setAudio(autoPaly?) {
    const audioObj = this.transMedia(this.state.audioObj);
    const { paused, currentTime } = audioObj 
    const {header}= this.state;
    const title = (header.type===2?audioObj.chapterName:header.title)||'识践串串'
    this.audioCtx.title = title
    this.audioCtx.epname = title
    this.audioCtx.singer = '识践串串'
   
    this.setState({ audioObj})

    this.handlePushAudio(autoPaly ||paused, currentTime,autoPaly)
  }

   // 控制播放器
   handlePushAudio = (paused, currentTime=0,isOpposite?) => {
     
    let { audioObj, audioObj: { durationTime } } = this.state
    clearInterval(timer)
    let flag = true
    this.audioCtx.onWaiting((e) => {
      flag = false
    })
    // 当前音频状态变化
    if(this.audioCtx.src ===audioObj.filePath){
      paused = isOpposite===true?!this.audioCtx.paused:this.audioCtx.paused
    }
    // 播放地址变化(固定播放)
    if(this.audioCtx.src && this.audioCtx.src!==audioObj.filePath){
      paused=true;
    }
    // paused = this.audioCtx.paused===undefined?paused:(isOpposite===true?!this.audioCtx.paused:this.audioCtx.paused);
    if(!flag) return
    // this.audioCtx.onCanplay(() => {
      if(paused) {
        if(this.audioCtx.src ===audioObj.filePath){
          this.audioCtx.play()
          this.audioCtx.seek(currentTime);
          console.log('this.audioCtx.play()---')
        }else{
          this.audioCtx.src = audioObj.filePath
          this.audioCtx.startTime=currentTime;
        }
        // 设置src后不能直接seek 小程序大坑
        // setTimeout(() => {
          // this.audioCtx.seek(currentTime);
        // }, 200);
        // this.audioCtx.seek(currentTime);
        // console.log('seekStatus---',seekStatus)
        // this.audioCtx.play()
        
        this.setGlobalLog(true)
        timer = setInterval(() => {
          if(currentTime >= durationTime) {

            this.handlePushAudio(!paused, currentTime)
            this.handlePlayEnd()
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
        this.setGlobalLog(false)
      }
      audioObj.paused = !paused
      this.setState({ audioObj })
    // })
  }

  componentDidMount() {

    this.audioCtx = Taro.getBackgroundAudioManager()
    this.setGlobalLog(false)
    this.setAudio(true)
  }
  // componentDidShow() {
  //   this.setGlobalLog(false)
  //   this.setAudio()
  // }

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
    // const { paused } = this.state.audioObj
    const paused = this.audioCtx.paused;
    this.handlePushAudio(paused, nowProgress ,true)
  }

  componentWillUnmount() {
    this.setGlobalLog(false)
    this.sendLog()
  }

  sendLog() {
    let gap = this.initDate
    const { audioObj, header } = this.state
    Taro.setStorageSync('AUDIODATA', {...audioObj,
      type: header.type,
      id: header.id,
      mediaId: audioObj.id,
      title: header.type===2?audioObj.chapterName:header.title,  // 课 使用章节名称
      src: audioObj.filePath,
      paused: audioObj.paused,
      chapterId: audioObj.chapterId || '' ,
      currentTime: audioObj.currentTime,
      learnPointTime: audioObj.currentTime,

    })

    // 这里书籍可以有冲突 ，但课程是必须要发送
    if(gap <= 2 || gap >= 3600 * 4) return
    if(header.id && audioObj.currentTime){
      addLearnLog({
        type: 1,
        id: header.id,
        mediaId: audioObj.id,
        chapterId: audioObj.chapterId || '' ,
        learnDurationTime: gap,
        learnPointTime: audioObj.currentTime,
      })
    }
    
  }

  handlePlayEnd = () => {
    if(this.props.callback && typeof this.props.callback === 'function') {
      this.props.callback()
    }
  }

  render() {
    const { audioObj }  = this.state
    let {paused, currentTime, durationTime } = audioObj
    // const paused = this.audioCtx.paused?true:false
    return (
      <View className={`audio ${paused ? 'paused' : ''}`} >
        {/* <Image className='bg' src={radioIcon} /> */}
        <Image className={`btn ${!paused && 'pauseIcon'}`} src={ paused ? startIcon : pauseIcon} onClick={this.handlePushAudio.bind(this, paused, currentTime)} />
        <View className='rate-wrap'>
          <Text className='start'>{getTime(currentTime || 0)}</Text>
          <View className='rate'>
            <Rate 
              currentTime={currentTime} 
              durationTime={durationTime} 
              onDrag={this.handleDragAudio}
              onProgressChange={this.progressChagnge} 
            />
          </View>
          <Text className='end'>{getTime(durationTime)}</Text>
        </View>
      </View>
    )
  }
}