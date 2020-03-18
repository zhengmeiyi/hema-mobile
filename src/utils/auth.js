/**
 * 专门处理token的读写和删除
 */
const USER_TOKEN = 'heima-toutiao-mobile-94' // 专门用来存储用户信息

// 设置用户的token信息
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户的token
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}

// 删除token
export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
