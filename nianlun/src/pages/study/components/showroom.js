import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { thubmbsUp } from '../../../services/homework'
// import { MyCard, WhiteSpace } from '../../../components/index'
import HomeWork from '../../../components/Homework'
import WhiteSpace from '../../../components/WhiteSpace'
import MyCard from '../../../components/MyCard'

import '../index.scss'
export default class Showroom extends Component {

  // 点赞
  handleAdmire = async(id, list) => {
    await thubmbsUp({ userBookCourseWorkId: id })
    try {
      this.setState({ anthouerList: list })
    } catch (error) {}
  }

  handleToProd = (workType) => {
    const { bookCourseId, bookCourseChapterId } = this.props
    Taro.navigateTo({ url: `/pages/production/index?workType=${workType}&bookCourseId=${bookCourseId}&bookCourseChapterId=${bookCourseChapterId}` })
  }
  
  render() {
    const { mineList, anthouerList, homeworkType } = this.props
    return (
      <View className='showroom'>
        {
          !mineList.length && homeworkType && homeworkType.map( item => {
            return (
              <View key={item.id}>
                <MyCard title={`作业题：${item.workContent}`}>
                  <View className='upload'>
                    <AtButton onClick={this.handleToProd.bind(this, item.workType)}>上传作品</AtButton>
                  </View>
                </MyCard>
                <WhiteSpace />
              </View>
            )
          } )
        }
        
        <View className='homework'>
          {
            !!mineList.length && (
              <View >
                <MyCard title='我的作业'>
                  <HomeWork list={mineList} onHandleAdmire={this.handleAdmire} />
                </MyCard>
                <WhiteSpace />
              </View>
            )
          }
          <MyCard title='学友们的作品'>
            { !!anthouerList.length ? <HomeWork list={anthouerList} onHandleAdmire={this.handleAdmire} /> : '暂无作业' }
          </MyCard>
        </View>
      </View>
    )
  }
}