// pages/home/shareArea/shareArea.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    name: "",
    communityId: "",
    distId: "",
    province: null,
    city: null,
    dist: null,
    distAddress:null,
    alertType:true,
    userName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
    this.setData({
      name: options.name,
      communityId: options.communityId,
      distId: options.distId,
      distAddress: options.dist,
      province: wx.getStorageSync("province") || null,
      city: wx.getStorageSync("city") || null,
      dist: wx.getStorageSync("district") || null,
    })
  },

  /**
   * 获取地理位置
   */
  getLocation() {
    app.tosave((res)=>{
      console.log(res,"输出地理位置")
      var arr=res.split(",")
      this.setData({
        province: arr[0] || null,
        city:arr[1] || null,
        dist: arr[2]|| null,
      })
    })
  },
  //获取用户信息
  setUserInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
          userName:res.data.userNames|| null
        })
      }
    })
  },
  apply(){
    const {
      province,
      dist,
      distAddress,
      userName
    } = this.data
    if(!userName){
      app.func.showToast("请输入姓名")
      return false
    }
    if (!province) {
      app.func.showToast("请先获取当前地理位置")
      return false
    }
    if(distAddress!=dist){
      app.func.showToast("当前位置与小区位置不符合")
      return false
    }
    app.func.request(`${app.api.have_resident}`, {share:1}, "GET").then(res => {
      if (res.code === 200) {
        if(res.data){
          this.jumpDetail()
        }
        this.setData({
          alertType: res.data
        })
      }
    })
  },
  cancle(){
    this.setData({
      alertType:true
    })
  },
  getUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  /**
   * 提交
   */
  jumpDetail() {
    const {
      communityId,
      distId,
      name,
      province,
      city,
      dist,
      distAddress,
      userName
    } = this.data
    if (!province) {
      app.func.showToast("请先获取当前地理位置")
      return false
    }
    if(distAddress!=dist){
      app.func.showToast("当前位置与小区位置不符合")
      return false
    }
    var obj = {}
    obj.address = ''
    // obj.address = ''
    obj.communityId = communityId
    obj.distId = distId
    obj.province = province
    obj.city = city
    obj.userName = userName
    obj.dist = dist
    obj.share = 1
    app.func.request(`${app.api.authenticate}`, obj, "POST").then(res => {
      this.setData({
        alertType:true
      })
      if (res.code === 200) {
        wx.showToast({
          title: '提交成功',
          icon: "success",
          duration: 1000
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/home/submitSucess/submitSucess?type=2&name=' + name,
          })
        }, 1000)
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
    this.setData({
      province: wx.getStorageSync("province") || null,
      city: wx.getStorageSync("city") || null,
      dist: wx.getStorageSync("district") || null,
    })
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