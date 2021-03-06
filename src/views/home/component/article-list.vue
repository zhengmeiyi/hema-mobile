<template>
  <div class="scroll-wrapper" @scroll="remember" ref="myscroll">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="success_text">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <!-- ---------------------文章列表 -->
            <div class="article_item">
              <!-- -------------------文章标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type===3">
                <!-- ---------------------三张图 -->

                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                <!-- ------------------单图 -->
                </div>
                 <div class="img_box" v-if="item.cover.type===1" >
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- --------------作者信息 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{item.pubdate | relTime}}</span>
                <span @click.stop="$emit('showPopup',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles } from '@/api/articles'
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      articles: [], // 文章
      downLoading: false, // 下拉刷新状态
      success_text: '', // 下拉刷新成功后显示
      timestamp: null, // 用于时间戳i
      scrollTop: 0 // 用于存放当前实例滚动的位置
    }
  },
  props: {
    channel_id: {
      required: true, // 必填项，要求props必须传
      type: Number, // 要传入prop的类型
      default: null // 默认
    }
  },
  methods: {
    async onLoad () {
    //   console.log('开始加载')
    //   if (this.articles.length > 50) {
    //     this.finished = true
    //   } else {
    //     const arr = Array.from(
    //       Array(15),
    //       (value, index) => this.articles.length + index + 1
    //     )
    //     this.articles.push(...arr)
    //     this.upLoading = false
    //   }
    //   console.log(this.channel_id)
      await this.$sleep()
      const data = await getArticles({
        channel_id: this.channel_id, timestamp: this.timestamp || Date.now()
      }) // 获取文章列表

      //   console.log('开始加载文章列表')
      //   console.log(data.results)
      this.articles.push(...data.results) // 从后添加
      this.upLoading = false // 关闭加载
      // 如果有历史时间戳：表示还有数据可以加载，否则没有数据了
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
    //   setTimeout(() => {
    //     const arr = Array.from(
    //       Array(2),
    //       (value, index) => '追加' + (index + 1)
    //     )
    //     this.articles.unshift(...arr)
    //     this.downLoading = false
    //     this.success_text = `更新了${arr.length}条消息`
    //   })
    // 下拉刷新发送最新的时间戳
      await this.$sleep()
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })
      this.downLoading = false // 关闭下拉刷新的状态
      // 如果有返回数据，则替换articles数据
      if (data.results.length) {
        this.articles = data.results
        if (data.pre_timestamp) {
          this.finished = false
          this.timestamp = data.pre_timestamp
        }
        this.success_text = `更新了${data.results.length}条数据`
      } else {
        this.success_text = '当前数据已经是最新了'
      }
    },
    remember (event) { // 记录当前滚动位置事件
      clearTimeout(this.timer) // 函数防抖
      this.timer = setTimeout(() => {
        this.scrollTop = event.target.scrollTop
      }, 500)
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    eventbus.$on('delArticle', (artId, channelId) => {
      if (channelId === this.channel_id) {
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        if (this.articles.length === 0) { // 数据删光了重新加载数据
          this.onLoad()
        }
      }
    })
    eventbus.$on('changeTab', (id) => { // 监听切换标签，滑动滚动条
      if (id === this.channel_id) {
        this.$nextTick(() => {
          if (this.$refs.myscroll && this.scrollTop) {
            this.$refs.myscroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },
  activated () {
    if (this.$refs.myscroll && this.scrollTop) {
      this.$refs.myscroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
