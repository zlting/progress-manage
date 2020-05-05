const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityList: [{
        name: "我的发布",
        url: "pages/userInfo/myRelease/myRelease"
      },
      {
        name: "我的关注",
        url: "pages/userInfo/myInterest/myInterest"
      },
      {
        name: "我的报名",
        url: "pages/userInfo/myRegistration/myRegistration"
      },
      {
        name: "我的投票",
        url: "pages/userInfo/myVote/myVote"
      },
      {
        name: "我的问卷",
        url: "pages/userInfo/myQuestionnaire/myQuestionnaire"
      },
    ],
    mutualList: [{
        name: "我的能力",
        url: "pages/userInfo/myAbility/myAbility"
      },
      {
        name: "我的求助",
        url: "pages/userInfo/myTurn/myTurn"
      },
    ],
    jurisdictionList: [{
        name: "成为热心居民",
        url: "pages/userInfo/earnestPeople/earnestPeople"
      },
      {
        name: "成为广告主",
        url: "pages/userInfo/advertiser/advertiser"
      },
    ],
    recommendList: [{
        name: "推荐小区使用",
        url: "pages/userInfo/recommend/recommend"
      },
      {
        name: "推荐广告主",
        url: "pages/userInfo/advertising/advertising"
      },
      {
        name: "近邻二维码",
        url: "pages/userInfo/code/code"
      },
    ],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
    app.getMsgNum((res) => {
      if (res > 0) {
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
    this.getInfo()
    app.getMsgNum((res) => {
      if (res > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: `${res}`
        })
      }
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 授权
   */
  // 获取微信授权
  // getUserInfo(e) {
  //   var that=this
  //   let userInfo = e.target ? e.detail.userInfo : null;
  //   if (!userInfo) {
  //     wx.showToast({
  //       title: "拒绝授权，将无法使用本小程序全部功能，请重新获取授权！",
  //       icon: "none",
  //       mask: true
  //     });
  //     return;
  //   }
  //   wx.login({
  //     success(result) {
  //       if (result.code) {
  //         wx.showLoading({ title: "授权中...", mask: "true" });
  //         wx.getUserInfo({
  //           success(res) {
  //             const data = {
  //               headimgurl: res.userInfo.avatarUrl,
  //               nickname: res.userInfo.nickName,
  //               code: result.code
  //             };
  //             app.func.request(app.api.wxToken, data, "GET").then((res) => {
  //                 wx.hideLoading();
  //                 if (res.code===200) {
  //                   // wx.setStorageSync("token", JSON.parse(item.msg).token);
  //                   app.func.request(app.api.getUserInfo, '', "GET").then((res) => {
  //                     if(res.code===200){
  //                       that.setData({
  //                         userInfo:res.data,
  //                         scopeUserInfo:true
  //                       })
  //                     }
  //                   })
  //                 }
  //               })
  //               .catch(msg => {
  //                 // console.log(msg)
  //               });
  //           },
  //           // 获取失败，弹窗提示一键登录
  //           fail() {
  //             wx.hideLoading();
  //           }
  //         });
  //       }
  //     }
  //   });
  // },
  // 获取用户信息
  getInfo() {
    var _this = this
    app.func.request(app.api.getUserInfo, '', "GET").then((res) => {
      _this.setData({
        userInfo: res.data
      })
    })
  },
  //注册
  async register() {
    await app.setUserInfo()
  },
  /**
   * 
   * 个人信息
   */
  async jumpUser() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: "/pages/userInfo/changeUser/changeUser",
      })
    }
  },
  /**
   * 跳转url
   * @param {*} e 
   */
  async jumpDetail(e) {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: `/${e.currentTarget.dataset.url}`
      })
    }
  },
  /**
   * 跳转到红包
   */
  async jumpPacket() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: "/pages/userInfo/myPacket/myPacket"
      })
    }
  }
})