import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"
import WxParse from './wxParse'
import "./wxParse.wxss"

export default class ToHtml extends Component {
  
  defaultProps = {
    html: ''
  }

  render() {
    if (this.props.html) {
      let domText = this.props.html
      WxParse.wxParse("domText", "html", domText, this.$scope, 5);
  }
  return (
    <View>
        {process.env.TARO_ENV === "weapp" ? (
            <View>
              <import src='./wxParse.wxml' />
              <template is='wxParse' data='{{wxParseData:domText.nodes}}'/>
            </View>
        ) : (
            <View>只在小程序里支持</View>
        )}
    </View>
  );
  }
}