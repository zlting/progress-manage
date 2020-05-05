const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    obj:{},
    identityList:[],
    index:0
  },
  //用户点击tab时调用
  titleClick: function (e) {
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  getUser(){
    app.func.request(`${app.api.getUserInfo}`,"","GET").then(res=>{
      if(res.code===200){
        this.getDetail(res.data.currentCommunity.id)
        this.setData({
          userInfo:res.data
        },()=>{
          this.getIdentityList()
        })
      } 
    })
  },
  getDetail(communityId){
    app.func.request(`${app.api.myAbility}/${communityId}`, '', "GET").then(res => {
      if(res.code===200){
        (res.data.abilityDetailList&& res.data.abilityDetailList.length)>0 && res.data.abilityDetailList.map(item=>{
            item.abilityImg=item.abilityImg.split(",")
          })
          this.setData({  
            obj:res.data
          })
      }
    })
  },
  bindChange(e){
    const {identityList}=this.data
    this.setData({
      index:e.detail.value
    },()=>{
      this.getDetail(identityList[e.detail.value].communityId)
    })
  },
  getIdentityList(){
    // const user=this.data.userInfo.currentCommunity
    app.func.request(app.api.getIdentityList, '', "GET").then((res) => {
      if(res.code===200){
        var arr=[]
        res.data.map(item=>{
          arr.push({communityName:item.communityName,communityId:item.communityId})
        })
        // arr.unshift({
        //   communityName:user.dist+user.communityName,
        //   communityId:user.id,
        // })
        this.setData({
          identityList:[...arr],
        })
        // this.identityList
      }
    })
  },
   addLike() {
    const {
      obj
    } = this.data
    var type = !obj.thumbUp;
    obj.thumbUp = type
    if (type) {
      //点赞
      app.func.request(`${app.api.nbAbilityLike}`, {
        abilityIdentityId:obj.id
      }, "POST").then(res => {
        if (res.code === 200) {
         obj.likeNum+=1
          this.setData({
            obj: {...obj}
          })
        }
      })
    } else {
      //取消
      app.func.request(`${app.api.nbAbilityLikeCancle}`, {
        abilityIdentityId:obj.id
      }, "POST").then(res => {
        if (res.code === 200) {
         obj.likeNum-=1
          this.setData({
            obj: {...obj}
          })
        }
      })
    }
  },
  //发布能力
  jumpNbAbility(){
    wx.navigateTo({
      url: '/pages/help/issueCapacity/issueCapacity',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getUser()
  },

 
})