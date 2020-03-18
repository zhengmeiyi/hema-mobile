export default {
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({
      duration: 800, ...params
    })
  }
}
