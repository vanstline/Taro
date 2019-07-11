import Taro, { Component } from '@tarojs/taro'
import { View, Input, Video, Canvas } from '@tarojs/components'
import { AtButton, AtImagePicker, AtCurtain } from 'taro-ui'
import {  Record } from '../../components'
import pageInit from '../pageInit'
import connect from '../../connect/course'
import { submitWork } from '../../services/homework'
import { uploadByBase64 } from '../../services/common'
import { sign, base64, showToast } from '../../utils/utils'
import './index.scss'
let timer = null
let timer2 = null

const recordBg = `${Taro.IMG_URL}/record.png`
const commitBg = `${Taro.IMG_URL}/commit-bg.png`

const timeEnd = 60000

const Toast = (title) => Taro.showToast({ icon: 'none', title })
const recorderManager = Taro.getRecorderManager();
const ToastTitleArr = [
  '请输入作业描述',
  '请上传图片文件',
  '请上传录音文件',
]

@connect
@pageInit()
export default class Production extends Component {

  constructor () {
    super(...arguments)
    this.state = {
      type: this.$router.params.workType || '1',
      files: [],
      rect: {},
      audioUrl: '',
      timeLength: 0,
      isOpened: false,
      recordStatus: false,
      imgLoading: false
    }
  }

  onChange = async (files, operationType, index) => {
    console.log(files, operationType, index)
    switch(operationType) {
      case 'add':
        this.uploadImageCallback(files[files.length-1].url)
        return
      case 'remove':
        this.removeImageFile(index)
        return
      default:
        return
    }
  }

  // 上传图片回调
  uploadImageCallback(url) {
    this.setState({ imgLoading: true })
    base64(url)
      .then( res => {
        this.uploadFileImage(res, url )
      } )
  }

  // 图片添加
  async uploadFileImage(base64, fileName) {
    // console.log(base64, fileName)
    base64 = encodeURIComponent(base64)
    let res = await uploadByBase64({ base64, fileName, fileCode: 'pic' })
    if(res.data.returnCode === 0) {
      let { files } = this.state
      files.push({
        url: res.data.data,
        file: { path: res.data.data }
      })
      this.setState({ files, imgLoading: false })
    }
  }

  // 图片删除
  removeImageFile(index) {
    let { files } = this.state
    files.splice(index, 1)
    this.setState({ files })
  }

  onFail (mes) {
    console.log(mes)
  }
  onImageClick (index, file) {
    console.log(index, file)
  }

  componentDidMount() {
    this.getCanvas()
    this.recorderManager = Taro.getRecorderManager()
    Taro.setNavigationBarTitle({
      title: '发作品'
    })
  }

  onClose = () => {
    const { getWorkListPage} = this.props
    const { bookCourseId, bookCourseChapterId } = this.$router.params
    let data = { bookCourseId, bookCourseChapterId }
    getWorkListPage({...data, type: 1}, 'mine')
    getWorkListPage({...data, type: 2}, 'other')
    this.setState({ isOpened: false })
    Taro.navigateBack()
  }
  // 提交
  async fetchCommit (arr, content) {
    // 
    // return
    const { bookCourseId, bookCourseChapterId } = this.$router.params
    let res = await submitWork({
      bookCourseChapterId,
      bookCourseId,
      content,
      ubwfList: arr,
      // "userBookCourseWorkId": 1
    })
    try {
      if(res.data.returnCode === 0) {
        this.setState({ isOpened: true })
      }
    } catch (error) { }
  }

  // getCanvas
  getCanvas = () => {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select('.voice').boundingClientRect().exec(res => {
        this.setState({ rect: res[0] })
    })
  }

  // 画圆
  drawCanvas = () => {
    this.ctx = Taro.createCanvasContext('canvas', this.$scope)
    const { rect } = this.state
    this.canvasTap(0, 100, 60/100*1000, rect.width/2, rect.height/2)
  }

  run = (c, w, h) => {  //c是圆环进度百分比   w，h是圆心的坐标
	  var num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
	  this.ctx.arc(w, h, w - 2, -0.5 * Math.PI, num); //绘制的动作
	  this.ctx.setStrokeStyle("#FF6105"); //圆环线条的颜色
	  this.ctx.setLineWidth("2");	//圆环的粗细
	  this.ctx.setLineCap("butt");	//圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
	  this.ctx.stroke();
	  this.ctx.draw();
  }
 
  canvasTap = (start, end, time, w, h) => {  //传入开始百分比和结束百分比的值，动画执行的时间，还有圆心横纵坐标
    start++;
    if (start > end) {
      return false;
    }
    this.run(start, w, h); //调用run方法
    timer = setTimeout(() => {
      this.canvasTap(start, end, time, w, h);
    }, time);
  }

  // 添加文字描述
  handleChangInput = (e) => {
    this.setState({ value: e.detail.value })
  }

  // 提交
  handleCommit = () => {
    const { type, files, value, audioUrl, timeLength } = this.state
    let arr = []
    if(type === '1') {
      arr = files.map( item => ({
        type,
        resourcePath: item.url
      }) )
    } else if(audioUrl) {
      arr = [{
        type,
        resourcePath: audioUrl,
        durationTime: timeLength
      }]
    }
    if(!value) {
      Toast(ToastTitleArr[0])
      return
    }
    if(!arr.length) {
      Toast(ToastTitleArr[type])
      return
    }
    this.fetchCommit(arr, value)
  }

  // 录音时长记录
  recordTimeLog () {
    this.drawCanvas()

    clearInterval(timer2)
    timer2 = setInterval(() => {
      console.log('还在录制', Date.now())
      const { timeLength } = this.state
      this.setState({ timeLength: timeLength+1 })
    }, 1000)

    setTimeout(function () {
      clearTimeout(timer)
      Taro.stopRecord() // 结束录音
    }, timeEnd)
  }

  // 播放
  handlePlay = () => {
    console.log(this.state.audioUrl)
    Taro.playVoice({
      filePath: this.state.audioUrl,
      complete () {
        console.log('成功')
       },
      fail () {
        console.log('失败')
       }
    })
  }

  // 重录
  handleRsetRecord = () => {
    const { rect } = this.state
    let cb = () => this.canvasTap(0, 0, 0, rect.width/2, rect.height/2)
    this.setState({ audioUrl: '', timeLength: 0 }, cb)
  }

  // 重写录音功能
  sayVideo = e => {
    const _this = this;
    const { recordStatus } = this.state
    const options = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50,
      clickId: -1
    };

    if(recordStatus) {
      Taro.authorize({
        scope: 'scope.record',
        success() {
          console.log('录音授权成功');
        },
        fail() {
          Taro.openSetting({
            success(res) {
              // console.log(res.authSetting);
              if (!res.authSetting['scope.record']) {
                //未设置录音授权
                console.log("未设置录音授权");
                Taro.showModal({
                  title: '提示',
                  content: '您未授权录音，功能将无法使用',
                  showCancel: false,
                  success: function(res) {},
                });
              } else {
                //第二次才成功授权
                console.log("设置录音授权成功");
                _this.setState({
                  recordStatus: 2,
                })
                recorderManager.start(options);
                this.recordTimeLog()
              }
            }
          })
        }
      })
    } else {
      recorderManager.start(options);
      this.recordTimeLog()
    }
  }

  sayVideoEnd = e => {
    const _this = this
    recorderManager.stop(); //先停止录音
    clearInterval(timer2)
    clearTimeout(timer)
    recorderManager.onStop((res) => {  //监听录音停止的事件

        if (res.duration < 1000) {
            showToast('录音时间太短');
            return;
        } else {
            // wx.showLoading({
            //     title: '发送中...',
            // });
            
            var tempFilePath = res.tempFilePath; // 文件临时路径
            // console.log(tempFilePath, '--------tempFilePath')

            var temp = tempFilePath.replace('.mp3', '') //转换格式 默认silk后缀
            // console.log(res.tempFilePath)
            this.uploadRecord(tempFilePath)
            // this.setState({audioUrl: tempFilePath})
            
        }

    });
  }



  // 录音文件上传
  uploadRecord(url) {
    base64(url)
    .then( res => {
      this.uploadFileRecord(res, url )
    } )
  }

  async uploadFileRecord(base64, fileName) {
    // console.log(base64, fileName)
    base64 = encodeURIComponent(base64)
    // fileName = 'Record-' + Date.now()
    let res = await uploadByBase64({ base64, fileName, fileCode: 'record' })
    if(res.data.returnCode === 0) {
      // console.log(res.data.data, '------录音文件')
      this.setState({ audioUrl: res.data.data })
    }
  }

  handleTouchStart = (id) => {
    this.setState({ clickId: id })
  }

  onTouchEnd = () => {
    this.setState({ clickId: -1 })
  }

  componentWillUnmount() {
    clearInterval(timer2)
    clearTimeout(timer)
  }

  render () {
    const { type, files, value, audioUrl, clickId,  } = this.state

    const btnArr = [
      {id: 0, name: '很赞'},
      {id: 1, name: '一般'},
      {id: 2, name: '不满意'},
    ]
    return (
      <View className='pro'>
        <Input ref={ inp => this.inp = inp } value={value} onInput={this.handleChangInput} placeholder='添加作业描述……'/>
        {
          type === '1' ? (
            <View className={`image ${imgLoading && 'loading'}`}>
              <AtImagePicker
                showAddBtn={ files.length < 4 }
                files={files}
                onChange={this.onChange.bind(this)}
              />
              <View >最多显示3张照片</View>
            </View>
          ) : (
            <View className='voice-wrap'>
              {
                audioUrl ? (
                    <View className='audio-wrap'>
                      <View className='audio'>
                        <Record timeLength={this.state.timeLength} audioUrl={this.state.audioUrl} />
                      </View>
                      <View className='resetRecord' onClick={this.handleRsetRecord}>重录</View>
                    </View>
                ) : (
                  <View 
                    className='voice' 
                    style={{ backgroundImage: `url(${recordBg})` }}
                    // onTouchStart={this.handleTouchDown}
                    // onTouchEnd={this.handleTouchUp}
                    onTouchStart={this.sayVideo}
                    onTouchEnd={this.sayVideoEnd}
                  >
                    <Canvas style='width: 100%; height: 100%;'  canvasId='canvas' />
                  </View>
                )
              }
            </View>
          )
        }
        
        
        <View className='commit'><AtButton onClick={this.handleCommit} >提交作品</AtButton></View>

        <AtCurtain 
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View className='commit-review' style={{ backgroundImage: `url(${commitBg})` }}>
            <View>
              <View className='title'>作业作品提交成功</View>
              <View className='text'>请点击选出对本节课程评价吧</View>
              <View className='choice'>
                {/* <View className={medium} onClick={this.onClose}>很赞</View>
                <View className={medium} onClick={this.onClose}>一般</View>
                <View className={medium} onClick={this.onClose}>不满意</View> */}
                {
                  btnArr.map( item => {
                    return <View key={item.id}
                            className={item.id === clickId && 'medium'} 
                            onClick={this.onClose}
                            onTouchStart={() => this.handleTouchStart(item.id)}
                            onTouchEnd={this.onTouchEnd}
                            >{item.name}</View>
                  } )
                }
              </View>
            </View>
            <View className='next' onClick={this.onClose}>下次再评</View>
          </View>
        </AtCurtain>
      </View>
    )
  }
}

// chooseImage({
      
// })