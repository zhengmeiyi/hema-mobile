import request from '@/utils/request'
/**
 * 获取文章接口
 */
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 完整地址
    params: { with_top: 1, ...params } // 合并数据
  })
}
/**
 * 文章：不感兴趣接口
 */
export function dislikearticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'POST',
    data
  })
}
/**
 * 举报文章接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
/***
 * 联想搜索
 */
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
/**
 * 获取文章详情
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
/**
 * 获取文章评论
 */
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}
/**
 * 添加评论
 */
export function Comments (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
