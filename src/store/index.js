/**
 * 专门处理vuex中的模块
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser() // 放置需要共享的状态。token，如果缓存有token,读取缓存的token
  },
  mutations: { // 改token只能通过mutation
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的user数据给state
      auth.setUser(payload.user) // 把最新的数据存入本地缓存
    },
    delUser (state) { // 删除token
      state.user = {}
      auth.delUser() // 删除本地缓存的token
    }
  },
  actions: {
  },
  modules: {
  }
})
