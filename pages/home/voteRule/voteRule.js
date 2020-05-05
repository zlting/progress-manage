const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
  },
  getDetail(id) {
    // 投票活动 1 报名活动 2 
    app.func.request(`${app.api.nbVoteDetail}/${id}`, "", "GET").then(res => {
      if (res.code === 200) {
        var data = res.data
        // data.startTime = app.dateFormat(data.startTime)
        // data.endTime = app.dateFormat(data.endTime)
        data.signStartTime = app.dateFormat(data.signStartTime)
        data.signEndTime = app.dateFormat(data.signEndTime)
        data.gmtCreate = app.dateFormat(data.gmtCreate)
        data.timingTime = data.timingTime ? app.dateFormat(data.timingTime) : ''
        wx.setNavigationBarTitle({
          title: data.activityState === 'NOT_STARTS' ? "投票活动详情（未开始）" : data.activityState === 'OVER' ? "投票活动详情（已结束）" : "投票活动详情（进行中）"
        })
        this.setData({
          obj: data,
        })
      }
    })
  },
  //投票
  postVote(e) {
    var that=this
    const item=e.currentTarget.dataset
    app.func.request(`${app.api.nbVoteVoting}`, {voteId:item.voteid,voteOptionId:item.id}, "POST").then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '投票成功',
          icon: 'success',
          duration: 2000
        })
        that.getDetail(item.voteid)
      }
    })
  }

})