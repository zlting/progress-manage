// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"",
    phone:"",
    code:"",
    getmsg: "获取验证码",
    changeMsg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  getPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  getCode(e){
    this.setData({
      code:e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  jumpCode(){
    const {phone,changeMsg}=this.data
    if (!changeMsg) {
      return;
    }
    if(phone===''){
      app.func.showToast('请输入手机号')
      return
    }
    if(!app.func.regPhone(phone)){
      app.func.showToast('手机号格式不正确')
      return
    }
    app.func.request(app.api.regSms, {mobile:phone}, "GET").then(res => {
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
  /**
   * 注册
   */
  register(){
    const {userName,phone,code}=this.data
    if(userName===''){
      app.func.showToast('请输入姓名')
      return
    }
    if(phone===''){
      app.func.showToast('请输入手机号')
      return
    }
    if(!app.func.regPhone(phone)){
      app.func.showToast('手机号格式不正确')
      return
    }
    if(code===''){
      app.func.showToast('请输入验证码')
      return
    }
    app.func.request(app.api.coreLogin, {userMobile:phone,code:code,nickname:userName}, "POST").then(res => {
      if(res.code===200){
        // app.func.showToast("注册成功")
         app.func.request(`${app.api.getUserInfo}`, "", "GET").then(item=>{
          if (!item.data.isAuth) {
            wx.redirectTo({
              url: '/pages/home/changeHouse/changeHouse',
            })
            // func.showToast("请先认证小区")
            // setTimeout(()=>{
            //   wx.navigateTo({
            //     url: '/pages/home/changeHouse/changeHouse',
            //   })
            // },1000)
          }
         })
        // setTimeout(()=>{
        //   wx.navigateBack({})
        // },1500)
      }
    })
  }
})