import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTag, AtCurtain, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import Page from '../../layout/Page';
import pageInit from '../pageInit'
// import NavBar from '../../components/Navbar/index'
import MyCard from '../../components/MyCard'
import MyGraphic from '../../components/MyGraphic'
import WhiteSpace from '../../components/WhiteSpace'
import MySwiper from '../../components/MySwiper'
import GetPhoneBtn from '../../components/GetPhoneBtn'
import Player from '../../components/Player'
import { GetBanner } from '../../store/actions/banner'
import { FetchGetUserInfo, SetUserMobile } from '../../store/actions/user'
import { add_date, showToast } from '@utils/utils'
import { queryAdvertising, 
  queryContentDailyList,
  queryBookCommendPageList,
  queryCourseQualityPageList,
  queryBookCourseAllList, queryBookCourseList, queryCategoryList, queryContentCategoryList, queryNewBookCourseList } from '../../services/school'
  import { getUserInfo } from '../../services/user';
import { bindMobile } from '../../services/mine'
  import './index.scss'
  
const probationBg = `${Taro.IMG_URL}/probation-bg.png`
const background = `${Taro.IMG_URL}/class-sub.png`
const playIcon = `${Taro.IMG_URL}/play.png`

// const { tabText, subjects } = global.common

let mapState = ({banner={}, user}) => ({
  bannerList: banner.bannerList,
  mobile: user.mobile ? true : false,
  handleMobile: user.handleMobile
})
let mapActions = (dispatch) => ({
  getBanner(data) { dispatch(GetBanner(data)) },
  fetchGetUserInfo(data) { dispatch(FetchGetUserInfo(data)) },
  setUserMobile(data) { dispatch(SetUserMobile(data)) }
})

@connect(mapState, mapActions)
@pageInit()
class School extends Component {

  constructor() {
    super()
    this.state = {
      subjects: [],
      newLists: [],
      banner: [],
      bookCommend:[],
      courseQuality:[],
      contentDaily:[],
      pageIndex:1, //
      isOpen:false,
      hasLoad:false,
      isPlayOpen:false,
    }
  }
  config = {
    navigationBarTitleText: '年轮学堂',
    comment: true
  }  

  // 授权手机号
  savePhone() {
    showToast('领取成功')
    this.props.getBanner({bizCode: 'index'})
    this.props.fetchGetUserInfo()
    this.fetchPages()
    this.fetchBanner()
    this.queryBookCommendPageList();
    setTimeout(()=> {
      Taro.switchTab({url: '/pages/mine/index'})
    }, 1000)
  }

  onCloseModal = () => {
    this.props.setUserMobile(true)
  }

  componentDidMount() {
    this.getSevenDays()
  }

  // 查询七天
  async getSevenDays() {
    let res = await getUserInfo()
    try {
      if(res.data.returnCode === 0) {
        if(!res.data.data.mobile) {
          this.props.setUserMobile(false)
        }
      }
    } catch (error) {}
  }

  componentDidShow() {
    console.log(this.$router)
    this.setState({hasLoad:false})
    this.props.getBanner({bizCode: 'index'})
    this.props.fetchGetUserInfo()
    this.fetchPages()
    this.fetchBanner()
    this.queryBookCommendPageList();
  }
  componentWillUnmount(){
    
  }
  // // 获取课程列表
  // async fetchContentCategoryList () {
  //   let res = await queryContentCategoryList()
  //   this.setState({ subjects: [...res.data.data] })
  // }
  
  // 获取banner
  async fetchBanner() {
    let res = await queryAdvertising({bizCode: 'index'})
    this.setState({ banner: res.data.data || [] })
  }

  // 获取页面数据
  async fetchPages() {
    Promise.all([
      queryContentCategoryList(),
      queryNewBookCourseList(),
      // queryBookCommendPageList({pageSize:3}),
      queryCourseQualityPageList(),
      queryContentDailyList()
    ])
      .then( resArr => {
        
        this.setState({
          subjects: resArr[0].data.data || [],
          newLists: resArr[1].data.data || [],
          // bookCommend: resArr[2].data.data.list || [],
          courseQuality: resArr[2].data.data.list || [],
          contentDaily: resArr[3].data.data || [],
          hasLoad:true
        })
      } )
  }

  // 获取好书推荐
  async queryBookCommendPageList(pageIndex=1) {
   
    let res = await queryBookCommendPageList({pageSize: 3,pageIndex})
    const {
      list=[],
      total=0,
      pages=1
    }=res.data.data||{}
    this.setState({ bookCommendData:res.data.data,bookCommend: list,bookCommendTotal:total,pageIndex:++pageIndex })
  }
  handleBooks = () => {
    Taro.navigateTo({
      url: '/pages/media/index'
    })
  }
  // 列表页
  handleToList (i) {
    console.log(i)
    Taro.navigateTo({
      url: `/pages/list/index?type=${i.type}&title=${i.name}&id=${i.id}&code=${i.code||''}`
    })
  }
  // 详情页 1书 2课
  handleToDetail (type=1,id,chapterId) {
    let flag = isNaN(chapterId)
    if(type===1){
      Taro.navigateTo({
        url: `/pages/detailsBook/index?id=${id}`
      })
    }else{
      let url = `/pages/${!flag && chapterId ? 'study' : 'detailsCourse'}/index?id=${id}&chapterId=${chapterId}`
      Taro.navigateTo({
        // url: `/pages/detailsCourse/index?id=${id}&chapterId=${chapterId}`
        // url: `/pages/study/index?id=${id}&chapterId=${chapterId}`
        url
      })
    }
    
  }
  handleToPlay (item) {
    // this.player.handlePlayer()
    // this.setState({
    //   isOpen:true
    // })
    this.handleToDetail(item.type,item.fkId||item.id, item.chapterId || 0)
  }
  
  // pages/subject/index
  handleChangeBook =()=>{
    const {
      pageIndex
    } = this.state;
    this.queryBookCommendPageList(pageIndex)
  }
  // handlePlayerChange =(isPlay)=>{
  //   this.setState({isPlayOpen:isPlay})
  // }
  render() { 

    

    const { subjects, newLists, banner,
      bookCommend,
      bookCommendData,
      pageIndex,
      courseQuality,contentDaily,
      hasLoad,
      isPlayOpen,
      isOpen } = this.state
    console.log('hasLoad',hasLoad)
    return (
      <Page full className='school'>  
     
        {/* <NavBar isTab tabText={tabText[1]}/> */}
        <View className='header'>
          <View className='banner'><MySwiper bannerList={banner} /></View>
          <View className='class-subject'>
            {
              subjects && subjects.map( (item) => {
                return (
                  <View key={item.id} 
                    className='subject-items' 
                    style={{ backgroundImage: `url(${item.banner||background})` }}
                    onClick={this.handleToList.bind(this,item)}
                  >{item.name}</View>
                )
              } )
            }
          </View>
        </View>
        <View className='content' style={{paddingBottom:isPlayOpen?'95px':'0px'}} >
          <MyCard title='每日新知小餐'>
            <View className='xiaocan'>
              {
                contentDaily.map( (item, i) => {
                  // TODO:
                  const medias = item.medias?(item.medias).split(','):[]
                  return (<View className='xiaocan-items' key={i+''} onClick={this.handleToPlay.bind(this,item)} > 
                    
                  <View className="xiaocan-left">
                  {
                    medias.map((media,index)=>(<AtTag key={index+''}>{media}</AtTag>))
                  }
                  <View className="xiaocan-title">{item.title}</View>
                  </View>
                  <Image src={playIcon}/>
                </View>)
                } )
              }
            </View>
          </MyCard>
          <WhiteSpace />
          <MyCard title='最新上新'>
            <View className='news'>
              <View className='main' onClick={this.handleToDetail.bind(this,2,newLists[0].bookCourseId, newLists[0].bookCourseChapterId)}>
                <Image src={newLists[0].imgMain || ''} />
                <View className="text text-first">
                  <View className='title'>{newLists[0].chapterName || ''}</View>
                  <View className='describe'>{newLists[0].title || ''}</View>
                </View>
              </View>
              <View className='side'>
                <View className="item" onClick={this.handleToDetail.bind(this,2,newLists[1].bookCourseId, newLists[1].bookCourseChapterId)}>
                  <Image src={newLists[1].imgMain || ''} />
                  <View className="text">
                    <View className='title'>{newLists[1].chapterName || ''}</View>
                    <View className='describe'>{newLists[1].title || ''}</View>
                  </View>
                </View>
                
                <View className="item" onClick={this.handleToDetail.bind(this,2,newLists[2].bookCourseId, newLists[2].bookCourseChapterId)}>
                  <Image src={newLists[2].imgMain || ''} />
                  <View className="text">
                    <View className='title'>{newLists[2].chapterName || ''}</View>
                    <View className='describe'>{newLists[2].title || ''}</View>
                  </View>
                </View>
              </View>
            </View>
          </MyCard>
          <WhiteSpace />
          <MyCard title='精选课程'>
            <View style={{ height: '24px' }} />
            {
              courseQuality.map((item,i)=>(<View className='books' style={{ paddingBottom: '24px' }} key={i+''} onClick={this.handleToDetail.bind(this,2,item.bookCourseId)} ><MyGraphic isNew={item.latest?true:false} img={item.imgMain} title={item.title}>
              <View className="graphic-describe">
                <View className='graphic-content'>{item.commendDesc}</View>
                <View className='graphic-button'>
                  <Text>更新至{item.updatedChapters}期</Text>
                  <Text style={{ paddingLeft: '16px' }}>{item.studyNum}人学习</Text>
                </View>
              </View>
            </MyGraphic></View>))
            }
          </MyCard>
          <WhiteSpace />
          <MyCard title='好书推荐' extra="查看更多" extraClick={this.handleToList.bind(this,{type:1,name:'图书馆',id:33,code:'LIBRARY'})}>
            <View style={{ height: '24px' }} />
            <View className='books' >
            {
              bookCommend.map((item,i)=>(<View key={i+''} onClick={this.handleToDetail.bind(this,1,item.bookId)} style={{ paddingBottom: '24px' }}><MyGraphic img={item.imgMain} title={item.bookTitle} >
              <View className="graphic-describe">
                <View className='graphic-content'>{item.commendTitle}</View>
                <View className='graphic-button'>{item.studyNum}人学习</View>
              </View>
            </MyGraphic></View>))
            }
            
              </View>
            
            {bookCommendData.pages>=pageIndex&&<View className='btn'><View onClick={this.handleChangeBook.bind(this)} className='sub-btn'>换一换</View></View>}
          </MyCard>
          
        </View>
        <AtCurtain 
          isOpened={!this.props.mobile && !this.props.handleMobile}
          onClose={this.onCloseModal.bind(this, true) }
        >
          <View className='probation' style={{ backgroundImage: `url(${probationBg})` }}>
              <View className=''>恭喜你</View>
              <View className=''>获得7天试用会员奖励</View>
              <View className='time-limit'>有效期：{add_date(7, '.')}</View>
              <GetPhoneBtn title="去领取" onBtn={this.savePhone.bind(this)}  />
          </View>
        </AtCurtain>
        
      </Page>       
    )  
  }
}
export default School;

