const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    index:0,
    identityList:[],
    imgList:[],
    timeList:[],
    timeLimit:30,
    demandTitle:"",
    demandDetail:"",
    demandAmount:"",
    circleType:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
    app.aliyunOss()
    var arr=[]
    for(let i=1;i<=30;i++){
      arr.push(i)
    }
    this.setData({
      timeList:[...arr].reverse()
    })
  },
  //获取用户信息
    setUserInfo() {
      app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
        if (res.code === 200) {
          this.setData({
            userInfo: res.data,
          },()=>{
            this.getIdentityList()
          })
        }
      })
    },
     //小区列表
  getIdentityList(){
    app.func.request(app.api.getIdentityList, '', "GET").then((res) => {
      if(res.code===200){
        var arr=[]
        res.data.map(item=>{
          arr.push({communityName:item.communityName,communityId:item.communityId})
        })
        // arr.unshift({
        //   communityName:this.data.userInfo.currentCommunity.communityName,
        //   communityId:this.data.userInfo.currentCommunity.id,
        // })
        this.setData({
          identityList:[...arr],
        })
        // this.identityList
      }
    })
  },
  bindChange(e){
    this.setData({
      index:e.detail.value
    })
  },
  getMoney(e){
    this.setData({
      demandAmount:e.detail.value
    })
  },
  getDetail(e){
    this.setData({
      demandDetail:e.detail.value
    })
  },
    //上传图片
    uploadImg() {
      var that=this
      if (that.data.imgList.length >= 3) {
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
              (result)=> {
                that.data.imgList.push(result)
                var arr = that.data.imgList.splice(0, 3)
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
    //删除图片
    delect(e){
      console.log(e)
      const index=e.currentTarget.dataset.index
      this.data.imgList.splice(index,1)
      this.setData({
        imgList:[...this.data.imgList]
      })
    },
    getTitle(e){
      this.setData({
        demandTitle:e.detail.value
      })
    },
    bindTime(e){
      this.setData({
        timeLimit:this.data.timeList[Number(e.detail.value)]
      })
    },
    changeCircle(){
      const {circleType}=this.data
      let type=!circleType
      this.setData({
        circleType:type
      })
    },
    //发布
    jumpApply(){
      const {index,identityList,demandTitle,demandDetail,imgList,timeLimit,demandAmount,circleType}=this.data
      if(demandTitle==''){
        app.func.showToast("请输入求助标题")
        return false
      }
      if(demandDetail==''){
        app.func.showToast("请输入求助详情")
        return false
      }
      if(!circleType){
        app.func.showToast("请勾选阅读规则")
        return false
      }
      var obj={}
      obj.communityName=identityList[index].communityName
      obj.communityId=identityList[index].communityId
      obj.demandTitle=demandTitle
      obj.demandImg=imgList.join(',') 
      obj.demandDetail=demandDetail 
      obj.demandAmount=demandAmount
      obj.timeLimit=timeLimit
      app.func.request(`${app.api.nbDemandPost}`, obj, "POST").then(res => {
        if(res.code==200){
          wx.showToast({
            title: '发布成功',
            icon:"success",
            duration:1500
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: '/pages/userInfo/myTurn/myTurn',
            })
          },1000)
        }
      })

    },
    //查看规则
    jumpRule(){
      wx.navigateTo({
        url: '/pages/help/ruleDetail/ruleDetail?id=3',
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