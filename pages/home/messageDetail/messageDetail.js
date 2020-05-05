var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    videoType:true,
  },

  onLoad: function (options) {
    this.getDetail(options.id)
  },

  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.obj.bulletinImg // 需要预览的图片http链接列表  
    })
  },

  /**
   * 评论框焦点获取监听
   */
  getValue(e) {
    console.log(e)
  },
  getDetail(id) {
    app.func.request(`${app.api.nbBulletinDetail}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var {
          data
        } = res
        // data.gmtCreate = app.getDateDiff(data.gmtCreate)
        // data.evaluateList.map(item => {
        //   item.gmtCreate = app.dateFormat(item.gmtCreate)
        //   if (item.childList.length > 0) {
        //     item.childList.map(val => {
        //       val.gmtCreate = app.dateFormat(val.gmtCreate)
        //     })
        //   }
        // })
        // data.videoUrl="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
        this.setData({
          obj: data,
        })
      }
    })
  },
  //播放视频
  jumpAudio(){
    const {videoType}=this.data
    const type=!videoType
    if(!type){
      this.videoContext.play()
      this.videoContext.requestFullScreen();
    }else{
      this.videoContext.stop()
    }
    this.setData({
      videoType:type
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
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