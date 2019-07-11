import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import connect from '../../connect/user'
import pageInit from '../pageInit'
import MyGraphic from '../../components/MyGraphic'
import MyAudio from '../../components/MyAudio'
import MyVedio from '../../components/MyVedio'
import WhiteSpace from '../../components/WhiteSpace'
import ToHtml from '../../components/WxParse/index'
import { bookDetail } from '../../services/book'
import Page from '../../layout/Page';
import './index.scss'
@connect
@pageInit()
export default class Test extends Taro.Component {

  constructor() {
    super()
    let typeIndex = this.$router.params.tabIndex ? this.$router.params.tabIndex - 0 : 0
    this.state = {
      typeIndex,
      type: [
        '看视频',
        '听音频',
        '阅读文稿'
      ],
      data: {},
    }
  }

  audioPlayTime = 0
  vedioPlayTime = 0
  audioCurrentTime = 0
  vedioCurrentTime = 0

  config = {
    navigationBarTitleText: ''  
  }

  onShareAppMessage(res) {
    const { data: { bookTitle, imgSharePosters, imgMain }, typeIndex } = this.state
    let obj =  {
      title: bookTitle,
      path: `${this.$router.path}?id=${this.$router.params.id}&tabIndex=${typeIndex}&${res}`,
      imageUrl: imgSharePosters || imgMain,
    }
    return obj
  }

  handleCheckTypeIndex = (e) => {
    const { bookId, bookTitle } = this.state.data
    if(e === 2)  {
      Taro.navigateTo({ url: `/pages/draftList/index?id=${bookId}&title=${bookTitle}` })
    } else {
      this.setState({ typeIndex: e })
    }
  }

  // 获取书籍详情
  async getBookDetail (id) {
    let bookId = id ? id : global.common.bookId
    let res = await bookDetail({bookId})
    this.setState({
      data: res.data.data
    }, () => {
      const { data } = this.state
      Taro.setNavigationBarTitle({ title: data.bookTitle })
    })
  }

  componentDidShow() {
    const id = this.$router.params.id || 1;
    this.getBookDetail(id)
    
  }

  render() {
    const { type, typeIndex, data={} } = this.state;
    const header = {
      id: data.bookId,
      type: 1,
      title: data.bookTitle
    }
    return (
      <View className='details-book'>  
        <View className='media'>
          {header.id&&<View className='media-cont'>
            {
              typeIndex === 0 && <MyVedio header={header} vedioObj={data.bookMediaVideoRespVos?data.bookMediaVideoRespVos[0]:{}} />
            }
            {
              typeIndex === 1 && <MyAudio header={header} audioObj={data.bookMediaAudioRespVos?data.bookMediaAudioRespVos[0]:{}} />
            }
          </View>}
          <View className='media-button'>
            {
              type && type.map( (item, i) => {
                return <View key={i+''}  className={`sub-btn ${typeIndex === i && 'active'}`} onClick={this.handleCheckTypeIndex.bind(this, i)}>{item}</View>
              } )
            }
          </View>
        </View>
        <View className='content'>
          <View className='books'>
            <MyGraphic title={data.bookTitle || ''} img={data.imgMain} isNew>
              <View className="graphic-describe">
                <View className='graphic-content'>{data.commendTitle}</View>
                <View className='graphic-button'>{data.studyNum || 0}人学习</View>
              </View>
            </MyGraphic>
          </View>
          <WhiteSpace />
          <View className='recommend' >
            <ToHtml html={data.bookDesc} />
          </View>
        </View>
        <Button className='share-btn' openType='share'><Text /></Button>
      </View>
    )
  }

}

