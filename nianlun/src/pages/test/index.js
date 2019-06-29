import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtButton, AtList, AtListItem } from 'taro-ui'
import NavBar from '../../components/Navbar/index'


export default class Test extends Taro.Component {

  constructor() {
    super()
    this.state = {
      system: {},
    }
  }

  config = {
    navigationBarTitleText: '测试'  
  }
  

  handleClick = () => {
    Taro.navigateTo({
      url: '/pages/mine/index'
    })
      .then(res  => console.log(res, 'res'))
      .catch(err => console.log(err, 'err'))
  }

  handleBack = () => {
    Taro.navigateBack({ delta: 2 })
  }

  handleGetLocation = () => {
    Taro.getLocation({})
      .then(res  => console.log(res, 'res'))
      .catch(err => console.log(err, 'err'))

  }

  authorize = () => {

    // Taro.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.record']) {
    //       Taro.authorize({
    //         scope: 'scope.record',
    //         success() {
    //           // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
    //           Taro.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })
    Taro.authorize({
      scope: 'scope.userInfo'
    })
      .then(res  => console.log(res, 'res'))
      .catch(err => console.log(err, 'err'))
  }
  
  handleCreateCammeaContext = () => {
    Taro.chooseImage({})
  }

  handleGetSystemInfo = () => {
    Taro.getSystemInfo({})
      .then(res  => {
        console.log(res)
        this.setState({ system: res })
      })
      .catch(err => console.log(err, 'err'))
  }

  render() {

    const { system } = this.state;
    let keys = Object.keys(system);
    let arr = [];
    arr = keys.map( item => ({
      title: item,
      content: system[item]
    }) )

    return (
      <View>
        {/* <NavBar tabText={'测试'}/> */}
        <View onClick={this.handleClick}><Text> Test </Text></View>
        <AtButton onClick={this.handleBack}>返回</AtButton>
        <AtButton onClick={this.handleGetLocation}>获取位置</AtButton>
        <AtButton onClick={this.authorize}>授权</AtButton>
        <Button open-type="getUserInfo">按钮授权</Button>
        <AtButton onClick={this.handleCreateCammeaContext}>相机</AtButton>
        <AtButton onClick={this.handleGetSystemInfo}>查看设备信息</AtButton>

        <AtList>
          {
            arr.map( item => {
              return <AtListItem key={item.title} title={item.title} extraText={item.content} />
            } )
          }
          {/* <AtListItem title='标题文字' onClick={this.handleClick} />
          <AtListItem title='标题文字' arrow='right' />
          
          <AtListItem title='禁用状态' disabled extraText='详细信息' /> */}
        </AtList>
      </View>
    );
  }
}
