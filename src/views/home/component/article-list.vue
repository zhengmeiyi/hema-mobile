<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="success_text">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- <van-cell v-for="item in articles" :key="item" title="标题" :value="`内容+${item}`"></van-cell> -->
          <van-cell v-for="item in articles" :key="item">
            <!-- ---------------------文章列表 -->
            <div class="article_item">
                <!-- -------------------文章标题 -->
              <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
              <div class="img_box">
            <!-- ---------------------三张图 -->

                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <!-- ------------------单图 -->
                <!-- <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" /> -->
              </div>
              <!-- --------------作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
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
export default {
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      articles: [],
      downLoading: false, // 下拉刷新状态
      success_text: ''
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载')
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        this.articles.push(...arr)
        this.upLoading = false
      }
    },
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        this.articles.unshift(...arr)
        this.downLoading = false
        this.success_text = `更新了${arr.length}条消息`
      })
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
