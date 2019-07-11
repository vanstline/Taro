import Taro, { Component, useState, audioSourcesTypes } from '@tarojs/taro'
// import upng from 'upng-js';
import { View, Text, ScrollView, Image, Canvas } from '@tarojs/components';
import { giveAwardDaysAfterShare } from '../../services/mine'
import './share.scss';
const rulePng = `${Taro.IMG_URL}/award-ruler.png`
import api from '../../services/api'
import { Host } from '../../services/config'

export default class Share extends Component<any, any>{
  timer=Date.now()
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      screenWidth: 0,
      screenHeight: 0,
      signatureUrl: '',
      canvasHeight: 400,
      shareImage: '',
      canvasWidth: 270,
      posterList: [],
      active: 0,
      own: undefined,
      imgs: new Map(),
      imageWidth: 0,
      imageHeight: 0,
    }
    Taro.showToast({title:'加载中', icon: 'loading'});
    Taro.getSystemInfo({
      success: (res) => {
        // console.log(res.screenWidth)
        this.setState({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          canvasWidth: 270 * res.screenWidth / 375,
          // canvasWidth: res.screenWidth,
        })
      }
    })
  }
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '分享给好友'
    })
    this.initSignature(this.initCanvas)
    // this.getInfo(this.$router.params.type);

    // if (this.canvas) {
    //   const query = Taro.createSelectorQuery();

    //   query().boundingClientRect(ret => console.log(ret))
    // }
  }

  getInfo = async (type) => {
    const response = await api.post(`${Host}/personalcenter/findPosterList`);
    if (response.data.returnCode === 0) {
      const posterList = Number(type) === 1 ? response.data.data.posterShareImgList : response.data.data.posterPayImgList;
      if (posterList.length > 0) {
        this.clickImg(posterList[0], 0)
      }
      this.setState({
        posterList,
      })
    }
  }

  clickSmallImg = (index) => {

  }

  calc = (canvasWidth, num: number) => {
    return (num * canvasWidth / 270)
  }
  initSignature = async (callback) => {
    console.log('signature===xxxxx',Date.now()-this.timer)
    this.timer=Date.now()
    const response = await api.post(`${Host}/personalcenter/findPosterList`);
    const resData = response.data.data
    if (response.data.returnCode === 0) {
      const posterList = Number(this.$router.params.type) === 1 ? resData.posterShareImgList : resData.posterPayImgList;
      this.setState({
        posterList,
      })
    }
    console.log('signature===0000',Date.now()-this.timer)
    this.timer=Date.now()
    const weChatCode = Number(this.$router.params.type) === 1 ? await api.post(`${Host}/wechat/getWxacodeUnlimit`, { scene: `uid=${resData.userId}&did=${resData.distributorId}`, appId: global.common.appid },true)
      : await api.post(`${Host}/common/getQrcode`, { qrCodeWidth: 200, qrCodeHeight: 200, qrCodeUrl: `${resData.h5Url}?uid=${resData.userId}&did=${resData.distributorId}` },true);//获取微信二维码
    // console.log(weChatCode.data.data);
    // const codeUrl = weChatCode.data.data;
    let codeUrl:any = await Taro.downloadFile({url: weChatCode.data.data});
    codeUrl = codeUrl.tempFilePath;
    let headImg: any = await Taro.downloadFile({url: this.$router.params.headImg});
    headImg = headImg.tempFilePath;
    const { canvasWidth } = this.state;
    const ctx = Taro.createCanvasContext('signature', this.$scope);
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth * 3, this.calc(canvasWidth, 70) * 3);
    if (headImg) {
      ctx.drawImage(headImg, 0, 0, '100%', '100%', this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 50) * 3, this.calc(canvasWidth, 50) * 3)
    } else {
      ctx.fillStyle = 'orange'
      ctx.fillRect(this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 50) * 3, this.calc(canvasWidth, 50) * 3);
    }
    ctx.fillStyle = '#333333'
    ctx.setFontSize(this.calc(canvasWidth, 14) * 3);
    ctx.fillText(this.$router.params.name || '您的好友', this.calc(canvasWidth, 70) * 3, this.calc(canvasWidth, 22) * 3)
    ctx.setFontSize(this.calc(canvasWidth, 12) * 3);
    ctx.fillStyle = '#222222'
    ctx.fillText('邀您加入识践串串', this.calc(canvasWidth, 70) * 3, this.calc(canvasWidth, 43) * 3)
    ctx.fillText(Number(this.$router.params.type) === 1 ? `扫描二维码立得${this.$router.params.days}天会员` : '扫描二维码即可付费入会', this.calc(canvasWidth, 70) * 3, this.calc(canvasWidth, 58) * 3)
    if (codeUrl) {  //二维码存在则画二维码
      ctx.drawImage(codeUrl, 0, 0, '100%', '100%', this.calc(canvasWidth, 210) * 3, this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 50) * 3, this.calc(canvasWidth, 50) * 3)
    } else {
      ctx.fillRect(this.calc(canvasWidth, 210) * 3, this.calc(canvasWidth, 10) * 3, this.calc(canvasWidth, 50) * 3, this.calc(canvasWidth, 50) * 3);
    }
    console.log('signature===111',Date.now()-this.timer)
    this.timer=Date.now()
    ctx.draw(true, async () => {
      console.log('signature===222',Date.now()-this.timer)
      this.timer=Date.now()
      setTimeout(() => {
      Taro.canvasToTempFilePath({
        fileType: 'jpg',
        canvasId: 'signature',
        success: (res) => {
          console.log('signature===333',Date.now()-this.timer)
          this.timer=Date.now()
          this.setState({
            signatureUrl: res.tempFilePath,
          }, () => {
            callback();
          })
        }
      })
    },300)

    });
  }
  ctx
  initCanvas = async () => {
    const { signatureUrl, canvasHeight, canvasWidth, posterList } = this.state;
    this.ctx = Taro.createCanvasContext('shareCanvas', this.$scope);
    this.ctx.drawImage(signatureUrl, 0, 0, '100%', '100%', 0, this.calc(canvasWidth, canvasHeight - 70) * 3, canvasWidth * 3, this.calc(canvasWidth, 70) * 3)
    this.ctx.draw(true, () => {
      // Taro.canvasToTempFilePath({
      //   canvasId: 'shareCanvas',
      //   success: (res) => {
      //     // console.log(res);
      //     // this.setState({
      //     //   shareImage: res.tempFilePath,
      //     // })
      //   }
      // })
      if (posterList.length > 0) {
        this.clickImg(posterList[0], 0)
      }
    });
  }

  updateCanvas = () => {
    const { signatureUrl, image, canvasHeight, canvasWidth } = this.state;
    this.ctx.clearRect(0, 0, canvasWidth * 3, 99999);
    this.ctx.drawImage(image, 0, 0, '100%', '100%', 0, 0, canvasWidth * 3, this.calc(canvasWidth, canvasHeight - 70) * 3)
    this.ctx.drawImage(signatureUrl, 0, 0, '100%', '100%', 0, this.calc(canvasWidth, canvasHeight - 70) * 3, canvasWidth * 3, this.calc(canvasWidth, 70) * 3)
    console.log('timer===111',Date.now()-this.timer)
    this.timer=Date.now()
    this.ctx.draw(true, () => {
      console.log('timer===222',Date.now()-this.timer)
      this.timer=Date.now()
      setTimeout(() => {
      Taro.canvasToTempFilePath({
        fileType: 'jpg',
        canvasId: 'shareCanvas',
        success: async (res) => {
          console.log('timer===333',Date.now()-this.timer)
          this.timer=Date.now()
          const d = await Taro.getImageInfo({
            src: res.tempFilePath
          })
          console.log('timer===444',Date.now()-this.timer)
          this.timer=Date.now()
          // console.log(d);
          this.setState({
            shareImage: res.tempFilePath,
            imageWidth: d.width,
            imageHeight: d.height,
          }, () => {
            // Taro.showModal({
            //   title: '',
            //   content: `
            //   imageWidth=${d.width},
            //   imageHeight=${d.height},
            //   canvasWidth=${canvasWidth},
            //   canvasHeight=${canvasHeight},
            //   `,
            // })
            Taro.hideToast();
          })
        }
      })
    }, 300)
    });
  }
  addImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths;
        const { width, height, ...other } = await Taro.getImageInfo({
          src: tempFilePaths[0]
        })
        const { canvasWidth, posterList } = this.state;
        // posterList.unshift(tempFilePaths[0]);
        // console.log(width, height, canvasWidth, canvasWidth * (height / width) + 70)
        this.setState({
          image: other.path,
          scaleX: width / canvasWidth,
          // posterList,
          own: other.path,
          active: 0,
          canvasHeight: canvasWidth * (height / width) + 70,
        }, () => this.clickImg(other.path, 0))
        // Taro.uploadFile({
        //   url: `${api}/resume/photo/upload`, // 仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   header,
        //   formData: {
        //   },
        //   success: (res) => {
        //     const data = JSON.parse(res.data);
        //     if(data.code !== 0) {
        //       return showModal({
        //         content: data.message
        //       })
        //     }
        //     this.photo = data.data;
        //   }
        // })
      },
    })
  }

  clickImg = async (src, active) => {
    Taro.showToast({title:'加载中', icon: 'loading'});
    const { canvasWidth, imgs } = this.state;
    
      const { width, height, ...other } = await Taro.getImageInfo({ src });
      // console.log('clickImg', width, height, canvasWidth, canvasWidth * (height / width) + 70)
      // console.log(width, height, canvasWidth, canvasWidth * (height / width) + 70)
      imgs.set(src, {width, height, path: other.path})
      this.setState({
        image: other.path,
        scaleX: width / canvasWidth,
        canvasHeight: canvasWidth * (height / width) + 70,
        active,
      }, () => {
        setTimeout(() => this.updateCanvas(), 500);
      })
    // }
  }

  showBigImg = () => {
    const { shareImage } = this.state;
    giveAwardDaysAfterShare()
    Taro.previewImage({
      urls: [shareImage]
    })

  }

  canvasId: any = null;
  canvas: any
  render() {
    const { canvasHeight, shareImage, canvasWidth, screenHeight, posterList = [], active, own, imageWidth, imageHeight } = this.state;
    // console.log('share', canvasWidth, canvasHeight)
    let _width = canvasWidth * 2 ;
    let _height = imageHeight * canvasWidth / imageWidth * 2 ;
    _height = _height || 400;
    // console.log('before', _width, _height, screenHeight);
    if(_height && _height > screenHeight){
      _width = screenHeight * _width / _height;
      _height = screenHeight;
    }
    // console.log('after', _width, _height, screenHeight);
    const list = own ? [own, ...posterList] : posterList;
    return <View className='share-container'>
      <Canvas ref={node => this.canvas = node} canvasId='signature' className='share-big-image-signature'></Canvas>
      <View className='share-big-image' style={{ width: Taro.pxTransform(canvasWidth * 2), minHeight: Taro.pxTransform(screenHeight * 0.55 * 2) }}>
        {shareImage&&<Image mode='aspectFit' onClick={this.showBigImg} className='share-big-image-content' style={{ width: Taro.pxTransform(_width), height: Taro.pxTransform(_height) }} src={shareImage} />}
        {/* <Image mode='aspectFit' onClick={this.showBigImg} className='share-big-image-content' style={{ width: Taro.pxTransform(canvasWidth * 2 * 0.6), height: Taro.pxTransform(imageHeight * canvasWidth / imageWidth * 2 * 0.6) }} src={shareImage} /> */}
        <Canvas style={{ height: Taro.pxTransform(canvasHeight * 2 * 3) }} className='share-big-image-canvas' canvasId='shareCanvas'></Canvas>
      </View>
      <View className='share-text'>
        <Text>点击预览大图，长按保存或发送给好友</Text>
      </View>
      <ScrollView
        className='scroll-view'
        scrollX
        scrollWithAnimation
      >
        <View onClick={this.addImage} className='iconfont scroll-view-item scroll-view-item-add' />
        {
          list.map((item, index) => {
            return <View key={`${index}-key`} onClick={() => {
              this.clickImg(item, index)
            }} className={`iconfont scroll-view-item ${active === index ? 'scroll-view-item-active' : ''}`}><Image mode='aspectFill' src={item} /> </View>
          })
        }
      </ScrollView>
    </View>
  }
}