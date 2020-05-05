const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: {
      pageIndex: 1,
      pageSize: 10
    },
    loadMore: true,
    list: [],
    show:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // communityId:
    const {pages}=this.data
    pages.communityId=options.communityId
    pages.userName=options.userName
    this.setData({
      pages:{...pages}
    },()=>{
      this.getList()
    })
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
      app.func.request(`${app.api.likeList}`, pages, "GET").then(res => {
        if (res.code === 200) {
          ++pages.pageIndex
          res.data.list.map(item=>{
            item.abilityTag=item.abilityTag.split(",")
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
    /**
   * 点赞
   */
  addLike(e) {
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
          list[index].likeNum+=1
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
          list[index].likeNum-=1
          this.setData({
            list: [...list]
          })
        }
      })
    }
  },
    //跳转到详情
    jumpDetail(e){
      wx.navigateTo({
        url: `/pages/help/capacity/capacity?userInfoId=${e.currentTarget.dataset.userinfoid}&communityId=${this.data.pages.communityId}`,
      })
    },
    getName(e){
      const {pages}=this.data
      pages.userName=e.detail.value
      this.setData({
        pages:{...pages},
        show:e.detail.value.length>0?true:false
      })
    },
    cancle(){
      const {pages}=this.data
      pages.userName=''
      this.setData({
        pages:{...pages},
        show:false
      })
    },
    //搜索
    search(){
      this.getList(true);
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