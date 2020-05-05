const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    id:null,
    type:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser(options.id)
    console.log(options,"f分享参数")
    this.setData({
      id:options.id,
      type:options.type?true:false
    })
  },
  getDetail(id){
    console.log(id,"参数1111")
    app.func.request(`${app.api.getRuleDetail}/${id}`, "", "GET").then(res => {
      console.log(res,"参数字")
      if(res.code===200){
        this.setData({
          content:res.data.content
        })
      }
    })
  },
    /** 根据code获取token */
    getUser(id) {
      var that = this;
      // if (wx.getStorageSync("token")) {
      wx.login({
        success(result) {
          if (result.code) {
            app.func.request(app.api.wxToken, {
              code: result.code,
            }, "GET").then((res) => {
              if (res.code === 200) {
                wx.setStorageSync("token", res.data)
                that.getDetail(id)
              }
              if (res.code == 0) {
                that.setData({
                  forbidden: false
                })
                wx.redirectTo({
                  url: "/pages/home/forbidden/forbidden"
                })
              }
            })
          }
        }
      });
    },
  jumpHome(){
    wx.switchTab({
      url: '/pages/home/index/index',
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
    let shareUrl = `/pages/userInfo/recommendSoft/recommendSoft?type=1&id=${this.data.id}`
    var shareObj = {
      title: "推荐软文",
      path: shareUrl,
      // imageUrl: '/img/index/shareImg.png',
    }
    return shareObj;
  }
})