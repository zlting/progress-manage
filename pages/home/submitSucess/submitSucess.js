// pages/submitSucess/submitSucess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:Number(options.type),
      name:options.name||""
    })
    wx.setNavigationBarTitle({
      //提交成功
      title: options.type==1?'提交成功':'认证成功' 
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
  //返回首页
  goBack(){ 
    wx.switchTab({
      url: '/pages/home/index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})