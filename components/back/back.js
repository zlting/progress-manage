const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    text: {
      type: String,
      // value: '',
    },
    bgColor: {
      type: String,
      // value: '',
    }
  },
  data: {
    statusBarHeight:"",
    titleBarHeight:""
  },

  ready: function (options) {
    this.setData({
      statusBarHeight:app.globalData.statusBarHeight,
      titleBarHeight:app.globalData.titleBarHeight,
    })
  },

  methods: {
    // customMethod(){
    //   console.log('hello world! I am learning 微信小程序')
    // }
    jumpBack(){
      wx.navigateBack({
        delta: 1
      })
    }
  }
})