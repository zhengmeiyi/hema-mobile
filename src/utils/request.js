import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router'

// axios.create 相当于new 一个新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基地址
  // 此函数是后台响应回来还没进入到axios的响应拦截器时执行，数组里可以写多个的处理函数
  transformResponse: [function (data) {
    return data ? JSONBig.parse(data) : {} // 大数字问题
  }]
})
// ---------------请求拦截器中注入token
instance.interceptorss.request.use(function (config) {
  // 成功的时候，读取配置信息，给配置信息中注入token
  if (store.statu.user.token) {
    config.headers.Authrization = `Bearer ${store.state.user.token}` // 将token统一注入到header中
  }
  return config // 返回配置
}, function (error) {
  return Promise.reject(error) // 直接返回promise的错误，会进入到axios的catch中
})

// ---------------响应拦截器中处理返回数据
instance.interceptors.response.user(function (response) {
  try {
    return response.data.data
  } catch {
    return response.data
  }
}, async function (error) {
  if (error.response && error.response.status === 401) {
    const path = {
      path: 'login', // 地址
      query: {
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的新地址
      }
    }
    if (store.state.user.refresh_token) {
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authrization: `Bearer ${store.state.user.refresh_token}` // 在请求头中注入refreh_token
          }
        })
        // 如果成功，更新token
        store.commit('updateUser', {
          user: {
            token: result.data.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token
          }
        })
        return instance(error.config)
      } catch (error) {
        // 失败意味着refresh_token也失效
        store.commit('delUser')
        // 跳到登录页面
        router.push(path)
      }
    } else {
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error) // 返回执行链的catch
})
export default instance
