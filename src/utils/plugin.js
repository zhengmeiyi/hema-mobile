// -------------------------封装一个相对时间函数
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// 转化时间到相对时间
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}

export default {
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime) // 把相对时间注册到过滤器
  }
}
// 休眠函数
// time=500 传了time则用传过来的，没传用500
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
// 时间函数
