const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    identityList: [],
    index: 0,
    abilityTag: null,
    abilityDesc: null,
    abilityDetail: null,
    abilityImg: [],
    circleType:false
  },
  getUser() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo: res.data
        }, () => {
          this.getIdentityList()
        })
      }
    })
  },

  bindChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  getIdentityList() {
    // const user = this.data.userInfo.currentCommunity
    app.func.request(app.api.getIdentityList, '', "GET").then((res) => {
      if (res.code === 200) {
        var arr = []
        res.data.map(item => {
          arr.push({
            communityName:  item.communityName,
            communityId: item.communityId
          })
        })
        this.setData({
          identityList: [...arr],
        })
        // this.identityList
      }
    })
  },
  //上传图片
  uploadImg() {
    var that = this
    if (that.data.abilityImg.length >= 3) {
      app.func.showToast("您已超过最大图片限制")
      return
    }
    wx.chooseImage({
      count: 3,
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
            (result) => {
              that.data.abilityImg.push(result)
              var arr = that.data.abilityImg.splice(0, 3)
              that.setData({
                abilityImg: [...arr]
              })
              wx.hideLoading();
            },
          );
        }
      }
    })
  },
  //删除图片
  delect(e) {
    const index = e.currentTarget.dataset.index
    this.data.abilityImg.splice(index, 1)
    this.setData({
      abilityImg: [...this.data.abilityImg]
    })
  },
  getTag(e) {
      this.setData({
        abilityTag: e.detail.value
      })
  },
  getDesc(e) {
    this.setData({
      abilityDesc: e.detail.value
    })
  },
  getDetail(e) {
    this.setData({
      abilityDetail: e.detail.value
    })
  },
  //查看规则
  jumpRule() {
    wx.navigateTo({
      url: '/pages/help/ruleDetail/ruleDetail?id=2',
    })
  },
  changeCircle(){
    const {circleType}=this.data
    let type=!circleType
    this.setData({
      circleType:type
    })
  },
  //发布能力
  apply() {
    const {index,identityList,abilityTag,abilityDesc,abilityDetail,abilityImg,circleType}=this.data
    if(!circleType){
      app.func.showToast("请勾选阅读规则")
      return false
    }
    var data={}
    data.communityId=identityList[index].communityId
    data.abilityTag=abilityTag
    data.abilityDesc=abilityDesc
    data.abilityDetail=abilityDetail
    data.abilityImg=abilityImg.join(",")
    app.func.request(app.api.nbAbilityPost, data, "POST").then((res) => {
      if (res.code === 200) {
        wx.showToast({
          title: '发布成功',
          icon: "success",
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({})
        },1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
    app.aliyunOss()

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


})