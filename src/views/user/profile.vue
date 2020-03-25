<template>
    <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell @click="showPhoto=true"  is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell @click="showName=true" is-link title="名称" :value="user.name" />
      <van-cell @click="showGender=true" is-link title="性别" :value="user.gender===0 ? '男' : '女'"/>
      <van-cell @click="showDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
     <!-- 头像弹层组件 -->
      <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层组件 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <van-field :error-message="nameMsg" v-model="user.name" type='textarea'  rows="4"></van-field>
      <van-button type="info" size="normal" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup  v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker @confirm="confirmDate"
      @cancel="showBirthDay=false"
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
         />
    </van-popup>
    <!-- 上传文件控件 -->
    <input ref="myFile" @change="upload" type="file" style="display:none">

  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updataPhoto } from '@/api/user'
export default {
  name: 'profile',
  data () {
    return {
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthDay: false,
      user: {
        name: '',
        gender: 1,
        birthday: '2002-01-01',
        photo: ''
      },
      actions: [{ name: '男' }, { name: '女' }],
      currentDate: new Date(),
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      nameMsg: ''
    }
  },
  methods: {
    btnName () { // 用户名称
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '请输入长度控制在1-7之内'
        return
      }
      this.nameMsg = ''
      this.showName = false
    },
    selectItem (item, index) { // 显示性别
      this.user.gender = index
      this.showGender = false
    },
    showDate () { // 显示日期弹层
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () { // 设置时间
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false
    },
    async getUserProfile () { // 获取用户资料
      this.user = await getUserProfile()
    },
    openFileDialog () { // 上传头像
      this.$refs.myFile.click()
    },
    async upload (params) {
      console.log(params)
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      const result = await updataPhoto(data)
      this.user.photo = result.photo
      this.showPhoto = false
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
