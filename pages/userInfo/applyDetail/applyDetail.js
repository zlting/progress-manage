const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  type 0 投票活动 1 报名活动 2 问卷 3
    this.getDetail(options.id)
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.obj.activityBanner // 需要预览的图片http链接列表  
    })
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
  // 详情
  getDetail(id) {
    app.func.request(`${app.api.nbActivity}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var data = res.data
        // data.startTime = app.dateFormat(data.startTime)
        // data.endTime = app.dateFormat(data.endTime)
        // data.signStartTime = app.dateFormat(data.signStartTime)
        // data.signEndTime = app.dateFormat(data.signEndTime)
        data.gmtCreate = app.dateFormat(data.gmtCreate)
        // data.timingTime = data.timingTime ? app.dateFormat(data.timingTime) : ''
        data.activityBanner=data.activityBanner.split(",")
        // data.address=data.province + data.city + data.dist + data.detail
        this.setData({
          obj: data,
        })
      }
    })
  },
  //取消
  cancle(e) {
    var that=this
    app.func.request(`${app.api.cancel_activity}`, {
      id: that.data.id
    }, "POST").then(res => {
      if (res.code === 200) {
        app.func.showToast("已取消")
        setTimeout(()=>{
          wx.navigateBack({
            complete: (res) => {},
          })
        },1000)
      }
    })
  },
})