const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    complaintContent:null,
    abilityIdentityId:null,
    complaintImg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      abilityIdentityId:options.identityId
    })
    app.aliyunOss()
  },
   //上传图片
 uploadImg() {
  var that=this
  if (that.data.complaintImg.length >= 5) {
    app.func.showToast("您已超过最大图片限制")
    return
  }
  wx.chooseImage({
    count: 5,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      const tempFilePaths = res.tempFilePaths
      for (let path of tempFilePaths) {
        wx.showLoading({
          title: '上传中..',
          mask: true
        })
        app.uploadFile(
          path,
          (result)=> {
            that.data.complaintImg.push(result)
            var arr = that.data.complaintImg.splice(0, 5)
            that.setData({
              complaintImg:[...arr]
            })
            wx.hideLoading();
          },
        );
      }
    }
  })
},
 //删除图片
 delect(e) {
  const index = e.currentTarget.dataset.index
  this.data.complaintImg.splice(index, 1)
  this.setData({
    complaintImg: [...this.data.complaintImg]
  })
},
  /**
   * 提交
   */
  apply(){
    const {abilityIdentityId,complaintContent,complaintImg}=this.data
    if(!complaintContent){
      app.func.showToast("请输入投诉内容")
      return false
    }
    // if(!certificate){
    //   app.func.showToast("请上传投诉图片")
    //   return false
    // }
    var obj={}
    obj.abilityIdentityId=abilityIdentityId
    obj.complaintContent=complaintContent
    obj.complaintImg=complaintImg.join(",")
    app.func.request(`${app.api.nbAbilityComplaint}`, obj, "POST").then(res => {
      if(res.code===200){
        wx.showToast({
          title: '提交成功',
          icon:"success",
          duration:1500
        })
        setTimeout(()=>{
          wx.navigateBack({
          })
        },1000)
      }
    })
  },
  getValue(e){
    this.setData({
      complaintContent:e.detail.value
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