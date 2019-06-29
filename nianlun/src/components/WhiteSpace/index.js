import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import './index.scss'

export default class WhiteSpace extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
  };

  static defaultProps = {
    size: 'sm'
  };

  render() {
    const { size } = this.props;
    return(
      <View className={`space ${size}`} />
    )
  }
}