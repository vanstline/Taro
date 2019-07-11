import Taro from '@tarojs/taro';
import { View, Image} from '@tarojs/components';
import connectUser from '../../connect/user'
import './index.scss'
const logoPng = `${Taro.IMG_URL}/title-v1.png`
const ambassadorBg =`${Taro.IMG_URL}/ambassador-bg.png`
const ambassadorScroll =`${Taro.IMG_URL}/ambassador-scroll.png`
const ambassadorBtn =`${Taro.IMG_URL}/ambassador-btn.png`
import { toBePromoter } from '../../services/mine'
@connectUser
export default class Ambassador extends Taro.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      userInfo:{},
      showupgrade:false,
    }
  }
  config = {
    navigationBarTitleText: '年轮大使',
    comment: false
  } 
  componentDidMount() {
    
    // this.getActivityDetail()
  }
  
  gitInfo = async () => {
    const response = await api.post(`${Host}/personalcenter/getPersonalCenterBaseInfo`)
    if (response.data.returnCode === 0) {
      this.setState({
        userInfo: response.data.data,
      })
    }
  }

  handleToHome =()=>{
    Taro.switchTab({ url: `/pages/school/index` })
  }
  async handleBePromoter(){
    
    let res = await toBePromoter({})
    if(res.data.data){
   
      this.setState({
        showToast:true,
        toastStatus:'success',
        toastText:'成功'
      },()=>this.handleToHome())
    }
  }
  

  render() {

    const { 
      toastStatus,
      toastText,
      showToast
    } = this.state
    const { user={} } = this.props;
    const {
      distributorName
    } =user
    return <View className='z-ambassador' style={{background:`url(${ambassadorBg})`,backgroundSize:'cover'}}>
      <View className="logo">
        <Image src={logoPng}/>
      </View>
      <View className="scroll" style={{background:`url(${ambassadorScroll})`,backgroundSize:'cover'}}>
        <View className="title">{distributorName}</View>
        <View className="describe">邀请您成为</View>
        <View className="title">年轮大使</View>
      </View>
      <View className="btn">
        <Image src={ambassadorBtn} onClick={this.handleBePromoter.bind(this)}/>
        <View className="cancel" onClick={this.handleToHome.bind(this)} >我再想想</View>
      </View>
      <AtToast status={toastStatus} text={toastText} hasMask={true} isOpened={showToast}/>

    </View>

  }
}