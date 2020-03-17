<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <can-cell-group>
      <van-field label="手机号：" placeholder="请输入手机号">
      </van-field>
      <van-field label="验证码：" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码
        </van-button>
      </van-field>
      <div class="login-box">
        <van-button type="info" round size="small" block> 登录</van-button>
      </div>
    </can-cell-group>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style>
.login-box{
  padding: 20px;
}
</style>
