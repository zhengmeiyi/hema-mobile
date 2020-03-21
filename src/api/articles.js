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
