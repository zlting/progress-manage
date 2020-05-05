const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: true,
    bulletinContent: "",
    list: [],
    bulletinTypeId: "",
    imgList:[],
    typeName: null,
    share:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.msgDetail()
    app.aliyunOss()
    this.setData({
      share:options.share=='true'?true:false
    })
  },
  msgDetail() {
    app.func.request(`${app.api.classify}`, '', "GET").then(res => {
      if (res.code === 200) {
        var arr = []
        res.data.map(res => {
          arr.push(
            res.typeName,
          )
        })
        this.setData({
          list: [...arr],
          array: res.data
        })
      }
    })
  },
  switch1Change(e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
  bindPickerChange(e) {
    const index = e.detail.value
    const {
      array
    } = this.data
    this.setData({
      bulletinTypeId: array[index].id,
      typeName: array[index].typeName,
    })
  },
  /**
   * 发布
   */
  send() {
    var {
      bulletinTypeId,
      bulletinContent,
      evaluate,
      imgList
    } = this.data
    evaluate = evaluate ? 1 : 0
    if (bulletinContent == '') {
      app.func.showToast("请输入信息内容")
      return false
    }
    app.func.request(`${app.api.nbBulletin}`, {
      bulletinContent: bulletinContent,
      bulletinTypeId: bulletinTypeId,
      evaluate: evaluate,
      bulletinImg: imgList
    }, "POST").then(res => {
      if (res.code === 200) {
        // app.func.showToast("发布成功")
        wx.showToast({
          title: '发布成功',
          icon:"success",
          duration:1500
        })
        setTimeout(()=>{
          wx.navigateBack({
            complete: (res) => {},
          })
        },1200)
      }
    })
  },
   //删除图片
   delect(e){
    console.log(e)
    const index=e.currentTarget.dataset.index
    this.data.imgList.splice(index,1)
    this.setData({
      imgList:[...this.data.imgList]
    })
  },
  //
  uploadImg() {
    var that=this
    // const {imgList}=that.data
    if (that.data.imgList.length >= 9) {
      app.func.showToast("您已超过最大图片限制")
      return
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        for (let path of tempFilePaths) {
          wx.showLoading({
            title: '上传中..',
            mask: true
          })
          app.uploadFile(
            path,
            (result)=> {
              that.data.imgList.push(result)
              var arr = that.data.imgList.splice(0, 9)
              that.setData({
                imgList:[...arr]
              })
              wx.hideLoading();
            },
          );
        }
      }
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

  getBulletinContent(e) {
    this.setData({
      bulletinContent: e.detail.value
    })
  }
})