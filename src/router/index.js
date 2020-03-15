import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// -----------------------------用按需加载方式配置路由
const layout = () => import('@/views/layout') // 一级路由
// -----------------------------------------二级路由
const home = () => import('@/views/home') // 二级路由
const question = () => import('@/views/question') // 二级路由
const video = () => import('@/views/video') // 二级路由
const user = () => import('@/views/user') // 二级路由
// --------------------------------------------------一级路由
const chat = () => import('@/views/user/chat.vue') // 一级路由
const login = () => import('@/views/login') // 一级路由
const profile = () => import('@/views/user/profile.vue') // 一级路由
const search = () => import('@/views/search') // 一级路由
const result = () => import('@/views/search/result.vue') // 一级路由
const article = () => import('@/views/article') // 一级路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: layout, // 一级路由-布局组件
    children: [{
      path: '',
      component: home // 二级路由默认组件-首页
    }, {
      path: '/question', // 二级路由-问答组件
      component: question
    }, {
      path: '/video', // 二级路由-视频组件
      component: video
    }, {
      path: '/user', // 二级路由-个人中心组件
      component: user
    }]
  }, {
    path: '/user/chat', // 一级路由-小智同学组件
    component: chat
  }, {
    path: '/login', // 一级路由-登录组件
    component: login
  }, {
    path: '/user/profile', // 一级路由-编辑资料组件
    component: profile
  }, {
    path: '/search', // 一级路由-搜索中心组件
    component: search
  }, {
    path: '/search/result', // 一级路由-搜索结果组件
    component: result
  }, {
    path: '/article', // 一级路由-文章详情组件
    component: article
  }
]

const router = new VueRouter({
  routes
})

export default router
