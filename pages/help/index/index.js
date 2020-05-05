const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    moreHelpList: [],
    tabList: [],
    address: "松江共享区",
    userInfo: {},
    currectType: false,
    interval: 2000,
    duration: 500,
    currentIndex: 0,
    pages: {
      pageIndex: 1,
      pageSize: 10
    },
    loadMore: true,
    list: [],
    imgUrls: [],
    returnType:true,

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
  //用户点击tab时调用
  titleClick: function (e) {
    const {
      tabList,
      pages
    } = this.data
    const index = e.currentTarget.dataset.idx
    if (index === 0) {
      delete pages.classifyId
    } else {
      pages.classifyId = tabList[index].id
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: index,
      pages: {
        ...pages
      }
    }, () => {
      this.getList(true)
    })
  },
  //发布
  async jumpShow() {
    if (await app.setUserInfo()) {
      this.setData({
        show: true
      })
    }
  },
  //关闭
  cancleShow() {
    this.setData({
      show: false
    })
  },
    //跳转详情
  jumpHelpDetail(e){
    console.log(e)
    const item=e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/help/helpDetail/helpDetail?id=${item.id}&userId=${item.userinfoid}`,
    })
  },
  //用户信息
  getInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
          address: res.data.currentCommunity ? res.data.currentCommunity.communityName : "松江共享区"
        }, () => {
          this.currectDetail()
          this.getList(true)
        })
      }
    })
  },

  //当前正在进行的我的求助
  currectDetail() {
    app.func.request(`${app.api.current_demandDetail}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          currectType: res.data ? true : false
        })
      }
    })

    app.func.request(`${app.api.getBanner}/HELP`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    app.func.request(`${app.api.moneyList}`, {
      over: false,
      communityId: this.data.userInfo.currentCommunity.id
    }, "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          moreHelpList: res.data
        })
      }
    })
    /**分类 */
    app.func.request(`${app.api.nbAbilityClassify}`, {
      communityId: this.data.userInfo.currentCommunity.id
    }, "GET").then(res => {
      if (res.code === 200) {
        var arr = [{
          typeName: "居民能力"
        }]
        this.setData({
          tabList: [...arr, ...res.data]
        })
      }
    })
  },
  //获取发布信息列表
  getList: function (reload = false) {
    const {
      pages
    } = this.data
    pages.communityId = this.data.userInfo.currentCommunity.id
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
      app.func.request(`${app.api.likeList}`, pages, "GET").then(res => {
        if (res.code === 200) {
          ++pages.pageIndex
          res.data.list.map(item => {
            item.abilityTag = item.abilityTag.split(",")
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
  async jumpadDetail(e) {
    if (await app.setUserInfo()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/htmlDetail/htmlDetail?id=${id}`,
      })
    }
  },
  /**
   * 点赞
   */
  async addLike(e) {
    if (await app.setUserInfo()) {
      const {
        list
      } = this.data
      var type = !e.currentTarget.dataset.thumbup;
      var index = e.currentTarget.dataset.index;
      list[index].thumbUp = type
      if (type) {
        //点赞
        app.func.request(`${app.api.nbAbilityLike}`, {
          abilityIdentityId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum += 1
            this.setData({
              list: [...list]
            })
          }
        })
      } else {
        //取消
        app.func.request(`${app.api.nbAbilityLikeCancle}`, {
          abilityIdentityId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum -= 1
            this.setData({
              list: [...list]
            })
          }
        })
      }
    }
  },
  //搜索
  async jumpSerch() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: '/pages/help/searchTitle/searchTitle?communityId=' + this.data.userInfo.currentCommunity.id,
      })
    }
  },
  //发布能力
  jumpAcity() {
    wx.navigateTo({
      url: '/pages/help/issueCapacity/issueCapacity',
    })
  },
  //跳转到详情
  async jumpDetail(e) {
    if (await app.setUserInfo()) {
      const item=e.currentTarget.dataset
      const {userInfo}=this.data
      var helpObj={
        index:item.index
      }
      wx.setStorageSync('helpObj', JSON.stringify(helpObj))
      wx.navigateTo({
        url: `/pages/help/capacity/capacity?userInfoId=${item.userinfoid}&communityId=${userInfo.currentCommunity.id}`,
      })
    }
  },
  //发布求助
  jumpCurrent() {
    const {
      currectType
    } = this.data
    if (currectType) {
      app.func.showToast("当前有进行中的求助，正在跳转...")
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/userInfo/myTurn/myTurn',
        })
      }, 1500)
      return
    } else {
      wx.navigateTo({
        url: '/pages/userInfo/applyTrun/applyTrun',
      })
    }
  },
  //更多求助
  async jumpMore() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: '/pages/help/moreSos/moreSos?communityId=' + this.data.userInfo.currentCommunity.id,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(11111)
  },
  getFun(){
    this.setData({
      returnType:false
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
  onShow: function (e) {
    const {returnType}=this.data
    if(returnType){
      this.setData({
        loadMore:true,
        show:false
      },()=>{
        this.getInfo()
      }) 
    }else{
        var obj=JSON.parse(wx.getStorageSync('helpObj'))|| {}
        if(obj.likeNum!=null){
          const {list}=this.data
          console.log(list)
          list[obj.index].likeNum = obj.likeNum,
          list[obj.index].thumbUp =  obj.thumbUp
          this.setData({
            list
          })
        }
    }
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
    this.setData({
      returnType:true
    })
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
      this.setData({
        loadMore:true,
        returnType:true,
        show:false
      },()=>{
        this.getInfo()
      })
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