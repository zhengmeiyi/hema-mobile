<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" label="手机号：" placeholder="请输入手机号">
      </van-field>
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码：" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码
        </van-button>
      </van-field>
      <div class="login-box">
        <van-button @click="login" type="info" round size="small" block> 登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      errorMessage: { // 放置错误消息
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 1.判断手机号不能为空
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      // 2.判断手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 3.通过了就没有消息
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      // 1.判断验证码不能为空
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      // 2.判断验证码格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码格式不正确'
        return false
      }
      // 3.通过了就没有消息
      this.errorMessage.code = ''
      return true
    },
    login () {
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        console.log('校验通过')
      }
    }

  }
}
</script>

<style>
.login-box{
  padding: 20px;
}
</style>
