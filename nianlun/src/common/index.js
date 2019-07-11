import Taro, { ENV_TYPE } from '@tarojs/taro'
import throttle from './throttle'

const host = 'https://static.nianlunxt.top'
// wxfec997b6b04a7544
// wx868265acec5846c7
const common = {
  versions: '1.0.0',
  appid: 'wx868265acec5846c7',
  tabText: [ '自习室', '识践串串', '个人中心'],
  subjects: ['健康课', '文史课', '技能课', '亲子课', '艺术课', '时尚课', '图书管', '全部'],
  throttle,
  voice64: '',
  bookId: 51,
  bookCourseId: 1,
  host,
  img_url: host + '/assets',
  imgMedia: '',
};

global.common = {
  ...common
};

Taro.common = common
global.IMG_URL = common.img_url
Taro.IMG_URL = common.img_url

export default common;
