const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: null,
    userMobile: null,
    businessName: null,
    businessAddress: null,
    bannerList:[],
    index:0,
    businessLicense: null,
    circleType:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aliyunOss()
    this.getDetail()
  },
  getDetail(){
    app.func.request(`${app.api.getBanner}/ADER`, "", "GET").then(res => {
      if(res.code===200){
        this.setData({
          bannerList:res.data
        })
      }
    })
  },
   /**
   * 
   * @param {*} e 
   */
  async jumpadDetail(e) {
    if (await app.setUserInfo()) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/htmlDetail/htmlDetail?id=${id}`,
      })
    }
  },
  getName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      userMobile: e.detail.value
    })
  },
  getBusinessName(e) {
    this.setData({
      businessName: e.detail.value
    })
  },
  getAddress(e) {
    this.setData({
      businessAddress: e.detail.value
    })
  },
    //上传图片
    uploadImg() {
      var that=this
      wx.chooseImage({
        count: 1,
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
                that.setData({
                  businessLicense:result
                })
                wx.hideLoading();
              },
            );
          }
        }
      })
    },
    changeCircle(){
      const {circleType}=this.data
      let type=!circleType
      this.setData({
        circleType:type
      })
    },
  //申请
  apply() {
    const {
      userName,
      userMobile,
      businessName,
      businessAddress,
      businessLicense,
      circleType
    } = this.data
    if (!userName) {
      app.func.showToast("请输入广告主姓名")
      return false
    }
    if (!userMobile) {
      app.func.showToast("请输入广告主联系电话")
      return false
    }
    if(!app.func.regPhone(userMobile)){
      app.func.showToast('手机号格式不正确')
      return
    }
    if(!circleType){
      app.func.showToast("请勾选阅读规则")
      return false
    }
    var obj = {}
    obj.userName = userName
    obj.userMobile = userMobile
    obj.businessName = businessName
    obj.businessAddress = businessAddress
    obj.businessLicense = businessLicense
    app.func.request(app.api.nbAdvertisersApply, obj, "POST").then((res) => {
      if (res.code === 200) {
        wx.showToast({
          title: '申请成功',
          icon: "success",
          duration: 1500
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/userInfo/index/index',
          })
        }, 1000)
      }
    })
  },
    //查看规则
    jumpRule(){
      wx.navigateTo({
        url: '/pages/help/ruleDetail/ruleDetail?id=5',
      })
    },
})