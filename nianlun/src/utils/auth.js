import Taro from '@tarojs/taro'
import { insertToken , changeAppOnLaunch } from '../store/actions/app'
import { Host } from '../services/config'

//获取数据
export default class Auth {
//app授权
  static appCheckAuth(){
    return new Promise(function (resolve) {
      const state = Taro.$store.getState();
      //如果有授权信息
      if( Auth.checkAuth() && !state.app.appOnLaunch ){
        //直接返回
        resolve(true);
      } else {
        //判断session_key是否过期
        Taro.checkSession().then(async ()=>{
          //未过期检查token是否有效
          if( !Auth.checkAuth() ){
            //判断是否 token 请求成功
            let flag = await getAuthToken();
            if( flag ) {
              //更新app状态
              Taro.$store.dispatch(changeAppOnLaunch());
              resolve(true);
            } else {
              Auth.checkFail()
            }
          } else {
            //更新app状态
            Taro.$store.dispatch(changeAppOnLaunch());
            //token 没有过期，直接返回
            resolve(true);
          }
        }).catch(async (err)=> {
          let flag = await getAuthToken();
          //判断是否 token 请求成功
          if( flag ) {
            //更新app状态
            Taro.$store.dispatch(changeAppOnLaunch());
            resolve(true);
          } else {
            Auth.checkFail()
          }
        })
      }
    })
  }

  static checkFail() {
    // Taro.navigateTo({ url: '/pages/login/index' })
    Taro.showToast({
      title : '获取授权信息失败' ,
      icon : 'none' ,
      mask : true
    })
  }
    
  // 检查令牌是否有效 true--> 有效  false--> 无效
  static checkAuth(){
    const state = Taro.$store.getState();
    //从缓存读取授权信息
    let authorize = state.authorize || Taro.getStorageSync('authorize') || {},
      expiryTime = 0,
      nowTime = ~~(Date.now() / 1000);
    if (authorize.exp) {
      expiryTime = authorize.exp;
    }
    return expiryTime - nowTime > 20;
  }

  //获取token
  static getToken(){
    const state = Taro.$store.getState();
    let authorize = state.authorize || Taro.getStorageSync('authorize');
    return authorize.token;
  }
}

//授权用户 token
export async function getAuthToken(){
  // login
  const __nianlun_scene = Taro.__nianlun_scene
  let res = await Taro.login();
  let appid = global.common.appid
  let data = {
    appid,
    js_code: res.code,
    client_id: 'admin',
    client_secret: 'admin',
  }
  if(__nianlun_scene) {
    data._uid = __nianlun_scene.uid || ''
    data._did = __nianlun_scene.did || ''
  }
  const option = {
    url: `${Host}/oauth/wechat/miniprogram` ,
    data,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
  }
  let response = await Taro.request(option)
  //判断是否成功
  if( response.data && response.data.access_token ){
    const { access_token, refresh_token, key, token_type, code2Session  } = response.data
    //写入token
    let authorize = {
      token: access_token,
      exp: ~~(Date.now() / 1000) + 7000
    };
    saveAuthToken(authorize, refresh_token, key, token_type, code2Session);
    return true;
  } else {
    console.log('获取token失败');
    return false;
  }
}

//写入信息
function saveAuthToken (authorize, refresh_token, key, token_type, code2Session) {
  //写入状态管理
  Taro.$store.dispatch(insertToken(authorize));
  //写入缓存
  Taro.setStorageSync('authorize', authorize)
  Taro.setStorageSync('refresh_token', refresh_token)
  Taro.setStorageSync('token_type', token_type)
  Taro.setStorageSync('key', key)
  Taro.setStorageSync('code2Session', code2Session)
}


// {
//   "access_token": "e9YFN45aLxLGBkbYEt92znj/Pb2WEp6C2yB4KG+gk0icMX7zWYPNb1F5q+cM6DusVtFWrdPG3Z0rY/urWwD31Gr11FUpijGaoTiPDXU1XHiwtbL6+Jyy9I84WstwLDnj",
//   "token_type": "bearer",
//   "refresh_token": "+g6dBCJ63gUGRc3zGjJ02IJ54j38KCvArBowJ4t9bHUPo2KmnZpgFF8ZQhr+W731XUf9e92fuf+kewg1ntMZRw==",
//   "expires_in": 604775,
//   "scope": "read write",
//   "key": "2EBB9EE84A5245EE876DF821AAA71D18",
//   "code2Session": {
//       "openid": "oDE0J0ZIBs0-9gZeIS36g4et7vH4",
//       "session_key": "siPYA7EGt2Hv82ZObD8Suw==",
//       "expires_in": 7200
//   }
// }