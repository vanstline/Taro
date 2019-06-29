import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import './index.scss'

@connect( ({system}) => ({
  statusBarHeight: system.statusBarHeight
}) )
class Navbar extends Taro.Component {

  handleBack = (i) => {
    console.log(i, 'i')
    i
    ? Taro.reLaunch({
      url: '/pages/index/index'
    })
    : Taro.navigateBack({})
  }

  render() {
    const { statusBarHeight } = this.props
    const paddingTop = `${statusBarHeight || 0}px`;
    const { isTab, tabText } = this.props;
    const style = {paddingTop}

    return (
      <View className='navbarWrap' style={style}>
        <View className='navbar'>
          {
            isTab
            ? (
              <View className='tab'>{tabText}</View>
            )
            : (
              <View className='normal'>
                <View onClick={this.handleBack.bind(this, false)}>
                  <AtIcon value='chevron-left' size='28' ></AtIcon>
                  {tabText}
                </View>
                <View className='home' onClick={this.handleBack.bind(this, true)}><AtIcon value='home' size='24' ></AtIcon></View>
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

Navbar.defaultProps = {
  isTab: false,
  tabText: ''
}
export default Navbar