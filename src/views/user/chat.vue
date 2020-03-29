<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
     <div class="chat-list" ref="mylist">
      <div class="chat-item" :class='{left:item.name==="xz" , right:item.name!=="xz"}' v-for="(item,index) in list" :key="index">
        <van-image v-if="item.name==='xz'" fit="cover" round :src='headimg' />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name!=='xz'"  fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import headimg from '@/assets/head.jpg'
import io from 'socket.io-client'
export default {
  name: 'chat',
  data () {
    return {
      value: '',
      loading: false,
      headimg, // 小智头像
      list: [] // 聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
    // 初始化websocket连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token
      }
    })
    // 监听连接成功后执行
    this.socket.on('connect', () => {
      this.list.push({ msg: '你好啊，我是小智', name: 'xz' })
    })
    this.socket.on('message', data => {
      console.log(data)
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom()
    })
  },
  methods: {
    async send () { // 发送消息
      if (!this.value) return false // 消息不能为空
      this.loading = true // 打开加载状态，避免重复提交
      await this.$sleep(500) // 强制休眠
      const obj = {
        msg: this.value,
        timestamp: Date.now()
      }
      this.socket.emit('message', obj) // 发送消息
      this.list.push(obj) // 把消息添加到列表
      this.value = '' // 清空输入框
      this.loading = false // 关闭加载状态
      this.scrollBottom()
    },
    scrollBottom () {
      this.$nextTick(() => {
        this.$refs.mylist.scrollTop = this.$refs.mylist.scrollHeight
      })
    }
  },
  beforeDestroy () { // 实例销毁前关闭连接
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
