<template>
  <div class="comment">
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="item in comments"
        :key="item.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.link_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <van-action-sheet
      @close="reply.commentId=null"
      v-model="showReply"
      :round="false"
      class="reply_dialog"
      title="回复评论"
    >
      <van-list
        @load="getReply"
        :immediate-check="false"
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="item in reply.list"
          :key="item.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{item.aut_name}}</span>
            </p>
            <p>{{item.content}}</p>
            <p>
              <span class="time">{{item.pubdate | relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, Comments } from '@/api/articles'

export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [],
      offset: null,
      reply: {
        loading: false,
        finished: true,
        offset: null,
        list: [], // 存放评论的评论
        commentId: null
      },
      showReply: false // 评论的评论弹层是否显示
    }
  },
  methods: {
    async onLoad () {
      // 获取评论
      const { artId } = this.$route.query
      const params = {
        type: 'a',
        source: artId,
        offset: this.offset
      }
      const data = await getComments(params)
      this.comments.push(...data.results)
      this.loading = false
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        this.offset = data.last_id
      }
    },
    openReply (comId) { // 评论的评论弹层
      this.showReply = true // 显示评论的评论弹层
      this.reply.commentId = comId // 当前评论的id
      this.reply.list = [] // 清空之前的数据
      this.reply.offset = null // 从第一页开始
      this.reply.finished = false // 讲finished 打开
      this.reply.loading = true // 打开加载状态
      this.getReply() // 请求数据
    },
    async getReply () {
      const params = {
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      }
      const data = await getComments(params)
      // console.log(data)
      this.reply.list.push(...data.results)
      this.reply.loading = false
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    async submit () { // 添加评论
      if (this.$store.state.user.token) {
        // 有token
        if (!this.value) return false // 如果为空,不能评论
        this.submiting = true
        try {
          const data = await Comments({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId,
            content: this.value,
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          console.log(data)
          if (this.reply.commentId) {
            // 对评论进行评论
            this.reply.list.unshift(data.new_obj)
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId) // 找到当前评论的id
            comment && comment.reply_count++ // 当前评论的数量加一
          } else {
            // 对文章进行评论
            this.comments.unshift(data.new_obj)
          }
          this.value = ''
          this.submiting = false
          await this.$sleep(800)
        } catch (error) {
          this.$znotify({ message: '评论失败' })
        }
      } else {
        // 无token 去登录
        try {
          await this.$dialog.confirm({ title: '提示', message: '如果想要评论,请先登录' })
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath
            }
          })
        } catch (error) {

        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
