const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    colorType:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
  },
  getDetail(id){
    app.func.request(`${app.api.nbredpackadapply}/${id}`, '', "GET").then(res => {
      if(res.code==200){
        this.setData({
          obj:res.data||{}
        })
      }
    })
  },
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: this.data.obj.adImg // 需要预览的图片http链接列表  
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll(ev){
    if(ev.scrollTop>=100){
      this.setData({
        colorType:true
      })
    }else{
      this.setData({
        colorType:false
      })
    }
    console.log(ev)
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