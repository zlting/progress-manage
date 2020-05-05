const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    paperId: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  type 0 投票活动 1 报名活动 2 问卷 3
    this.getDetail(options.id)
    this.setData({
      paperId: options.id
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
  getDetail(id) {
    app.func.request(`${app.api.nbPaperDetail}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var data = res.data
        data.nbPaperQuestionList.forEach(element => {
          element.questionInfoList.forEach(item => {
            item.changeType = false
          })
        });
        this.setData({
          list: data.nbPaperQuestionList,
        })
      }
    })
  },
  //选择答案
  changeAnswer(e) {
    const {
      list
    } = this.data
    const item = e.currentTarget.dataset
    const type = !list[item.index].questionInfoList[item.idx].changeType
    list[item.index].questionInfoList[item.idx].changeType = type
    if(list[item.index].questionType===0){
      list[item.index].questionInfoList.forEach(item=>{
        item.changeType=false
      })
      list[item.index].questionInfoList[item.idx].changeType = true
    }
    this.setData({
      list: [...list]
    })
  },
  //提交
  postSignUp() {
    const {
      list,
      paperId
    } = this.data
    for(let i=0;i<list.length;i++){
      if(!list[i].questionInfoList.find((item)=>{ return item.changeType===true})){
        app.func.showToast("请选择答案")
        return
      }
    }
    var obj = {}
    obj.paperId = paperId
    obj.nbPaperQuestionRecordList = []
    list.forEach((element,index) => {
      obj.nbPaperQuestionRecordList.push({
        paperQuestionId:element.id,
        answer:'',
        paperInfoIds:'',
      })
      element.questionInfoList.forEach(item => {
        if(item.changeType){
          obj.nbPaperQuestionRecordList[index].answer+= item.serialNum+ ",";
          obj.nbPaperQuestionRecordList[index].paperInfoIds += item.id+ ",";
        }
      })
    })
    obj.nbPaperQuestionRecordList.map(element => {
     element.answer= element.answer.substr(0, element.answer.length - 1)
     element.paperInfoIds= element.paperInfoIds.substr(0, element.paperInfoIds.length - 1)
    });
    app.func.request(`${app.api.nbPaperQuestionUser}`, obj, "POST").then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
        // this.getDetail(this.data.activityId)
      }
    })
  }

})