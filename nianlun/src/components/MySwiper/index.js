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
    const { onCallback } = this.props
    if(onCallback && typeof onCallback === 'function') onCallback(current)
  }
  // 类型1、书籍2、书单3、课程4、外部链接,5.有赞商城链接，6.内部链接
   handleToDetail (type=1,id,chapterId) {
    let flag = isNaN(chapterId)
    if(type===1){
      Taro.navigateTo({
        url: `/pages/detailsBook/index?id=${id}`
      })
    }else if(type===3){
      let url = `/pages/${!flag && chapterId ? 'study' : 'detailsCourse'}/index?id=${id}&chapterId=${chapterId}`
      Taro.navigateTo({
        url
      })
    }else if(type===4){
      Taro.navigateTo({
        url:`/pages/h5Static/index?url=${id}`
      })
    }else if(type===6){
      Taro.navigateTo({
        url:id
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
        style={{ height: this.props.height }}
      >
        { bannerList.map((item, i) => (
          <SwiperItem onClick={this.handleToDetail.bind(this,item.type,item.linkUrl)} id={item.id || i} key={item.id || i}>
            <Image style={this.props.style} className="swiper-img" mode="widthFix" src={item.mediaPath}></Image>
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}