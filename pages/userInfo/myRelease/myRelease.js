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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
      app.func.request(app.api.indexUser, this.data.pages, "GET").then((res) => {
        ++this.data.pages.pageIndex
       
        res.data.list.forEach(item => { 
          item.img=JSON.parse(item.img)
          item.time = app.getDateDiff(item.time)
          // item.content="物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业"
          if (item.content && item.content.length > 50) {
            item.contentType = true
          } else {
            item.contentType = false
          }
        })
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
  //展开收起
  ellipsis(e) {
    const {
      list
    } = this.data
    var type = !e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    list[index].contentType = type
    this.setData({
      list: [...list]
    })
  },
  /**
   * 点赞
   */
  addLike(e) {
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
          list[index].likeNum+=1
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
          list[index].likeNum-=1
          this.setData({
            list: [...list]
          })
        }
      })
    }
  },
  //跳转到评论页面
  jumpEvalute(e){
    wx.navigateTo({
      url: '/pages/home/evaluate/evaluate?id='+e.currentTarget.dataset.id,
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