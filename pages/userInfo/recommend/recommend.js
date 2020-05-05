const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:null,
    userMobile:null,
    communityName:null,
    userNameRecommend:null,
    userMobileRecommend:null,
    bannerList:[],
    index:0,
    content:""
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
    app.func.request(`${app.api.getBanner}/RECOMMEND_COMMUNITY`, "", "GET").then(res => {
      if(res.code===200){
        this.setData({
          bannerList:res.data
        })
      }
    })
    app.func.request(`${app.api.getRuleDetail}/7`, "", "GET").then(res => {
      if(res.code===200){
        this.setData({
          content:res.data.content
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
  getCommunityName(e){
    this.setData({
      communityName:e.detail.value
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
      communityName,
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
    if (!communityName) {
      app.func.showToast("请输入小区单位名称")
      return false
    }
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
    obj.communityName = communityName
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
        url: '/pages/userInfo/recommendSoft/recommendSoft?id=9',
      })
    },
})