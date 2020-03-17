/**
 * 导航守卫
 */
import router from '@/router'
import store from '@/store'
//  前置守卫：每当路由发生变化，前置守卫就会执行
router.beforeEach(function (to, from, next) {
  // 如果/user为起始，需要进行token判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redireectUrl: to.fullPath
      }
    })
  } else {
    next() // 直接放行
  }
})
