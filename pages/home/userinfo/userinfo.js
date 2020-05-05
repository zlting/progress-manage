const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: {
      pageIndex: 1,
      pageSize: 5
    },
    loadMore: true,
    list: [],
    userInfo:{},
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser(options.userId)
    this.data.pages.userId=options.userId
    this.setData({
      pages:{...this.data.pages}
    },()=>{
      this.getList()
    })
  },
  getUser(userId){
    app.func.request(`${app.api.peopleInfo}`, {userId:userId}, "GET").then(res => {
      if(res.code===200){
        this.setData({
          userInfo:res.data
        },()=>{
          this.setUserInfo(userId)
        })
      }
    })
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
      app.func.request(`${app.api.check_user_info}`, pages, "GET").then(res => {
          if(res.code===200){
            ++pages.pageIndex
            res.data.list.map(item=>{
              item.img=JSON.parse(item.img)
              // if(JSON.parse(item.img).length==0){
              //   item.img = JSON.parse(item.img).length===0?"https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/hhcfpAwNecBKxm3bj5TwhCTEt5rT4EjNzz2Y":JSON.parse(item.img)[0]
              // }
              item.time=app.getDateDiff(item.time)
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
   //查看详情
    lookDetail(e) {
      wx.navigateTo({
        url: '/pages/home/messageDetail/messageDetail?id=' + e.currentTarget.dataset.id,
      })
  },
   /**
   * 点赞
   */
  async addLike(e) {
    if (await app.setUserInfo()) {
      const {
        list
      } = this.data
      var type = !e.currentTarget.dataset.isthumbup;
      var index = e.currentTarget.dataset.index;
      list[index].isThumbUp = type

      if (type) {
        //点赞
        app.func.request(`${app.api.nbBulletinLike}`, {
          bulletinId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum += 1
            // var obj = JSON.parse(wx.getStorageSync('indexObj'))
            // obj.likeNum = list[index].likeNum,
            // obj.isThumbUp = true
            // wx.setStorageSync('indexObj', JSON.stringify(obj))
            this.setData({
              list: [...list]
            })
          }
        })
      } else {
        //取消
        app.func.request(`${app.api.likeCancel}`, {
          bulletinId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum -= 1
            // var obj = JSON.parse(wx.getStorageSync('indexObj'))
            // obj.likeNum = list[index].likeNum,
            // obj.isThumbUp = false
            // wx.setStorageSync('indexObj', JSON.stringify(obj))
            this.setData({
              list: [...list]
            })
          }
        })
      }
    }
  },
   /**   
   * 预览图片  
   */
  previewImage: function (e) {
    const item = e.currentTarget.dataset
    wx.previewImage({
      current: item.src, // 当前显示图片的http链接  
      urls: item.item // 需要预览的图片http链接列表  
    })
  },
    //跳转到评论页面
    async jumpEvalute(e) {
      if (await app.setUserInfo()) {
        wx.navigateTo({
          url: '/pages/home/evaluate/evaluate?id=' + e.currentTarget.dataset.id,
        })
      }
    },
  /**
   * 屏蔽功能
   */
  jumpShield(){
    const {userInfo}=this.data
    // 取消屏蔽
    if(userInfo.shield){
      app.func.request(`${app.api.userShieldCancel}`, {shieldUserId:userInfo.id}, "POST").then(res => {
        if(res.code===200){
          this.getUser(userInfo.id)
        }
      })
    }else{
      app.func.request(`${app.api.userShield}`, {shieldUserId:userInfo.id}, "POST").then(res => {
        if(res.code===200){
          this.getUser(userInfo.id)
        }
      })
    }
  },
   //获取用户信息
   setUserInfo(userId) {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        if(userId==res.data.currentIdentity.userInfoId){
          this.setData({
            show:false
          })
        }
      }
    })
  },
    /**
   * 关注功能
   */
  jumpAttention(){
    const {userInfo}=this.data
    // 取消关注
    if(userInfo.attention){
      app.func.request(`${app.api.userAttentionCancel}`, {attentionUserId:userInfo.id}, "POST").then(res => {
        if(res.code===200){
          this.getUser(userInfo.id)
        }
      })
    }else{
      app.func.request(`${app.api.userAttention}`, {attentionUserId:userInfo.id}, "POST").then(res => {
        if(res.code===200){
          this.getUser(userInfo.id)
        }
      })
    }
  },
  // 投诉
  jumpComplain(){
    wx.navigateTo({
      url: '/pages/help/complain/complain?identityId='+this.data.pages.userId
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
    // const pages = getCurrentPages(); // 当前页面栈
    // if (pages.length > 1) {
    //   const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
    //   beforePage.getFun() || ''; // 触发父页面中的方法
    // }
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