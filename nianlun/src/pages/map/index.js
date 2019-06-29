import Taro, { Component } from '@tarojs/taro'
// 引入 map 组件
import { Map } from '@tarojs/components'

class App extends Component {
    config = {
        navigationBarTitleText: '导航',
        comment: true
    }
    componentDidMount() {
    
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
             var latitude = res.latitude
             var longitude = res.longitude
             wx.openLocation({
              latitude: latitude,
              longitude: longitude,
              name:"花园桥肯德基",
              scale: 28
             })
            }
        })
    }
    
    onTap () {}
    render () {
        return (
        <Map onClick={this.onTap} polyline={true} style={{width:'100%',height:'100vh'}} />
        )
    }
}