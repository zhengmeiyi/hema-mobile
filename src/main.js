import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
import plugin from '@/utils/plugin'
import Vant from 'vant' // 引入vant
import 'vant/lib/index.less' // 引入vant的css文件
import 'amfe-flexible' // 运行时根据屏幕大小决定font-size大小
import './styles/index.less'
Vue.use(Vant)// 全局注册vant
Vue.use(plugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
