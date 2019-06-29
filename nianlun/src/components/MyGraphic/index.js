import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

const newProduct = `${Taro.IMG_URL}/newProduct.png`
class MyGraphic extends Component {
 
  static defaultProps = {
    img: 'http://img1.imgtn.bdimg.com/it/u=1878401278,1610402481&fm=26&gp=0.jpg',
    title: '',
    isNew: false
  };
 
  render() {
    const { img, isNew,title } = this.props;
    return (
      <View className='my-graphic'>
        <View className='my-graphic-img'>
          <Image src={img} />
          {
            isNew && <Image className='new' src={newProduct} />
          }
          
        </View>
        <View className='my-graphic-dec' >
          <View className='my-graphic-dec-title'>{title}</View>
          <View className='my-graphic-dec-content'>
           {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}

export default MyGraphic