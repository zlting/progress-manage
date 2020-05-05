const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    classify: [],
    communityId: null,
    type: true
  },
  //用户点击tab时调用
  titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
  },
  getDetail(userInfoId, communityId) {
    app.func.request(`${app.api.ability_detail}`, {
      userInfoId: userInfoId,
      communityId: communityId
    }, "GET").then(res => {
      if (res.code == 200) {
        res.data.abilityDetailList.map(item => {
          this.data.classify.push(item.abilityTag)
          item.abilityImg = item.abilityImg.split(",")
        })
        this.setData({
          data: res.data,
          classify: {
            ...this.data.classify
          }
        }, () => {
          this.setUserInfo(userInfoId)
        })
      }
    })
  },
  //获取用户信息
  setUserInfo(userInfoId) {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        if (userInfoId == res.data.currentIdentity.userInfoId) {
          this.setData({
            type: false
          })
        }
      }
    })
  },
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    const {
      currentIndex
    } = this.data
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.data.abilityDetailList[currentIndex].abilityImg // 需要预览的图片http链接列表  
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
          data.likeNum += 1
          if (wx.getStorageSync('helpObj') != '') {
            var obj = JSON.parse(wx.getStorageSync('helpObj'))
            obj.likeNum = data.likeNum,
            obj.thumbUp = true
            wx.setStorageSync('helpObj', JSON.stringify(obj))
          }
          wx.showToast({
            title: '点赞成功',
            icon: "success",
            duration: 2000
          })
          this.setData({
            data: {
              ...data
            }
          })
        }
      })
    } else {
      //取消
      app.func.request(`${app.api.nbAbilityLikeCancle}`, {
        abilityIdentityId: data.id
      }, "POST").then(res => {
        if (res.code === 200) {
          data.likeNum -= 1
          if (wx.getStorageSync('helpObj') != '') {
            var obj = JSON.parse(wx.getStorageSync('helpObj'))
            obj.likeNum = data.likeNum,
              obj.thumbUp = false
            wx.setStorageSync('helpObj', JSON.stringify(obj))
          }
          this.setData({
            data: {
              ...data
            }
          })
        }
      })
    }
  },
  //投诉
  jumpComplainant() {
    wx.navigateTo({
      url: '/pages/help/complain/complain?identityId=' + this.data.data.identityId,
    })
  },
  //帮忙
  jumpHelp() {
    const {
      data,
      communityId
    } = this.data
    wx.navigateTo({
      url: `/pages/help/pleaseMessage/pleaseMessage?userInfoId=${data.userInfoId}&communityId=${communityId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.userInfoId, options.communityId)
    this.setData({
      communityId: options.communityId
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const pages = getCurrentPages(); // 当前页面栈
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
      beforePage.getFun(); // 触发父页面中的方法
    }
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