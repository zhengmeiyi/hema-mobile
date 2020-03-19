export default {
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
    Vue.prototype.$sleep = sleep
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
