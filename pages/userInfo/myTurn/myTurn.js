const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    day:0,
    hou:0,
    min:0,
    sec:0,
  },

  onLoad: function (options) {
   
  },
      /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.obj.demandImg // 需要预览的图片http链接列表  
    })
  },
  getDetail() {
    this.setData({
      day:0,
      hou:0,
      min:0,
      sec:0,
    })
    app.func.request(app.api.current_demandDetail, '', "GET").then((res) => {
      if(res.code===200){
        if(res.data){
          res.data.demandImg=res.data.demandImg.split(",")
          this.countDown(res.data.expireDate)
          this.setData({
            obj:res.data
          })
        }else{
          this.setData({
            obj:null
          })
        }
      
      }
    })
  },
  timeFormat(param) {
    return param < 10 ? '0' + param : param
  },
  countDown(it) {
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
      }
      this.setData({
        day:obj.day,
        hou:obj.hou,
        min:obj.min,
        sec:obj.sec,
      })
    }, 1000)
  },
  //取消发布
  cancle(){
    app.func.request(app.api.cancel_demand, {id:this.data.obj.id}, "POST").then((res) => {
      if(res.code===200){
        wx.showToast({
          title: '取消成功',
          icon:"success",
          duration:1500
        })
        this.getDetail()
      }
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
    this.getDetail()
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
  //历史求助
  jumpHistory(){
    wx.navigateTo({
      url: '/pages/userInfo/oldTrun/oldTrun',
    })
  },
  //申请求助
  jumpApply(){
    wx.redirectTo({
      url: '/pages/userInfo/applyTrun/applyTrun',
    })
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})