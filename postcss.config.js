// 此文件专门处理postcss插件
module.exports = {
  plugins: {
    autoprefixer: {}, // 自动给css样式加前缀
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值
      propList: ['*'] // 包括哪些文件，全部的文件都转为rem
    }
  }
}
