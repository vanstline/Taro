import Taro, { Component } from '@tarojs/taro'
import { View , Image } from '@tarojs/components'
import PropTypes from 'prop-types';

// import './index.scss'

export default class MyPicture extends Component {

  static propTypes = {
    title: PropTypes.array,
  };

  static defaultProps = {
    img: []
  }


  handlePreviewImage = (i) => {
    const { img }  = this.props
    let urls = img.map( item => item.src )
    // console.log(urls)
    Taro.previewImage({
      urls,
      current: i ? urls[i] : urls[0]
    })
  }


  render() {
    const { img } = this.props
    let leng = img.length || 0

    const oneImgStyle = {
      width: '100%',
      height: '172px'
    }
    const moreImgStyle = {
      width: '100px',
      height: '100px',
      marginRight: '10px'
    }


    // console.log(img, 'img')
    // console.log(leng, 'leng')
    return (
      <View>
        {
          leng && leng > 1 ? (
            <View>
              {
                img.map((item, i) => <Image onClick={this.handlePreviewImage.bind(this, i)} style={moreImgStyle} mode='center' src={item.src} /> )
              }
            </View>
          ) : <Image onClick={this.handlePreviewImage} style={oneImgStyle} mode='aspectFit' src={img[0].src}/>
        }
      </View>
    )
  }
}