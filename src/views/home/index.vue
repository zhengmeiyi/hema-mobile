<template>
  <div class="container">
    <van-tabs v-model="activeIndex" @change="changeTab">
        <van-tab  :title='item.name' v-for="item in channels" :key="item.id">
          <article-list @showPopup="showPopup" :channel_id="item.id"></article-list>
        </van-tab>
        <span class="bar_btn" @click="showEditChannels=true">
          <van-icon name='wap-nav'></van-icon>
        </span>
    </van-tabs>
    <van-popup  :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"></more-action>
    </van-popup>
    <van-action-sheet v-model="showEditChannels" title="编辑频道" :round="false">
      <channel-edit @addChannel="addChannel"
      @delChannel="delChannel"
      :activeIndex="activeIndex"
      @selectchannel="selectchannel"
      :channels='channels'></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import articleList from './component/article-list'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import MoreAction from './component/more-action'
import { dislikearticle, reportArticle } from '@/api/articles'
import eventbus from '@/utils/eventbus'
import channelEdit from './component/channel-edit'

export default {
  name: 'home', // devtools 查看组件时可以看到对应的name
  data () {
    return {
      channels: [], // 频道数据
      showMoreAction: false, // 弹层组件，默认不显示
      articleId: null, // 当前点击文章的Id
      activeIndex: 0, // 当前激活的页面
      showEditChannels: false // 编辑频道页面
    }
  },
  components: {
    'article-list': articleList,
    'more-action': MoreAction,
    'channel-edit': channelEdit
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
    async dislikeOrReport (operateType, type) { // 对文章不感兴趣
      try {
        operateType === 'dislike' ? await dislikearticle({
          target: this.articleId
        }) : await reportArticle({
          target: this.articleId,
          type
        })
        this.$znotify({ type: 'success', message: '操作成功' })
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false // 关闭弹层
      } catch {
        this.$znotify({ type: 'success', message: '操作失败' })
      }
    },
    selectchannel (id) { // 点击编辑频道列表里的频道切换到对应频道
      const index = this.channels.findIndex(item => item.id === id) // 将点击的频道编号的索引给当前激活的标签
      this.activeIndex = index
      this.showEditChannels = false // 关闭频道编辑面板
    },
    // 删除频道
    async delChannel (id) {
      try {
        await delChannel(id)
        const index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          this.activeIndex = this.activeIndex - 1 // 如果删除的索引是当前激活索引之前的或者等于当前激活索引，把激活索引往前挪一位
        }
        this.channels.splice(index, 1) // 删除对应的频道索引
      } catch (error) {
        this.$znotify({ message: '删除频道失败' })
      }
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)
    },
    changeTab () { // 切换标签时触发
      eventbus.$emit('changeTab', this.channels[this.activeIndex].id)
    }

  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
  // .van-action-sheet {
  //   max-height: 100%;
  //   height: 100%;
  //   .van-action-sheet__header{
  //     background-color: #fff;
  //   }
  // }

}

</style>
