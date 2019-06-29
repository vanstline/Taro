import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '../../services/api'
import { Host } from '../../services/config'
import './index.scss'
import coverImg from './images/cover.png'
import closeImg from './images/close.png'
import playImg from './images/play.png'
import unplayImg from './images/unplay.png'
import { addLearnLog } from '../../services/school'
export default class Player extends Component {

  componentWillReceiveProps(nextProps) {
    // if ('isOpen' in nextProps) {
    //   const isOpen = nextProps.isOpen;
    //   this.setState({ isOpen: isOpen,isPlayer:true });
    //   if(isOpen){
    //     this.handleSetPlay()
    //   }
      
    // }
  }
  constructor() {
    super(...arguments)
    this.state={
      isOpen:false,
      isPlayer:false,
      startTime:0,
      endTime:0,
      audioData:{},
    }
    
    
  }
  componentWillMount() {
    let userInfo = Taro.getStorageSync('userinfo')
    const audioData = Taro.getStorageSync('AUDIODATA')
    this.audioCtx = Taro.getBackgroundAudioManager()
    // 优先本地缓存
    if(audioData&&audioData.src){
     
      return this.setState({audioData,isOpen:true},()=>this.initAudioCtx(audioData));
    }
    
    
    if(!!userInfo ) {
      return this.getInfo()
    }
    
    // if(this.audioCtx.currentTime){
    //   const aa = Taro.GlobalBgAudioCtx
    //   this.setState({isOpen:true,isPlayer:true,audioData:{...audioData,title:this.audioCtx.title}})
    // }
  }
  getInfo = async () => {
    const response = await api.post(`${Host}/studyRoom/myLastLearnRecord`)
    if (response.data.returnCode === 0) {
      const data = response.data.data||{};
      if(data && data.type){
        const audioList = (data.mediaList||[]).filter(item=>item.fileType===0)
        const audioData ={
          id:data.fkId,
            learnDurationTime:0,
            learnPointTime:data.learnPointTime,
            mediaId:data.mediaId,
            src:audioList[0].filePath,
            title:data.title,
            type:data.type
        }
        this.setState({
          audioData,
          isOpen:true
        },()=>this.initAudioCtx(audioData))
        
        
      }
      
      
      
    }
  }
  initAudioCtx = (data)=>{
    if(this.audioCtx.paused !==undefined){
      this.setState({isOpen:true,isPlayer:!this.audioCtx.paused})
    }
    
    this.props.onChange(true)
    this.audioCtx.title = data.title||'年轮学堂'
    this.audioCtx.epname = data.title||'年轮学堂'
    this.audioCtx.singer = '年轮学堂'
    // 初始化或暂停的时候
    if((this.audioCtx.paused ==undefined||this.audioCtx.paused ==true) &&data.paused!==undefined){
      if(!data.paused){
        this.audioCtx.src=data.src
        this.audioCtx.seek((data.learnPointTime||0)+2)
      }
      this.setState({isOpen:true,isPlayer:!data.paused})
    }
    this.audioCtx.onPlay(()=>{
      Taro.audioStartTime = Date.now();
      this.setState({startTime:Date.now()},()=>this.addLearnLog())
      
      console.log('背景音频开始播放-----',Date.now())

    })
    this.audioCtx.onStop(()=>{
      this.setState({endTime:Date.now()})
      
      console.log('背景音频停止播放-----',Date.now())
    })
    this.audioCtx.onPause(()=>{
      // const backgroundAudioManager = this.audioCtx;
      // 
      this.setState({endTime:Date.now()},()=>this.addLearnLog())
      console.log('背景音频暂停播放-----',Date.now())
    })
    Taro.GlobalBgAudioCtx = this.audioCtx
  }
  addLearnLog =()=>{
    const {
      audioData,
      startTime,
      endTime
    } = this.state;
    
    const learnDurationTime = parseInt((endTime-(Taro.audioStartTime))/1000);
    const data = {
      type: audioData.type,
      id: audioData.id,
      chapterId: audioData.chapterId||'',
      mediaId: audioData.mediaId,
      learnPointTime: parseInt(this.audioCtx.currentTime),
      learnDurationTime
    }
    // 播放十五秒之内不发请求 
    if(learnDurationTime>1){
      // 设置本地缓存
    Taro.setStorageSync('AUDIODATA', {...data,
      title:audioData.title, 
      src:audioData.src,
      paused: this.audioCtx.paused
    });
    
      addLearnLog(data)
    }
    
  }
  handleSetPlay=()=>{
    const {
      audioData={}
    } = this.state;
    // 获取音频列表
    // const audioList = (audioData.mediaList||[]).filter(item=>item.fileType===0)
    if(audioData.title && audioData.src){
      // 设置了 src 之后会自动播放
      
      // const audio = audioList[0]
      this.audioCtx.src = audioData.src
      // 跳转的位置，单位 s audio.durationTime 
      this.audioCtx.seek(audioData.learnPointTime||0)
    }
  }
  handleClose = ()=>{
    this.audioCtx.stop()
    this.setState({isOpen:false})
    this.props.onChange(false)
  }
  handlePlayer = ()=>{
    const {
      isPlayer
    } = this.state;
    
    if(isPlayer) {
      this.audioCtx.pause()
      // this.addLearnLog()
    }else{
      console.log('this.audioCtx.src',this.audioCtx.src)
      if(this.audioCtx.src){
        this.audioCtx.play()
      }else{
        this.handleSetPlay()
      }
      
    }
    this.setState({isPlayer:!this.state.isPlayer})
  }
  handleToDetail =(id)=>{
    Taro.navigateTo({
      url: `/pages/detailsBook/index?id=${id}`
    })
  }
  render() {
    
    const {
      isOpen,
      isPlayer,
      audioData
    } = this.state;
    const {
      poster=coverImg,
      id,
      title
    } = audioData
    return (isOpen?
      <View  className={`components-player ${isPlayer?'play':'unplay'}`}>
        
        <View className='subject'>
          {!isPlayer&&<View className='close' onClick={this.handleClose.bind(this)}><Image src={closeImg}/></View>}
          <View className='play-right' onClick={this.handleToDetail.bind(this,id)}>
            <View className={`cover`} ><Image src={poster}/></View>
            <View className='subject-right'>
            <View className='status'>正在播放</View>
            <View className='title'>{title}</View>
            </View>
          </View>
        </View>
        <View className='operation' onClick={this.handlePlayer.bind(this)}>
        {isPlayer?<Image src={unplayImg}/>:<Image src={playImg}/>}
        </View>
      </View>:''
    )
  }
}
