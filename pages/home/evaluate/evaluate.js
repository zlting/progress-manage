var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    bulletinMsg: "",
    inputShowed: false,
    item: null,
    bulletinId: "",
    bottom: 0
  },

  onLoad: function (options) {
    this.getDetail(options.id)
    this.setData({
      bulletinId: options.id
    })
  },
  //输入聚焦
  foucus: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      bottom: e.detail.height
    })
  },
  //失去聚焦
  blur: function (e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.obj.bulletinImg // 需要预览的图片http链接列表  
    })
  },

  /**
   * 评论框焦点获取监听
   */
  getValue(e) {
    this.setData({
      bulletinMsg: e.detail.value
    })
  },
  getDetail(id) {
    app.func.request(`${app.api.nbBulletinDetail}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var {
          data
        } = res
        data.gmtCreate = app.getDateDiff(data.gmtCreate)
        data.evaluateList.map(item => {
          item.gmtCreate = app.dateFormat(item.gmtCreate)
          if (item.childList.length > 0) {
            item.childList.map(val => {
              val.gmtCreate = app.dateFormat(val.gmtCreate)
            })
          }
        })
        this.setData({
          obj: data,
        })
      }
    })
  },
  /**
   * 回复评论
   */
  apply(e) {
    this.setData({
      inputShowed: true,
      item: e.currentTarget.dataset.item
    })
    console.log(e)
  },
  //发布
  jumpIssue() {
    const {
      bulletinMsg,
      item,
      bulletinId
    } = this.data
    if (bulletinMsg === '') {
      app.func.showToast("请输入内容")
      return false
    }
    // console.log(item)
    var obj = {}

    if (!item) {
      obj.reply = 0
      obj.commonEvaluateId = ""
      obj.parentEvaluateId = ""
      obj.bulletinId = bulletinId
      obj.bulletinMsg = bulletinMsg
      obj.targetUserId = ""
    } else {
      obj.reply = 1
      obj.parentEvaluateId = item.id
      obj.commonEvaluateId = item.commonEvaluateId != 0 ? item.parentEvaluateId : item.id
      obj.bulletinId = bulletinId
      obj.bulletinMsg = bulletinMsg
      obj.targetUserId = item.userInfoId
    }
    app.func.request(`${app.api.nbBulletinEvaluate}`, obj, "POST").then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          item: null,
          bulletinMsg: ""
        })
        this.getDetail(bulletinId)
      }
    })
  },
  /**
   * 点赞
   */
  addLike() {
    const {
      obj
    } = this.data
    var type = !obj.isThumbUp;
    if (type) {
      //点赞
      app.func.request(`${app.api.nbBulletinLike}`, {
        bulletinId: obj.id
      }, "POST").then(res => {
        if (res.code === 200) {
          obj.isThumbUp = type
          obj.likeList.length += 1
          this.setData({
            obj: {
              ...obj
            }
          })
        }
      })
    } else {
      //取消
      app.func.request(`${app.api.likeCancel}`, {
        bulletinId: obj.id
      }, "POST").then(res => {
        if (res.code === 200) {
          obj.isThumbUp = type
          obj.likeList.length -= 1
          this.setData({
            obj: {
              ...obj
            }
          })
        }
      })
    }
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // const pages = getCurrentPages(); // 当前页面栈
    // if (pages.length > 1) {
    //   const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
    //   beforePage.getFun() || ''; // 触发父页面中的方法
    // }
  },


})