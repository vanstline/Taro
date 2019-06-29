import Taro, { ENV_TYPE } from '@tarojs/taro'
import throttle from './throttle'

const common = {
  appid: 'wx868265acec5846c7',
  tabText: [ '自习室', '年轮学堂', '个人中心'],
  subjects: ['健康课', '文史课', '技能课', '亲子课', '艺术课', '时尚课', '图书管', '全部'],
  throttle,
  voice64: '',
  bookId: 51,
  bookCourseId: 1,
  img_url: 'https://nianlun-static.oss-cn-hangzhou.aliyuncs.com/assets',
  imgMedia: '',
  imgSharePosters: 'http://pic.rmb.bdstatic.com/b3b71ca81cf9ec35fdea6ce2974ef522.jpeg'
};

global.common = {
  ...common
};

Taro.common = common
global.IMG_URL = common.img_url
Taro.IMG_URL = common.img_url

export default common;

// wx868265acec5846c7