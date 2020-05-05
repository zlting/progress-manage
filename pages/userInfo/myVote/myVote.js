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
    this.getList()

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
    app.func.request(`${app.api.voteList}`, pages, "GET").then(res => {
        if(res.code===200){
          ++pages.pageIndex
          res.data.list.length>0&&res.data.list.map(item=>{
            item.gmtCreate=app.dateFormat(item.gmtCreate)
          })
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
jumpDetail(e){
  wx.navigateTo({
    url: '/pages/home/voteRule/voteRule?id='+e.currentTarget.dataset.item.voteId,
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

  }
})