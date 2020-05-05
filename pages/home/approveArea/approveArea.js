const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[],
    list:[],
    userInfo:{},
    distId:'',
    communityName:"",
    name:"松江区"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setUserInfo()
  },
  getList(distId,communityName){
    app.func.request(`${app.api.nbCommunityList}`, {distId:distId,communityName:communityName}, "GET").then(res => {
      if(res.code===200){
        this.setData({
          list:res.data
        })
      }
    })
  },
  bindRegionChange(e){
    this.setData({
      region:[...e.detail.value],
      distId:e.detail.code[2]
    },()=>{
      this.getList(e.detail.code[2],this.data.communityName)
    })
  },  
  getName(e){
    console.log(e)
    this.setData({
      communityName:e.detail.value
    })
  },
  search(){
    this.getList(this.data.distId,this.data.communityName)
  },
  //获取用户信息
  setUserInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
          name:res.data.currentCommunity.dist,
          distId:res.data.currentCommunity.distId
        },()=>{
          this.getList(res.data.currentCommunity.distId,this.data.communityName)
        })
      }
    })
  },
  //开通小区
  jumpApply(){
    wx.navigateTo({
      url: '/pages/home/openArea/openArea',
    })
  },
    //认证小区
    jumpJoin(e){
      console.log(e)
      const item=e.currentTarget.dataset.item
      // 共享区
      if(item.share){
        wx.navigateTo({
          url: `/pages/home/shareArea/shareArea?communityId=${item.id}&distId=${item.distId}&name=${item.communityName}&dist=${item.dist}`,
        })
      }else{
        wx.navigateTo({
          url: `/pages/home/attestationArea/attestationArea?communityId=${item.id}&distId=${item.distId}&dist=${item.dist}&name=${item.communityName}&authenticate=${item.authenticate}`,
        })
      }

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