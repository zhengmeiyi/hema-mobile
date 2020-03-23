<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" >
      <van-cell icon="search" v-if="q">
        <span>java</span>
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-if="!q">
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group v-for="(item,index) in historyList" :key="index">
        <van-cell @click="toSearchResult(item)">
          <a class="word_btn">{{item}}</a>
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hema-mobile-history'
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: JSON.parse(localStorage.getItem(key) || '[]')
    }
  },
  methods: {
    delHistory (index) { // 删除当前历史记录
      this.historyList.splice(index, 1) // 删除当前元素
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 存入缓存
    },
    toSearchResult (text) { // 点击历史记录跳转到搜索结果
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    async clear () { // 清空历史记录
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确定要清空历史记录吗？'
        })
        this.historyList = [] // 清空列表
        localStorage.setItem(key, '[]') // 清空缓存
      } catch (error) {
        // 什么都不用做
      }
    },
    onSearch () { // 搜索
    // 如果搜索内容为空，则返回
      if (!this.q) return
      this.historyList.push(this.q) // 添加到历史记录列表
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重置缓存
      this.$router.push({ path: '/search/result', query: { q: this.q } }) // 跳转到搜索结果并携带数据
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
