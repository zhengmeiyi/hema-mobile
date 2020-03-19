<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="success_text">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item" title="标题" :value="`内容+${item}`"></van-cell>
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

<style>
</style>
