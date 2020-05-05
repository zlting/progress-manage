const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages:{pageIndex:1,pageSize:10},
    loadMore: true,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
   //获取发布信息列表
 getList: function (reload = false) {
  const {pages}=this.data
  if (reload) {
    pages.pageIndex = 1
    this.setData({
      page: {
        ...pages
      },
      list: [],
      loadMore: true
    })
  }
  if (this.data.loadMore) {
    app.func.request(`${app.api.nbMessageList}`, pages, "GET").then(res => {
        if(res.code===200){
          ++pages.pageIndex
          this.setData({
            list: this.data.list.concat(res.data.list),
            pages: {
              ...pages
            },
            loadMore: res.data.isLastPage ? false : true
          })
        }
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
    this.getList()
    app.getMsgNum((res)=>{
      if(res>0){
          wx.setTabBarBadge({
            index: 2,
            text: `${res}`
          })
      }
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
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    this.getList(true)
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

  },
  
  delect(){
    app.func.request(`${app.api.clearMsg}`, '', "POST").then(res => {
      if(res.code===200){
        this.getList(true)
        app.getMsgNum((res)=>{
          if(res>0){
              wx.setTabBarBadge({
                index: 2,
                text: `${res}`
              })
          }else{
            wx.removeTabBarBadge({
              index: 2,
            })
          }
        })
      }
    })
  },
  cancle(){
    var that=this
    wx.showModal({
      title:'',
      content: '是否清除所有通知？',
      cancelColor:"#666",
      confirmColor:"#F87A2F", 
      success (res) {
        if (res.confirm) {
          that.delect()
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})