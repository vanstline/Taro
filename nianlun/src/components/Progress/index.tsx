import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss'

interface Props {
  currentTime: number,
  durationTime: number,
  onDrag: Function,
  onProgressChange: Function,
}
export default class Rate extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      rect: {},
    }
  }

  componentDidMount() {
    this.getWidth()
  }

  getWidth = () => {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select('#progress').boundingClientRect().exec(res => {
        this.setState({ rect: res[0] })
    })
  }

  handleDotTouchMove = (e) => {
    let nextX = this.getMoveX(e.touches[0].clientX)
    this.props.onDrag(nextX)
  }

  handleTouchEnd = (e) => {
    let nextX = this.getMoveX(e.changedTouches[0].clientX)
    this.props.onProgressChange(nextX)
  }

  getMoveX(clientX) {
    const { durationTime } = this.props
    const { rect } = this.state
    clientX = clientX - rect.left
    if(clientX <= 0) clientX = 0 
    if(clientX >= rect.width ) clientX = rect.width
    let nowX = clientX / rect.width
    let nextX = Math.floor(nowX * durationTime) 
    return nextX
  }

  render() {
    
    const { currentTime, durationTime } = this.props
    let progress = `${currentTime/durationTime * 100}%`
    return (
      <View className='progress-wrap'>
        <View id='progress' onTouchEnd={this.handleTouchEnd} className='progress'>
          <View className='progress-main'>
            <View className='bar' style={{ width: progress }}/>
            <View
              className='dot'
              onTouchMove={this.handleDotTouchMove}
              onTouchEnd={this.handleTouchEnd}
              style={{ left: progress }}><View className='dot-bg' /></View>
          </View>
        </View>
      </View>
    )
  }
}