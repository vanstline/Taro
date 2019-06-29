import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import PropTypes from 'prop-types';
import './index.scss';
 
export default class MyCard extends Component {

  static propTypes = {
    title: PropTypes.string,
  };
 
  static defaultProps = {
    title: '',
    extra: '',
  };
  extraClick(e) {
    typeof this.props.extraClick === 'function' && this.props.extraClick(e);
  }
  render() {
    const { title, extra, renderTitle,extraClick } = this.props;
    return (
      <View className='my-card'>
        <View className='my-card-head'>
          <View className='title'>
            { renderTitle ? renderTitle : title }
          </View>
          {
            extra && <View className='extra' onClick={this.extraClick} >{extra}<AtIcon color="#999" value='chevron-right'/></View>
          }
          {
            renderExtra && renderExtra
          }
          
        </View>
        <View className='content'>
          { this.props.children }
        </View>
      </View>
    )
  }
}