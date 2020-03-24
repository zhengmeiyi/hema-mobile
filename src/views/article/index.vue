<template>
  <div class="container">
    <van-nav-bar  fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
      <div class="detail">
      <h3 class="title">{{ article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button @click="follow" round size="small" type="info">{{ article.is_followed ? '已关注':' + 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active : article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <Comment></Comment>
    </div>
    <van-overlay :show="showOverlay" >
      <van-loading color="#1989fa" />
    </van-overlay>
  </div>
</template>

<script>
import { following, unfollowing } from '@/api/user'
import { getArticleInfo } from '@/api/articles'
import Comment from './component/comment'
export default {
  data () {
    return {
      article: [],
      showOverlay: false
    }
  },
  components: {
    Comment
  },
  methods: {
    async getArticleInfo () { // 获取文章详情
      this.showOverlay = true

      const { artId } = this.$route.query
      // console.log(artId)
      const data = await getArticleInfo(artId)
      console.log(data)
      this.article = data
      this.showOverlay = false
    },
    async follow () { // 关注或取消关注
      try {
        if (this.article.isfollowed) { // 取消关注
          await unfollowing(this.article.aut_id)
        } else { // 关注
          await following(this.article.aut_id)
        }
        this.article.is_followed = !this.article.is_followed // 电脑端会自动变更，移动端不会自动变更，手动设置
      } catch (error) {
        this.$znotify({ message: '操作失败' })
      }
    }

  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.van-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }

}
</style>
