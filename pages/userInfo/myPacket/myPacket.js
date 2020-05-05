const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
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
    this.getList()
    this.getMony()
  },
  //获取发布信息列表
  getList: function (reload = false) {
    const {
      pages
    } = this.data
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
      app.func.request(`${app.api.nbRedPackRecord}/`, pages, "GET").then(res => {
          ++pages.pageIndex
          res.list.map(item=>{
            item.gmtCreate=app.dateFormat(item.gmtCreate)
            item.deliverDate=app.dateFormat(item.deliverDate)
            item.money=(item.money).toFixed(2)
          })
          this.setData({
            list: this.data.list.concat(res.list),
            pages: {
              ...pages
            },
            loadMore: res.isLastPage ? false : true
          })
      })
    }
  },
  getMony(){
    app.func.request(`${app.api.nbRedPackRecordTotal}`, '', "GET").then(res => {
      if(res.code===200){
        this.setData({
          data:res.data
        })
      }
    })

  },
  //跳转到详情
  jumpDetail(e){
    wx.navigateTo({
      url: '/pages/userInfo/packetDetail/packetDetail?id='+e.currentTarget.dataset.id,
    })
  },
  jumpLeft() {
    wx.navigateTo({
      url: '/pages/userInfo/leftPacketRecord/leftPacketRecord?type=true',
    })
  },
  jumpRight() {
    wx.navigateTo({
      url: '/pages/userInfo/leftPacketRecord/leftPacketRecord?type=false',
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

  },


})