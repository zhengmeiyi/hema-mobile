<template>
  <div class="container">
    <van-tabs v-model="activeIndex">
        <van-tab :title='item.name' v-for="item in channels" :key="item.id">
          <article-list @showPopup="showPopup" :channel_id="item.id"></article-list>
        </van-tab>
        <span class="bar_btn">
          <van-icon name='wap-nav'></van-icon>
        </span>
    </van-tabs>
    <van-popup  :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action @dislike="dislikearticle"></more-action>
    </van-popup>
  </div>
</template>

<script>
import articleList from './component/article-list'
import { getMyChannels } from '@/api/channels'
import MoreAction from './component/more-action'
import { dislikearticle } from '@/api/articles'
import eventbus from '@/utils/eventbus'

export default {
  name: 'home', // devtools 查看组件时可以看到对应的name
  data () {
    return {
      channels: [], // 频道数据
      showMoreAction: false, // 弹层组件，默认不显示
      articleId: null, // 当前点击文章的Id
      activeIndex: 0 // 当前激活的页面
    }
  },
  components: {
    'article-list': articleList,
    'more-action': MoreAction
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels()
      // console.log(data)
      this.channels = data.channels
    },
    showPopup (artid) { // 弹出框
      this.showMoreAction = true
      this.articleId = artid
      console.log(this.articleId)
    },
    async dislikearticle () { // 对文章不感兴趣
      try {
        await dislikearticle({
          target: this.articleId
        })
        this.$znotify({ type: 'success', message: '操作成功' })
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false // 关闭弹层
      } catch {
        this.$znotify({ type: 'success', message: '操作失败' })
      }
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
