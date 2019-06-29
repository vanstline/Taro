import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider, connect } from '@tarojs/redux'
// import 'taro-ui/dist/style/index.scss'
import Index from './pages/index'
import { GetStartBarHeight, Is_ipone_X, Is_IOS } from './store/actions/system'
import configStore from './store'
import './common'

import './styles/custom-variables.scss'
import './app.scss'
import './styles/app.scss'
import './styles/icon.scss'


console.log(global, '---------app')
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

@connect(  () => ({}), (dispatch) => ({
  getStartBarHeight() { dispatch(GetStartBarHeight()) },
  is_ipone_X() { dispatch(Is_ipone_X()) },
  is_IOS() { dispatch(Is_IOS()) }
}) )
class App extends Component {

  config = {
    pages: [
      // 'pages/production/index',
      
      // 'pages/ambassador/index',
      'pages/login/index',
      'pages/school/index',
      'pages/index/index',
      'pages/mine/index',
      'pages/mine/share',
      'pages/detailsBook/index',
      'pages/detailsCourse/index',
      'pages/test/index',
      'pages/list/index',
      'pages/study/index',
      'pages/production/index',
      'pages/message/index',
      'pages/award/index',
      'pages/force/index',
      'pages/livehand/index',
      'pages/livehand/addwechat',
      'pages/draftList/index',
      'pages/vip/index',
      'pages/activity/index',
      'pages/activity/detail',
      'pages/upgrade/index',
      'pages/credit/index',
      'pages/bindPhone/index',
      'pages/activation/index',
      'pages/activation/password',
      'pages/buy/index',
      'pages/ambassador/index',
      'pages/order/index',
      'pages/userInfo/index',
      'pages/userInfo/update',
      'pages/userInfo/updateGender',
      'pages/sweep/index',
      
      

      
    ],
    component: true,
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: 'white',
      navigationBarTitleText: '自习室',
      navigationBarTextStyle: 'black',
      // navigationStyle: 'custom',
    },
    requiredBackgroundModes: ['audio'],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    },
    tabBar: {
      selectedColor: "#FCCF00",
      list: [
        {
          pagePath: "pages/school/index",
          iconPath: "./assets/school.png",
          selectedIconPath: "./assets/schoolActive.png",
          text: "学堂"
        },
        {
          pagePath: "pages/index/index",
          // iconPath: <AtIcon value='clock' size='30' color='#F00'></AtIcon>,
          iconPath: "./assets/index.png",
          selectedIconPath: "./assets/indexActive.png",
          text: "自习室" 
        },
        
        {
          pagePath: "pages/mine/index",
          iconPath: "./assets/mine.png",
          selectedIconPath: "./assets/mineActive.png",
          text: "我的"
        }
      ] 
    }
  }

  componentWillMount() {
    // console.log(this.$router, '----------router')
    const scene = this.$router.params.scene
    if(scene && scene != 1001) {
      Taro.__nianlun_scene = this.$router.params
    }
  }

  componentDidMount () {
    Taro.$store = store;
    // this.props.getStartBarHeight()
    let _this = this
    Taro.getSystemInfo({
      success(res) {
        console.log(res, '--------是苹果手机')
        if(res.system.indexOf('iOS') !== -1 ) {
          _this.props.is_IOS()
        }
        if(res.model.indexOf('iPhone X') !== -1) {
          _this.props.is_ipone_X()
        }
      }
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
