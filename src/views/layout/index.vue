<template>
  <div class="container">
      <van-nav-bar title="黑马头条" v-if="showNavBar" fixed right-text="搜索" @click-right="$router.push('/search')"></van-nav-bar>
      <div class="my-wrapper" :class="{noTop:!showNavBar}">
          <router-view></router-view>
      </div>
      <van-tabbar route>
          <van-tabbar-item to="/" icon="wap-home">首页</van-tabbar-item>
          <van-tabbar-item to="/question" icon="chat">问答</van-tabbar-item>
          <van-tabbar-item to="/video" icon="play-circle">视频</van-tabbar-item>
          <van-tabbar-item to="/user" icon="manager">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  computed: {
    showNavBar () {
      return this.$route.path !== '/user' // user页面不显示头部导航
    }
  }
}
</script>

<style lang="less">
.container{
    width:100%;
    height: 100%;
    position: relative;
    .my-wrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-top:46px;
        padding-bottom:50px;
        box-sizing: border-box;
        &.noTop{
            padding-top:0;
        }
    }
}

</style>
