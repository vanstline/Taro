import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtButton, AtList, AtListItem } from 'taro-ui'
import { updateUserInfo } from '../../services/user'
import { checkPhone, showToast } from '@utils/utils'
import './index.scss'


class UpdateUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.$router.params.value,
    }
  }
  config = {
    navigationBarTitleText: '昵称',
    comment: true
  }
  componentDidMount() {
    

  }
  handleInputChange = e => {
    this.setState({value: e.detail.value})
  }

  handleSubmit = async () => {
    const response = await updateUserInfo({
      nickname:this.state.value
    })
    if (response.data.returnCode === 0) {
    
      Taro.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 3000
      }).then(res => Taro.navigateTo({
        url: `/pages/userInfo/index`
      }))
    }
  }
  render() {
    const { userInfo={} } = this.props;
    return <View className='info-update'>
     <View className='input'>
          <Input value={this.state.value} onInput={this.handleInputChange} type='input' />
          <AtButton onClick={this.handleSubmit.bind(this)} className='btn'>保存</AtButton>
        </View>
     
  </View>
  }

}
export default UpdateUserInfo