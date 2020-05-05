const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    activityId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  type 0 投票活动 1 报名活动 2 问卷 3
    this.getDetail(options.id)
    this.setData({
      activityId: options.id
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
  getDetail(id) {
    app.func.request(`${app.api.nbActivity}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var data = res.data
        console.log(data)
        if(data.activityBanner){
          data.activityBanner=data.activityBanner.split(",")
        }
        // data.startTime =data.startTime? app.dateFormat(data.startTime):''
        // data.endTime = data.endTime?app.dateFormat(data.endTime):''
        // data.signStartTime = app.dateFormat(data.signStartTime)
        // data.signEndTime = app.dateFormat(data.signEndTime)
        data.gmtCreate = app.dateFormat(data.gmtCreate)
        // data.timingTime = data.timingTime ? app.dateFormat(data.timingTime) : ''
        wx.setNavigationBarTitle({
          title: data.activityState === 'NOT_STARTS' ? "报名活动详情（未开始）" : data.activityState === 'OVER' ? "报名活动详情（已结束）" : "报名活动详情（进行中）"
        })
        this.setData({
          obj: data,
        })
      }
    })
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
  //报名
  postSignUp(e) {
    app.func.request(`${app.api.signUp}`, {
      id: this.data.activityId
    }, "POST").then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '报名',
          icon: 'success',
          duration: 2000
        })
        // setTimeout(()=>{
        //   wx.navigateBack({
        //     complete: (res) => {},
        //   })
        // },1000)
        this.getDetail(this.data.activityId)
      }
    })
  }

})