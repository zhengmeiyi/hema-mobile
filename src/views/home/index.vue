<template>
  <div class="container">
    <van-tabs>
        <van-tab :title='item.name' v-for="item in channels" :key="item.id">
          <article-list :channel_id="item.id"></article-list>
        </van-tab>
        <span class="bar_btn">
          <van-icon name='wap-nav'></van-icon>
        </span>

    </van-tabs>
  </div>
</template>

<script>
import articleList from './component/article-list'
import { getMyChannels } from '@/api/channels'

export default {
  name: 'home', // devtools 查看组件时可以看到对应的name
  data () {
    return {
      channels: []
    }
  },
  components: {
    'article-list': articleList
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels()
      console.log(data)
      this.channels = data.channels
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}

</style>
