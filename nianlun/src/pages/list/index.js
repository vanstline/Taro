import Taro from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import MyGraphic from '../../components/MyGraphic'
import MyCard from '../../components/MyCard'
import WhiteSpace from '../../components/WhiteSpace'
import Footer from '../../components/Footer'
import MySwiper from '../../components/MySwiper'
import Page from '../../layout/Page';


import { queryAdvertising, queryBookCourseList, queryCategoryList,queryBookCommendPageList } from '../../services/school'



import './index.scss'

const banner1 = `${Taro.IMG_URL}/banner1.jpg`
const banner2 = `${Taro.IMG_URL}/banner2.jpg`
const banner3 = `${Taro.IMG_URL}/banner3.jpg`
const banner4 = `${Taro.IMG_URL}/banner4.jpg`
const bannerArr = [ banner1, banner2, banner3, banner4 ]
const defaultData = { list: [] }
export default class Book extends Taro.Component {

  constructor() {
    super()
    this.state = {
      pageIndex: 0,
      lastPage: 1,
      pageSize: 10,
      list: [],
      noMore: false,
      advertise:'',
      isReload:false, // 是否加载过列表数据
    }
  }

  componentDidMount() {
    const { type, title, id,code} = this.$router.params;
    let bizCode = type == 1 ? 'book' : 'cours'
    Taro.setNavigationBarTitle({ title })
    this.getList(1, 20)
  }

  getList = async (pageIndex, pageSize) => {
    const { type, title, id,code} = this.$router.params;
    let response = {}
    if(type==2){
      response = await queryBookCourseList({type,contentCategoryId:id,code:code||'',pageIndex, pageSize})
    }else{
      response = await queryCategoryList({ type, contentCategoryId:id,code:code||'',pageIndex, pageSize })
    }
    if (response.data.returnCode === 0) {
      const { list } = this.state;
      const data = response.data.data;
      this.setState({
        list: [...list, ...data.list.list],
        pageIndex,
        lastPage: data.list.lastPage,
        advertise: data.advertise || banner1,
        isReload:true
      })
    }
  }
  onScroll = () => {
    const {pageIndex, pageSize, lastPage} = this.state;
    if(pageIndex === lastPage){
      this.setState({
        noMore: true,
      })
      return ;
    }
    this.getList(pageIndex + 1, pageSize)
  }

  // // 获取书籍或课程列表
  // async fetchList ( contentCategoryType, contentCategoryId,code ) {
  //   let fetchApi = contentCategoryType == 2 
  //     ? queryBookCourseList({contentCategoryId,code:code||''})
  //     : queryCategoryList({ contentCategoryType, contentCategoryId,code:code||'' })
  //   let res = await fetchApi
  //   const data = res.data.data;

  //   this.setState({isReload:true, data:data.list,advertise: data.advertise || banner1 })
  // }

  // 详情页 1书 2课
  handleToDetail (item) {
    const { type} = this.$router.params;
    const {
      id,
      chapterId
    } = item;
    if(type==1){
      Taro.navigateTo({
        url: `/pages/detailsBook/index?id=${id}`
      })
    }else{
      Taro.navigateTo({
        url: `/pages/detailsCourse/index?id=${id}&chapterId=${chapterId}`
      })
    }
    
  }
  render() {
    const i = Math.floor(Math.random()*4);

    const { list, noMore,advertise ,isReload} = this.state
    const { type } = this.$router.params
    return(
      <Page full className='list'>  
        
        
        <ScrollView
            className='scroll-view'
            scrollY={true}
            onScrollToLower={this.onScroll}
          >
            <View className='banner'>
          <Image src={advertise}></Image>
          {/* <MySwiper bannerList={bannerList} /> */}
          </View>
            {
              list.map( (item,index) => {
                return (
                  <View className={`books books-${index}`} onClick={this.handleToDetail.bind(this,item)}>
                    <MyGraphic title={type == 2 ? item.title : item.bookTitle} img={item.imgMain}>
                    <View className="graphic-describe">
                        <View className='graphic-content'>{type == 2 ? item.commendDesc : item.commendTitle}</View>
                        <View className='graphic-button'>
                          <View>{type==2? (item.finished ?<Text>已完结 共{item.updatedChapters}期 </Text>:<Text>更至{item.updatedChapters}期 </Text>):''} {item.studyNum}人学习</View>
                          <Text className="graphic-learn">学习</Text>
                        </View>
                      </View>
         
                    </MyGraphic>
                  </View>
                )
              } )
            }
             </ScrollView>
            {
              (isReload&&list.length===0) && <View className='no-more'>暂无数据</View>
            }
            {
              noMore && <View className='no-more'>无更多数据</View>
            }
      </Page>
    )
  }
}