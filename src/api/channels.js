import request from '@/utils/request'
import store from '@/store'
const CACHE_CHANNEL_V = 'hema-mobeil-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hema-mobeil-t' // 游客用户的key
/**
 * 获取我的频道数据，没有参数匿名用户也可以获取数据
 */

export function getMyChannels () {
  // 改造成本地化的频道
  // return request({
  //   url: '/user/channels'
  // })
  return new Promise(function (resolve, reject) {
    // 支持本地化数据，先区分是游客登录还是用户登录，根据有没有token判断
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 如果本地缓存有数据,把本地数据释放给后面的执行结果
      resolve({ channels: JSON.parse(str) })
    } else {
      // 如果本地缓存没有数据，拉取数据存入缓存
      request({ url: '/user/channels' }).then(result => {
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result)
      })
    }
  })
}
/**
 * 获取所有频道
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
/**
 * 删除频道
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 删除频道时肯定有数据
    const channels = JSON.parse(localStorage.getItem(key))
    // 1.用filter删除。直接返回一个新数组
    // channels = channels.filter(item => item.id === id)
    // localStorage.setItem(key, JSON.stringify(channels))
    // 2.找到对应频道的索引
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
      resolve()
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
