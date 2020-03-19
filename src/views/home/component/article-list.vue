<template>
  <div class="scroll-wrapper">

              <van-list v-model="upLoading" :finished="finished" @load="onLoad">
                  <van-cell-group>
                      <van-cell v-for="item in articles" :key="item" title="标题" :value = '`内容+${item}`'></van-cell>
                  </van-cell-group>
              </van-list>

          </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      articles: []
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载')
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(15), (value, index) =>
          this.articles.length + index + 1)
        this.articles.push(...arr)
        this.upLoading = false
      }
    }
  }

}
</script>

<style>

</style>
