const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: {
      pageIndex: 1,
      pageSize: 10,
      over:1,
      communityId:""
    },
    loadMore: true,
    list: [],
    arrList:[],
    name:'',
    identityList:[]
  },

  onLoad: function (options) {
    this.getIdentityList()
  },
  getList(reload = false) {
    if (reload) {
      this.data.pages.pageIndex = 1
      this.setData({
        page: {
          ...this.data.pages
        },
        list: [],
        loadMore: true
      })
    }
    if (this.data.loadMore) {
      app.func.request(app.api.my_demand, this.data.pages, "GET").then((res) => {
        ++this.data.pages.pageIndex
        res.data.list.map(item=>{
          item.closeTime=app.dateFormat(item.closeTime)
        })
        this.setData({
          list: this.data.list.concat(res.data.list),
          pages: {
            ...this.data.pages
          },
          loadMore: res.data.isLastPage ? false : true
        })
      })
    }
  },
  // getUser(){
  //   app.func.request(`${app.api.getUserInfo}`,"","GET").then(res=>{
  //     if(res.code===200){
  //       this.setData({
  //         userInfo:res.data
  //       },()=>{
          
  //       })
  //     } 
  //   })
  // },
  //小区列表
  getIdentityList(){
    app.func.request(app.api.getIdentityList, '', "GET").then((res) => {
      if(res.code===200){
        var arr=[]
        // ${item.province} ${item.city} ${item.dist} ${item.address}
        res.data.map(item=>{
          arr.push(` ${item.communityName}`)
        })
        this.data.pages.communityId=res.data[0].communityId
        this.setData({
          name:arr[0],
          identityList:[...arr],
          arrList:res.data,
          pages:{...this.data.pages}
        },()=>{
          this.getList()
        })
        // this.identityList
      }
    })
  },
  bindPickerChange(e){
    const {identityList,arrList,pages}=this.data
    const index=e.detail.value
    pages.communityId=arrList[index].communityId,
    this.setData({
      name:identityList[index],
    },()=>{
      this.getList(true);
    })
  },
  /**
   * 跳转到详情
   */
  jumpDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/userInfo/turnDetail/turnDetail?id='+e.currentTarget.dataset.id,
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
  //历史求助
  jumpHistory(){
    wx.navigateTo({
      url: '/pages/userInfo/oldTrun/oldTrun',
    })
  },
  //申请求助
  jumpHistory(){
    wx.navigateTo({
      url: '/pages/userInfo/applyTrun/applyTrun',
    })
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(true);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})