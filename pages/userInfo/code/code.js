const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
  },
 //获取用户信息
 setUserInfo() {
  app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
    if (res.code === 200) {
      this.setData({
        userInfo: res.data,
      })
    }
  })
},
//图片点击事件
imgYu: function (event) {
  var that=this;
  var src ="https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/XBtRmrTXf48dhtkAMsrWefMtbEAhfcc7aMSA";//获取data-src
  var imgList = ["https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/XBtRmrTXf48dhtkAMsrWefMtbEAhfcc7aMSA"];//获取data-list
  //图片预览
  wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: imgList // 需要预览的图片http链接列表
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

  }
})