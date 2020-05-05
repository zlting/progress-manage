const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    identityList: [],
    index: 0,
    userName: null,
    applyMsg: null,
    indexType:0,
    bannerList:[],
    circleType:false
  },
    /**
   * 
   * @param {*} e 
   * 轮播切换图标样式
   */
  change(e) {
    this.setData({
      indexType: e.detail.current
    })
  },
  changeCircle(){
    const {circleType}=this.data
    let type=!circleType
    this.setData({
      circleType:type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
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
  //获取用户信息
  setUserInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
        }, () => {
          this.getIdentityList()
        })
      }
    })
    app.func.request(`${app.api.getBanner}/PERSON`, "", "GET").then(res => {
      if(res.code===200){
        this.setData({
          bannerList:res.data
        })
      }
    })
  },
  //小区列表
  getIdentityList() {
    app.func.request(app.api.getIdentityList, '', "GET").then((res) => {
      if (res.code === 200) {
        var arr = []
        res.data.map(item => {
          arr.push({
            communityName: item.communityName,
            communityId: item.communityId
          })
        })
        this.setData({
          identityList: arr,
        })
      }
    })
  },
  bindChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  getMsg(e) {
    this.setData({
      applyMsg: e.detail.value
    })
  },
  //查看规则
  jumpRule() {
    wx.navigateTo({
      url: '/pages/help/ruleDetail/ruleDetail?id=4',
    })
  },
  //申请
  apply(){
    const {userName,applyMsg,identityList,index,circleType}=this.data
    if(!userName){
      app.func.showToast("请输入姓名")
      return false
    }
    if(!applyMsg){
      app.func.showToast("请输入申请理由")
      return false
    }
    if(!circleType){
      app.func.showToast("请勾选阅读规则")
      return false
    }
    var obj={}
    obj.communityName=identityList[index].communityName
    obj.communityId=identityList[index].communityId
    obj.userName=userName
    obj.applyMsg=applyMsg 
    app.func.request(app.api.nbEnthusiastic, obj, "POST").then((res) => {
      if(res.code===200){
        wx.showToast({
          title: '申请成功',
          icon:"success",
          duration:1500
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/userInfo/index/index',
          })
        },1000)
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