import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image ,Icon, Radio} from '@tarojs/components'
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
    navigationBarTitleText: '性别',
    comment: true
  }
  componentDidMount() {
    

  }
  handleInputChange = e => {
    this.setState({value: e.detail.value})
  }

  handleSubmit = async () => {
    const response = await updateUserInfo({
      gender:this.state.value
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
  setValue =(value)=>{
    this.setState({value})
  }
  render() {
    const { userInfo={} } = this.props;
    const {
      value
    } = this.state;
    return <View className='info-update'>
     <View className='input'>
      <View className='radio-gender'>
       <View className='radio-item' onClick={this.setValue.bind(this,1)}>
        <View>男</View>
        {value==1&&<Icon type='success_no_circle' color='#fccf00'/>}
       </View>
       <View className='radio-item' onClick={this.setValue.bind(this,2)}>
        <View>女</View>
        {value==2&&<Icon type='success_no_circle' color='#fccf00'/>}
       </View>
      </View>
      <AtButton onClick={this.handleSubmit.bind(this)} className='btn'>保存</AtButton>
    </View>
     
  </View>
  }

}
export default UpdateUserInfo