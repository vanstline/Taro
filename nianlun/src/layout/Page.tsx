import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Player from '../components/Player';
import './Page.scss';
import classnames from 'classnames';
type PageProps = {
  full?: boolean;
  className?: string;
}
export default class Page extends Component<PageProps,  any> {
  static defaultProps = {
    full: false,
  }
  static options = {
    addGlobalClass: true,
    hasLoad: true,
    isPlayOpen: false,
  }
  componentDidShow() {
    this.setState({hasLoad:false},()=>this.setState({hasLoad:true}))
  }
  wrapperClassnames() {
    return classnames('container', {
      'container-full': this.props.full
    })
  }
  handlePlayerChange =(isPlay)=>{
    this.setState({isPlayOpen:isPlay})
  }
  render() {
    const {
      className,
    } = this.props;
    const {
      hasLoad,
      isPlayOpen
    } = this.state;
    const classNamesObject = {
      'container-full': this.props.full
    } 
    return (
      <View className={classnames('container',classNamesObject, className)} style={{paddingBottom:isPlayOpen?'95px':'0px'}}>
        {this.props.children}
        {hasLoad&& <Player onChange={this.handlePlayerChange}/>}
      </View>
    )
  }
}