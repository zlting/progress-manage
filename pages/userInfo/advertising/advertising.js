const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:null,
    userMobile:null,
    businessName:null,
    businessAddress:null,
    userNameRecommend:null,
    userMobileRecommend:null,
    bannerList:[],
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail()
  },
   /**
   * 
   * @param {*} e 
   */
  async jumpadDetail(e) {
    if (await app.setUserInfo()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/htmlDetail/htmlDetail?id=${id}`,
      })
    }
  },
       /**
   * 
   * @param {*} e 
   * 轮播切换图标样式
   */
  change(e) {
    this.setData({
      index: e.detail.current
    })
  },
  getDetail(){
    app.func.request(`${app.api.getBanner}/RECOMMEND_ADER`, "", "GET").then(res => {
      if(res.code===200){
        this.setData({
          bannerList:res.data
        })
      }
    })
  },
  getName(e){
    console.log(e)
    this.setData({
      userName:e.detail.value
    })
  },
  getPhone(e){
    this.setData({
      userMobile:e.detail.value
    })
  },
  getBusinessName(e){
    this.setData({
      businessName:e.detail.value
    })
  },
  getBusinessAddress(e){
    this.setData({
      businessAddress:e.detail.value
    })
  },
  getName2(e){
    this.setData({
      userNameRecommend:e.detail.value
    })
  },
  getPhone2(e){
    this.setData({
      userMobileRecommend:e.detail.value
    })
  },
   //申请
   apply() {
    const {
      userName,
      userMobile,
      businessName,
      businessAddress,
      userNameRecommend,
      userMobileRecommend
    } = this.data
    if (!userName) {
      app.func.showToast("请输入您的真实姓名")
      return false
    }
    if (!userMobile) {
      app.func.showToast("请输入您的手机号")
      return false
    }
    if(!app.func.regPhone(userMobile)){
      app.func.showToast('手机号格式不正确')
      return
    }
    // if (!businessName) {
    //   app.func.showToast("请输入小区单位名称")
    //   return false
    // }
    if (!userNameRecommend) {
      app.func.showToast("请输入被推荐人姓名")
      return false
    }
    if (!userMobileRecommend) {
      app.func.showToast("请输入被推荐人手机号")
      return false
    }
    if(!app.func.regPhone(userMobileRecommend)){
      app.func.showToast('被推荐人手机号格式不正确')
      return
    }
    var obj = {}
    obj.userName = userName
    obj.userMobile = userMobile
    obj.businessName = businessName
    obj.businessAddress = businessAddress
    obj.userNameRecommend = userNameRecommend
    obj.userMobileRecommend = userMobileRecommend
    app.func.request(app.api.nbCommunityRecommend, obj, "POST").then((res) => {
      if (res.code === 200) {
        wx.showToast({
          title: '提交成功',
          icon: "success",
          duration: 1500
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/userInfo/index/index',
          })
        }, 1000)
      }
    })
  },
    //查看规则
    jumpRule(){
      wx.navigateTo({
        url: '/pages/userInfo/recommendSoft/recommendSoft?id=6',
      })
    },
})