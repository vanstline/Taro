/**
 * 轮播图组件
 */
import Taro, { Component } from '@tarojs/taro';
import { Swiper, SwiperItem, Image } from '@tarojs/components';
// import { connect } from '@tarojs/redux'
import PropTypes from 'prop-types';
import './index.scss';
 
// @connect( ({banner}) => ({
//   bannerList: banner.bannerList || []
// }) )
export default class MySwiper extends Component {
  static propTypes = {
    bannerList: PropTypes.array,
  };
 
  static defaultProps = {
    bannerList: []
  };

  handleChange = (e) => {
    let { current } = e.detail
    this.props.onCallback(current)
  }
  // 详情页 1书 2课
  handleToDetail (type=1,id,chapterId) {
    if(type===1){
      Taro.navigateTo({
        url: `/pages/detailsBook/index?id=${id}`
      })
    }else if(type===2){
      Taro.navigateTo({
        url: `/pages/detailsCourse/index?id=${id}&chapterId=${chapterId}`
      })
    }
    
  }
  render() {
    const { bannerList, autoplay } = this.props;
    return (
      <Swiper
        className="swiper-container"
        circular
        indicatorDots
        indicatorColor='rgba(0,0,0,0.3)'
        indicatorActiveColor='#fff'
        autoplay={autoplay}
        onChange={this.handleChange}
      >
        { bannerList.map((item, i) => (
          <SwiperItem onClick={this.handleToDetail.bind(this,item.type,item.id)} id={item.id || i} key={item.id || i}>
            <Image className="swiper-img" mode="widthFix" src={item.mediaPath}></Image>
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}