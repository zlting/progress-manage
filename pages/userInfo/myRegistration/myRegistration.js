const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["全部", "未开始", '进行中', "已结束"],
    currentIndex: 0,
    pages: {
      pageIndex: 1,
      pageSize: 10,
    },
    loadMore: true,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      console.log(e)
      const {pages}=this.data
      let currentPageIndex = e.detail.current
      // 活动状态 NOT_STARTS:未开始 PROCESSING:进行中 OVER:已结束	
      if(currentPageIndex==0){
        delete pages.activityState
      }
      if(currentPageIndex==1){
        pages.activityState='NOT_STARTS'
      }
      if(currentPageIndex==2){
        pages.activityState='PROCESSING'
      }
      if(currentPageIndex==3){
        pages.activityState='OVER'
      }
      this.setData({
        currentIndex: currentPageIndex
      },()=>{
        this.getList(true)
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    const {pages}=this.data
    const index=e.currentTarget.dataset.idx
    // 活动状态 NOT_STARTS:未开始 PROCESSING:进行中 OVER:已结束	
    if(index==0){
      delete pages.activityState
    }
    if(index==1){
      pages.activityState='NOT_STARTS'
    }
    if(index==2){
      pages.activityState='PROCESSING'
    }
    if(index==3){
      pages.activityState='OVER'
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex:index ,
      pages:{...pages}
    },()=>{
      this.getList(true)
    })
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
      app.func.request(app.api.activityList, this.data.pages, "get").then((res) => {
        if (res.code == 200) {
          ++this.data.pages.pageIndex
          let data = res.data.list;
          data.length>0&&data.map(item=>{
            item.releaseTime=app.dateFormat(item.releaseTime)
            // item.address=item.province + item.city + item.dist + item.detail
          })
          this.setData({
            list: this.data.list.concat(data),
            pages: {
              ...this.data.pages
            },
            loadMore: res.data.isLastPage ? false : true
          })
        }
      })
    }
  },
  // 详情
  jumpDetail(e){
    wx.navigateTo({
      url: '/pages/userInfo/applyDetail/applyDetail?id='+e.currentTarget.dataset.id,
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
    this.getList(true)
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