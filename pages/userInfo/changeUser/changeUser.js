const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    show:false,
    alertType:1,
    nickname:null,
    userMobile:null,
    code:null,
    getmsg: "获取验证码",
    changeMsg: true
    // headimgurl:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
    app.aliyunOss()
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
  getInfo(){
    app.func.request(app.api.getUserInfo, '', "GET").then((res) => {
      this.setData({
        userInfo: res.data
      })
    })
  },
  //修改信息
  changUser(obj){
    app.func.request(app.api.modifyUser, obj, "POST").then((res) => {
      if(res.code===200){
        wx.showToast({
          title: '修改成功',
          icon:"success",
          duration:2000
        })
        this.getInfo()
        this.setData({
          show:false
        })
      }
    })
  },
   //上传图片
  uploadImg() {
    var that=this
    wx.chooseImage({
      count: 1,
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
              that.data.userInfo.headimgurl=result
              that.setData({
                userInfo:{...that.data.userInfo}
              })
              that.changUser({headimgurl:result})
              wx.hideLoading();
            },
          );
        }
      }
    })
  },
/**
 * 
 */
  changeName(){
    this.setData({
      show:true,
      alertType:1,
    })
  },
  changePhone(){
    this.setData({
      show:true,
      alertType:2,
    })
  },
  cancle(){
    this.setData({
      nickname:null,
      userMobile:null,
      code:null,
      show:false
    })
  },
   /**
   * 获取验证码
   */
  jumpCode(){
    const {userMobile,changeMsg}=this.data
    if (!changeMsg) {
      return;
    }
    if(!userMobile){
      app.func.showToast('请输入手机号')
      return
    }
    if(!app.func.regPhone(userMobile)){
      app.func.showToast('手机号格式不正确')
      return
    }
    app.func.request(app.api.regSms, {mobile:userMobile,type:1}, "GET").then(res => {
        if (res.code===200) {
          app.func.showToast("获取成功")
          let time = 60;
          const timer = setInterval(() => {
            this.setData({
              getmsg : time + "秒后重发",
              changeMsg : false
            })
            time--;
            if (time < 0) {
              clearInterval(timer);
              this.setData({
                getmsg : "获取验证码",
                changeMsg : true
              })
            }
          }, 1000);
        }
      });
  },
  //获取名字
  getName(e){
    this.setData({
      nickname:e.detail.value
    })
  },
   //获取手机号
   getPhone(e){
    this.setData({
      userMobile:e.detail.value
    })
  },
   //获取验证码
   getCode(e){
    this.setData({
      code:e.detail.value
    })
  },
  sucess(){
    const {alertType,nickname,userMobile,code}=this.data
    if(alertType===1){
      if(!nickname){
        app.func.showToast("请输入修改名字")
        return false
      }
      this.changUser({nickname:nickname})
    }else{
      if(!userMobile){
        app.func.showToast("请输入手机号")
        return false
      }
      if(!app.func.regPhone(userMobile)){
        app.func.showToast('手机号格式不正确')
        return
      }
      if(!code){
        app.func.showToast("请输入验证码")
        return false
      }
      this.changUser({userMobile:userMobile,code:code})
    }
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