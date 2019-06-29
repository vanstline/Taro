import Taro, { Component } from '@tarojs/taro'
import MySwiper from '@app/MySwiper'
const banner1 = `${Taro.IMG_URL}/banner1.jpg`
const banner2 = `${Taro.IMG_URL}/banner2.jpg`
const banner3 = `${Taro.IMG_URL}/banner3.jpg`
const banner4 = `${Taro.IMG_URL}/banner4.jpg`


class Banner extends Component {

  render() {
    const banner = [
      {
        image_src: banner1
      },
      {
        image_src: banner2
      },
      {
        image_src: banner3
      },
      {
        image_src: banner4
      },
    ]
    return (
      <MySwiper banner={banner} />
    )
  }
}

export default Banner