import Taro from '@tarojs/taro';
import { View, Image} from '@tarojs/components';
import './index.scss'
const rogerPng = `${Taro.IMG_URL}/roger.png`
const upgradePng = `${Taro.IMG_URL}/upgrade.png`
export default class Upgrade extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      showupgrade:false,
    }
  }
  config = {
    navigationBarTitleText: '',
    comment: true
  } 
  componentDidMount() {
    
    // this.getActivityDetail()
  }
  
  handleToBack = () =>{
    Taro.navigateTo({ url: `/pages/activity/index` })
  }

  
  

  render() {
    const { _isOpened=true } = this.state
    const { text, hasMask=true, type } = this.props



    return _isOpened ? (
      <View className='z-upgrade'>
        {hasMask && <View className='z-upgrade-overlay' />}
        <View className='z-upgrade-body' onClick={this.handleClick}>
          <View className="z-upgrade-info">
            <Image src={upgradePng} className="upgrade-icon" />
            <View className="z-upgrade-text">
              <View className="title">学童</View>
              <View className="level">等级：7星</View>
            </View>
          </View>
          <View className="z-upgrade-hint">恭喜你，升级至七星学童</View>
          <Image src={rogerPng} className="roger-icon" onClick={this.handleToBack.bind(this)} />
        </View>
      </View>
    ) : null
  }
}