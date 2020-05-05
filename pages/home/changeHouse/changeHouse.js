const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [''],
    index: 0,
    bannerList: [],
    userInfo:{},
    jumpType:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 
   * @param {*} e 
   * 轮播切换图标样式
   */
  change(e) {
    this.setData({
      index: e.detail.current
    })
  },
  // 入驻列表
  getList() {
    app.func.request(`${app.api.getIdentityList}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          list: res.data
        })
      }
    })
    app.func.request(`${app.api.getBanner}/COMMUNITY`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          bannerList: res.data
        })
      }
    })
  },
  jumpadDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/htmlDetail/htmlDetail?id=${id}`,
    })
  },
  /**
   * 认证小区列表
   */
  jumpApprove() {
    wx.navigateTo({
      url: '/pages/home/approveArea/approveArea',
    })
  },
  //切换小区
  changeCity(e) {
    const item = e.currentTarget.dataset.item
    app.func.request(`${app.api.checkIdentity}/${item.id}`, '', "POST").then(res => {
      if (res.code === 200) {
        wx.removeStorage({
          key: 'newOne',
        })
        wx.switchTab({
          url: '/pages/home/index/index',
        })
      }
    })
  },
  getPhoneNumber(e) {
    console.log(e)
    var that = this
    let userInfo = e.target ? e.detail.encryptedData : null;
    if (!userInfo) {
      wx.showToast({
        title: "拒绝授权，将无法使用本小程序全部功能，请重新获取授权！",
        icon: "none",
        mask: true
      });
      return;
    }
    wx.login({
      success(result) {
        if (result.code) {
          wx.showLoading({
            title: "获取中...",
            mask: "true"
          });
          const data = {
            encrypted: e.detail.encryptedData,
            code: result.code,
            iv: e.detail.iv
          };
          app.func.request(app.api.getPhone, data, "GET").then((res) => {
            wx.hideLoading();
            if (res.code === 200) {
              app.func.request(app.api.coreLogin, {userMobile:res.data}, "POST").then(value => {
                if(value.code===200){
                  app.func.showToast("获取成功")
                      wx.navigateTo({
                        url: '/pages/home/approveArea/approveArea',
                      })
                }
              })
             
            }
          })
        }
      }
    });
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
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(item=>{
      if(item.code===200){
        this.setData({
          userInfo:item.data,
          jumpType:item.data.register?true:false
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
    const pages = getCurrentPages(); // 当前页面栈
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
      beforePage.onLoad(); // 触发父页面中的方法
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1200
    });
    this.getList()
    wx.stopPullDownRefresh()
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

  },

})