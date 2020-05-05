const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages:{pageIndex:1,pageSize:10,over:false},
    loadMore: true,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {pages}=this.data
    pages.communityId=options.communityId
    this.setData({
      pages:{...pages}
    },()=>{
      this.getList()
    })
  },
 //获取发布信息列表
 getList: function (reload = false) {
  const {pages}=this.data
  if (reload) {
    pages.pageIndex = 1
    this.setData({
      page: {
        ...pages
      },
      list: [],
      loadMore: true
    })
  }
  if (this.data.loadMore) {
    app.func.request(`${app.api.moneyPageList}`, pages, "GET").then(res => {
        if(res.code===200){
          ++pages.pageIndex
          res.data.list.map(item=>{
            item.time=""
          })
          this.setData({
            list: this.data.list.concat(res.data.list),
            pages: {
              ...pages
            },
            loadMore: res.data.isLastPage ? false : true
          },()=>{
            this.data.list.map((item,index)=>{
              this.countDown(item.expireDate,index)
            })
          })
          
        }
    })
  }
},
timeFormat(param) {
  return param < 10 ? '0' + param : param
},
countDown(it,i) {
  console.log(it)
  const interval = setInterval(() => {
    // 获取当前时间，同时得到活动结束时间数组
    const newTime = new Date().getTime() // 对结束时间进行处理渲染到页面
    const endTime = it
    let obj = null // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      const time = (endTime - newTime) / 1000 // 获取天、时、分、秒
      const day = parseInt(time / (60 * 60 * 24))
      const hou = parseInt((time % (60 * 60 * 24)) / 3600)
      const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
      const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {
      // 活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
      clearInterval(interval)
      // location.reload()
    }
    this.data.list[i].time =
      obj.day + '天' + obj.hou + '时' + obj.min + '分' + obj.sec + '秒'
      this.setData({
        list:[...this.data.list]
      })
  }, 1000)
},
//跳转详情
jumpDetail(e){
  const item=e.currentTarget.dataset
  wx.navigateTo({
    url: `/pages/help/helpDetail/helpDetail?id=${item.id}&userId=${item.userinfoid}`,
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onPullDownRefresh: function () {
    this.getList(true)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})