const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[],
    communityName:"",
    address:"",
    certificate:null,
    obj:{},
    index:0,
    bannerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.aliyunOss()
      this.getList()

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
    // 入驻列表
    getList(){
      app.func.request(`${app.api.getBanner}/WISH_COMMUNITY`, "", "GET").then(res => {
        if(res.code===200){
          this.setData({
            bannerList:res.data
          })
        }
      })
    },
    async jumpadDetail(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/pages/home/htmlDetail/htmlDetail?id=${id}`,
        })
    },
  bindRegionChange(e){
    console.log(e)
    const {obj}=this.data
    const data=e.detail
    obj.province=data.value[0]
    obj.city=data.value[1]
    obj.dist=data.value[2]
    obj.provinceId=data.code[0]
    obj.cityId=data.code[1]
    obj.distId=data.code[2]
    this.setData({  
      region:[...e.detail.value],
      obj:{...obj}
    })
  }, 
  getName(e){
    this.setData({
      communityName:e.detail.value
    })
  },
  getAddress(e){
    this.setData({
      address:e.detail.value
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
                certificate:result
              })
              wx.hideLoading();
            },
          );
        }
      }
    })
  },
  //提交
  apply(){
    const {obj,address,communityName,certificate}=this.data
    if(!obj.province){
      app.func.showToast("请选择地区")
      return false
    }
    if(communityName===''){
      app.func.showToast("请填写小区名称")
      return false
    }
    if(address===''){
      app.func.showToast("请填写具体地址")
      return false
    }
    if(!certificate){
      app.func.showToast("请上传居住凭证")
      return false
    }
    obj.communityName=communityName
    obj.address=address
    obj.certificate=certificate
    app.func.request(`${app.api.nbCommunityApply}`, obj, "POST").then(res => {
      if(res.code===200){
        wx.showToast({
          title: '提交成功',
          icon:"success",
          duration:1000
        })
        setTimeout(()=>{
          wx.redirectTo({
            url: '/pages/home/submitSucess/submitSucess?type=1',
          })
        },1000)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})