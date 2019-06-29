import Taro from '@tarojs/taro';
import { View, Text, Button, Input, Video, CoverView, CoverImage, Audio } from '@tarojs/components';
import { AtInput, AtButton, AtRange } from 'taro-ui'
import { getTime, clientRect } from '../../utils/utils'
import { giveAwardDaysAfterShare } from '@services/mine'
import connect from '../../connect/user'
import pageInit from '../pageInit'
import MyGraphic from '../../components/MyGraphic'
import MyCard from '../../components/MyCard'
import WhiteSpace from '../../components/WhiteSpace'
import Footer from '../../components/Footer'
import { addLearnLog } from '../../services/school'
import ToHtml from '../../components/WxParse/index'
import { bookDetail } from '../../services/book'
import throttle from '../../common/throttle'
import Rate from '../../components/Progress'
import Page from '../../layout/Page';

import './index.scss'

const startIcon = `${Taro.IMG_URL}/player.png`
const pauseIcon = `${Taro.IMG_URL}/pause.png`
const radioIcon = `${Taro.IMG_URL}/radio.png`
const timer = []
@connect
@pageInit()
export default class Test extends Taro.Component {

  constructor() {
    super()
    this.state = {
      typeIndex: 0,
      type: [
        '看视频',
        '听音频',
        '阅读文稿'
      ],
      data: {},
      audioStatus: false,
      audioObj: {
        paused: true,
        currentTime: 0,
        startTime: 0,
        length: 0,
      },
      vedioObj: {
        
      }
    }

    this.handleTimeUpdate = throttle(this.handleTimeUpdate.bind(this), 757)
  }

  audioPlayTime = 0
  vedioPlayTime = 0
  audioCurrentTime = 0
  vedioCurrentTime = 0

  config = {
    navigationBarTitleText: ''  
  }

  onShareAppMessage(res) {
    const { bookTitle, imgSharePosters, imgMain } = this.state.data
    const { user: { distributorId, unionid } } = this.props
    giveAwardDaysAfterShare()
    let obj =  {
      title: bookTitle,
      path: `${this.$router.path}?uid=${unionid}&did=${distributorId}`,
      imageUrl: imgSharePosters || imgMain,
    }
    return obj
  }

  handleCheckTypeIndex = (e) => {
    const { bookId, bookTitle } = this.state.data
    let { audioObj, audioObj: { currentTime, learnPointTime } } = this.state
    this.reTurnProgress()
    if(e === 2)  {
      Taro.navigateTo({ url: `/pages/draftList/index?id=${bookId}&title=${bookTitle}` })
    } else {
      this.setState({ typeIndex: e })
    }

    this.handlePushAudio(!true, learnPointTime || this.audioCurrentTime)
    
    if(e === 1) {
      this.setState({
        audioObj: {...audioObj, paused: true, currentTime: 0}
      }, () => {
        // console.log(this, '------tab 回调')
        this.audioCurrentTime = currentTime
        this.handlePushAudio( true, learnPointTime || this.audioCurrentTime )
      })
    }

  }

  handlePlayer = () => {
  }

  audioPlay = () => {
    this.audioCtx.play()
  }
  audioPause = () => {
    this.audioCtx.pause()
  }
  audio14 = () => {
    this.audioCtx.seek(14)
  }
  audioStart = () => {
    this.audioCtx.seek(0)
  }

  // 获取书籍详情
  async getBookDetail (id) {
    let bookId = id ? id : global.common.bookId
    let res = await bookDetail({bookId})
    this.setState({
      data: res.data.data
    }, () => {
      const { data } = this.state
      Taro.setNavigationBarTitle({ title: data.bookTitle })
      this.saveMedia()
    })
  }

  // 设置音频 
  saveMedia = () => {
    const {  bookMediaVideoRespVos, bookMediaAudioRespVos } = this.state.data
    let audio = bookMediaAudioRespVos && bookMediaAudioRespVos[0]
    let audioCtx = Taro.createInnerAudioContext()
    if( audio ) {
      audioCtx.src = audio.filePath
      this.audioCtx = audioCtx
      this.setState({ audioObj: this.transMedia(audio, audioCtx) })
    }
  }

  // 转换音视频
  transMedia(media, ctx) {
    return ({
      ...media,
      paused: ctx.paused,
      currentTime: ctx.currentTime,
      startTime: ctx.startTime,
      durationTime: media.durationTime,
      ...ctx
    })
  }

  componentDidMount() {
    const id = this.$router.params.id || 1;
    this.getBookDetail(id)
    Taro.getBackgroundAudioManager().pause()
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

  initProgressTime() {
    this.audioPlayTime = 0
    this.audioCurrentTime = 0
    this.vedioPlayTime = 0
    this.vedioCurrentTime = 0
  }

  componentWillUnmount() {
    this.reTurnProgress()
    // console.log(this.audioCtx)
    // Taro.GlobalBgAudioCtx.src = this.audioCtx.src
    // Taro.GlobalBgAudioCtx.seek(this.audioCurrentTime)
    // const { bookTitle } = this.state.data
    // Taro.GlobalBgAudioCtx.title = bookTitle
    // Taro.GlobalBgAudioCtx.title = bookTitle
    // Taro.GlobalBgAudioCtx.title = bookTitle
    // console.log(Taro.GlobalBgAudioCtx)
    // Taro.GlobalBgAudioCtx.play()
    this.audioCtx.destroy()
    clearInterval(timer[1])
  }

  // 返回播放进度
  reTurnProgress = () => {
    const { audioObj, data } = this.state
    if(!data.bookMediaAudioRespVos) {
      return
    }
    // 书籍
    let obj = {
      type: 1,
      id: data.bookId,
      // mediaId: data.bookMediaAudioRespVos[0].id,
      
    }
    this.returnAudio(obj)
    this.returnVedio(obj)
    // this.initProgressTime()
  }
  
  // 音频
  returnAudio(obj) {
    if(this.audioPlayTime <= 1) {
      return
    }
    const { data, audioObj } = this.state
    const audioData = {
      ...obj,
      mediaId: audioObj.id,
      learnPointTime: this.audioCurrentTime,
      learnDurationTime: this.audioPlayTime,
      
    }
    // 设置本地缓存
    Taro.setStorageSync('AUDIODATA', {...audioData,
      title:data.bookTitle, 
      src:data.bookMediaAudioRespVos[0].filePath,
      paused: audioObj.paused
    });
    addLearnLog(audioData)
    
  }

  // 视频
  returnVedio(obj) {
    if(this.vedioPlayTime <= 1) {
      return
    }
    const { data } = this.state
    addLearnLog({
      ...obj,
      mediaId: data.bookMediaVideoRespVos[0].id,
      learnPointTime: this.vedioCurrentTime,
      learnDurationTime: this.vedioPlayTime
    })
  }

  // 视频进度发生变化
  handleTimeUpdate = (e) => {
    // console.log(e, '视频进度发生变化')
    let cb = () => {
      this.vedioPlayTime++
      this.vedioCurrentTime = Math.floor(e.target.currentTime)
    }
    setTimeout(cb, 750)
    // this.vedioPlayTime++
    // this.vedioCurrentTime = Math.floor(e.target.currentTime)
  }

  render() {

    const { type, typeIndex, audioStatus, audioObj, vedioObj, data } = this.state;
    let { paused, currentTime, startTime, durationTime } = audioObj
    return (
      <View className='details-book'>  
        <View className='media'>
          <View className='media-cont'>
            {
              typeIndex === 0 && data && data.bookMediaVideoRespVos && (
                <Video 
                  src={data.bookMediaVideoRespVos[0].filePath || ''} 
                  // poster={data.imgMedia}
                  initialTime={data.bookMediaVideoRespVos[0].learnPointTime || 0}
                  autoplay
                  onTimeUpdate={this.handleTimeUpdate}
                ></Video>
              )
            }
            {
              typeIndex === 1 && (
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
                  <Text className='start'>{getTime(currentTime || 0)}</Text>
                  <Text className='end'>{getTime(durationTime)}</Text>
                </View>
              )
            }
          </View>
          <View className='media-button'>
            {
              type && type.map( (item, i) => {
                return <View key={i+''}  className={`sub-btn ${typeIndex === i && 'active'}`} onClick={this.handleCheckTypeIndex.bind(this, i)}>{item}</View>
              } )
            }
          </View>
        </View>
        <View className='content'>
          <View className='books'>
            <MyGraphic title={data.bookTitle || ''} img={data.imgMain} isNew>
              <View className="graphic-describe">
                <View className='graphic-content'>{data.commendTitle}</View>
                <View className='graphic-button'>{data.studyNum || 0}人学习</View>
              </View>
            </MyGraphic>
          </View>
          <WhiteSpace />
          <View className='recommend' >
            <ToHtml html={data.bookDesc} />
          </View>
        </View>
        <Button className='share-btn' openType='share'><Text /></Button>
      </View>
    )
  }

}

