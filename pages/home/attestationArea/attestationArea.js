const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusType:2,
    name:"",
    address:"",
    userInfo:{},
    certificate:null,
    communityId:"",
    distId:"",
    distAddress:null,
    province:null,
    city:null,
    dist:null,
    authenticate:true,
    alertType:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
    app.aliyunOss()
    this.setData({
      name:options.name,
      communityId:options.communityId,
      distId:options.distId,
      distAddress:options.dist,
      authenticate:options.authenticate=='true'?true:false,
      statusType:options.authenticate=='true'?2:1,
      province: wx.getStorageSync("province")|| null,
      city: wx.getStorageSync("city")|| null,
      dist: wx.getStorageSync("district")|| null,
    })
    console.log(wx.getStorageSync("province"),11111)
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
    this.setData({
      province: wx.getStorageSync("province") || null,
      city: wx.getStorageSync("city") || null,
      dist: wx.getStorageSync("district") || null,
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
  //获取用户信息
  setUserInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          userInfo:res.data,
          userName:res.data.userNames|| null
        })
      }
    })
  },
  getAddress(e){
    this.setData({
      address:e.detail.value
    })
  },
  /**
   * 获取地理位置
   */
  getLocation(){
    app.tosave((res)=>{
      console.log(res,"输出地理位置")
      var arr=res.split(",")
      this.setData({
        province: arr[0] || null,
        city:arr[1] || null,
        dist: arr[2]|| null,
      })
    })
  },
  getUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  apply(){
    const {certificate,address,statusType,province,dist,distAddress,userName}=this.data
    if(!userName){
      app.func.showToast("请输入姓名")
      return false
    }
    if(address===''){
      app.func.showToast("请填写地址信息")
      return false
    }
    if(statusType==1){
      if(!certificate){
        app.func.showToast("请上传居住凭证")
        return false
      }
    }
    if(statusType===2){
      if(!province){
        app.func.showToast("请先获取当前地理位置")
        return false
      }
      if(distAddress!=dist){
        app.func.showToast("当前位置与小区位置不符合")
        return false
      }
    }
    app.func.request(`${app.api.have_resident}`, {share:0,owner:statusType==1?1:0}, "GET").then(res => {
      if (res.code === 200) {
        if(res.data){
          this.jumpDetail()
        }
        this.setData({
          alertType: res.data
        })
      }
    })
  },
  cancle(){
    this.setData({
      alertType:true
    })
  },
  /**
   * 提交
   */
  jumpDetail(){
    const {certificate,address,communityId,distId,statusType,name,province,city,dist,distAddress,userName}=this.data
    if(address===''){
      app.func.showToast("请填写地址信息")
      return false
    }
    if(statusType==1){
      if(!certificate){
        app.func.showToast("请上传居住凭证")
        return false
      }
    }
    if(statusType===2){
      if(!province){
        app.func.showToast("请先获取当前地理位置")
        return false
      }
      if(distAddress!=dist){
        app.func.showToast("当前位置与小区位置不符合")
        return false
      }
    }
    var obj={}
    obj.address=address
    obj.certificate=certificate
    obj.communityId=communityId
    obj.distId=distId
    obj.userName = userName
    if(statusType===1){
      obj.province=""
      obj.city=""
      obj.dist=""
    }else{
      obj.province=province
      obj.city=city
      obj.dist=dist
    }
    obj.share=0
    obj.owner=statusType===1?1:0
    app.func.request(`${app.api.authenticate}`, obj, "POST").then(res => {
      this.setData({
        alertType:true
      })
      if(res.code===200){
        wx.showToast({
          title: '提交成功',
          icon:"success",
          duration:1000
        })
        setTimeout(()=>{
          wx.redirectTo({
            url: `/pages/home/submitSucess/submitSucess?type=${statusType}&name=${name}`,
          })
        },1000)
      }
    })

  },
  /**
   * 身份类型切换
   * @param {*} type ：string
   */
  jumpIcon(e){
    console.log(e)
    this.setData({
      statusType:e.currentTarget.dataset.type
    })
  }
})