import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import MyPicture from '../MyPicture'
import Record from '../Record'


const shutu = 'http://img1.imgtn.bdimg.com/it/u=1878401278,1610402481&fm=26&gp=0.jpg'

import './index.scss'

const avatar = `${Taro.IMG_URL}/avatar.png`
const admire = `${Taro.IMG_URL}/admire.png`
const admiried = `${Taro.IMG_URL}/admiried.png`
const banner1 = `${Taro.IMG_URL}/banner1.jpg`

export default class HomeWork extends Component {

  defaultProps = {
    list: [],
  }


  handleAdmire = (id) => {
    let list =  this.props.list;
    list.forEach( item => {
      if(item.id === id) {
        item.favourNum = item.thumbedUp ? item.favourNum - 1 : item.favourNum + 1
        item.thumbedUp = !item.thumbedUp
      }
    } )
    this.props.onHandleAdmire(id, list)
  }

  render() {
    
    let { list } = this.props
    
    return (
      <View className='homework'>
        {
          list && list.map(item => {
            let imgArr = item.ubcwfList && item.ubcwfList.map( imgItem => ({
              ...imgItem,
              src: imgItem.resourcePath
            }) )
            let isAudio = item.ubcwfList.some( i => i.type === 2 )
            return (
              <View key={item.id} className='homework-items'>
                <View className='user-info'>
                  <AtAvatar className='homework-avatar' circle size='large' image={item.headImg} />
                  <View className='info'>
                    <View className='nickName'>
                      <Text>{item.nickName} </Text>
                    </View>
                    <View className='expire'>{item.gmtCreate}</View>
                  </View>
                  <View className='member-btn' onClick={this.handleAdmire.bind(this, item.id)}>
                    <Image src={ item.thumbedUp ? admiried : admire } />
                    <Text style={{ color: `${ item.thumbedUp ? '#ff6105' : '#999' }` }} >{item.favourNum}</Text>
                  </View>
                </View>
                <View className='content'>
                  <View className='review'>{item.content}</View>
                  {
                    isAudio
                    ? <View className='record'>
                      <Record timeLength={item.ubcwfList[0].durationTime} audioUrl={item.ubcwfList[0].resourcePath}/>
                    </View>
                    : <MyPicture img={[...imgArr]} />
                  }
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}