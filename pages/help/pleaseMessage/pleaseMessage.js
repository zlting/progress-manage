const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    classify:[],
    communityId:null,
    info :null,
    userId:null,
    bottom:0
  },
 //用户点击tab时调用
 titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
},
//输入聚焦
foucus: function (e) {
  var that = this;
  console.log(e)
  that.setData({
    bottom: e.detail.height
  })
},
//失去聚焦
blur:function(e){
  var that = this;
  that.setData({
    bottom: 0
  })
},
getDetail(userInfoId,communityId){
  app.func.request(`${app.api.ability_detail}`, {userInfoId:userInfoId,communityId:communityId}, "GET").then(res => {
    if(res.code==200){
      res.data.abilityTag=res.data.abilityTag.split(",")
      this.setData({
        data:res.data,
        classify:{...this.data.classify}
      })
    }
  })
},
   /**
   * 点赞
   */
  addLike(e) {
    const {
      data
    } = this.data
    var type = !data.thumbUp;
    data.thumbUp = type
    if (type) {
      //点赞
      app.func.request(`${app.api.nbAbilityLike}`, {
        abilityIdentityId: data.id
      }, "POST").then(res => {
        if (res.code === 200) {
          data.likeNum+=1
          wx.showToast({
            title: '点赞成功',
            icon:"success",
            duration:2000
          })
          this.setData({
            data: {...data}
          })
        }
      })
    } else {
      //取消
      app.func.request(`${app.api.nbAbilityLikeCancle}`, {
        abilityIdentityId: data.id
      }, "POST").then(res => {
        if (res.code === 200) {
          data.likeNum-=1
          this.setData({
            data: {...data}
          })
        }
      })
    }
  },

  getInfo(e){
    this.setData({
      info:e.detail.value
    })
  },
  jumpSend(){
    const {info,userId}=this.data
    if(!info){
      app.func.showToast("请输入内容")
      return
    }
    app.func.request(`${app.api.sendMessage}`, {info:info,userId:userId,type:'ABILITY'}, "POST").then((res) => {
      if(res.code===200){
        wx.showToast({
          title: '您的留言已发送',
          icon:"sucess",
          duration:1500
        })
        setTimeout(()=>{
          wx.navigateBack({
            complete: (res) => {},
          })
        },1200)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.userInfoId,options.communityId)
    this.setData({
      communityId:options.communityId,
      userId:options.userInfoId
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