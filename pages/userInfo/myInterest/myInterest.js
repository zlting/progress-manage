const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["已关注", "已屏蔽"],
    currentIndex: 0,
    pages: {
      pageIndex: 1,
      pageSize: 10
    },
    loadMore: true,
    list: [],
    url: app.api.attentionList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  // attentionList:baseUrl + '/core/attention',//我的关注
  // shieldList:baseUrl + '/core/shield',//我的屏蔽
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
      app.func.request(this.data.url, this.data.pages, "GET").then((res) => {
        ++this.data.pages.pageIndex
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
  getFun(){

  },
  //取消屏蔽或者关注
  jumpCancel(e) {
    const data = e.currentTarget.dataset
    console.log(e)
    if (data.type) {
      app.func.request(`${app.api.removeUserShield}/${data.item.id}`, '', "GET").then((res) => {
        if (res.code === 200) {
          app.func.showToast("取消成功")
          this.data.list.splice(data.index, 1)
          this.setData({
            list: [...this.data.list]
          })
        }
      })
    } else {
      app.func.request(`${app.api.removeUserAttention}/${data.item.id}`, '', "GET").then((res) => {
        if (res.code === 200) {
          app.func.showToast("取消成功")
          this.data.list.splice(data.index, 1)
          this.setData({
            list: [...this.data.list]
          })
        }
      })
    }
  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      // currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex,
        url: currentPageIndex ? app.api.shieldList : app.api.attentionList
      }, () => {
        this.getList(true);
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    const index = e.currentTarget.dataset.idx
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: index,
      list: [],
      url: index ? app.api.shieldList : app.api.attentionList
    }, () => {
      this.getList(true);
    })

  },
  jumpDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/home/userinfo/userinfo?userId='+ e.currentTarget.dataset.userid,
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