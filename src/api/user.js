/***
 * 处理用户请求
 */
import request from '@/utils/request' // request相当于一个axios的实例

/**
 * 登录模块
 */
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data: data
  })
}
/**
 * 关注用户
 */
export function following (autId) {
  return request({
    url: '/user/followings',
    method: 'post',
    data: {
      target: autId
    }
  })
}
/**
 * 取消关注用户
 */
export function unfollowing (autId) {
  return request({
    url: `/user/followings/${autId}`,
    method: 'DELETE'
  })
}
/**
 * 获取用户资料
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/**
 * 获取用户资料
 */
export function getUserProfile () {
  return request({
    url: 'user/profile'
  })
}
/**
 * 修改用户资料
 */
