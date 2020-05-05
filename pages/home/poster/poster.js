const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        srcBg: '/img/poster_bg2.png',
        tempFilePath: "",
        obj:{},
        array:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRecord(options.id)
    },
    getRecord(id){
        app.func.request(`${app.api.nbRedPackRecord}/${id}`, '', "GET").then(res => {
          if(res.code==200){
            res.data.deliverDate=app.dateFormat(res.data.deliverDate)
            this.setData({
              obj:res.data
            },()=>{
                this.canvasImgs()
            })
          }
        })
      },
      // 将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
      canvasImgs() {
        const {obj,array}=this.data
        if(obj.headImgUrl==''||!obj.headImgUrl){
            var arr = ['https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/NCanHBQP84htMAWnN2bx4xyGCCmQDKDsiBZ2']
        }else{
            var arr = [obj.headImgUrl];//接口中的图片地址
        }
        for (let i = 0; i < arr.length; i++) {
          wx.downloadFile({
            url: arr[i],
            success: res => {
              setTimeout(() => {
                array.push(res.tempFilePath);
                if (array.length === 1) {
                  this.setData({
                    array
                  },()=>{
                    this.getDetail();//绘制canvas的方法
                  })
                }
              }, 500);
            }
          });
        }
      },

    getDetail() {
        const {array,obj}=this.data
        const ctx = wx.createCanvasContext('myCanvas')
        // 背景
        ctx.drawImage('/img/poster_bg2.png', 0, 0, 375, 667)
        // 绘制圆形 将图像剪切进去
        ctx.save()
        ctx.arc(189.5, 261.5, 39, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(array[0], 149, 221, 78, 78)
        ctx.restore()
        ctx.setStrokeStyle('#FFF6F3')
        // 设置边框宽度
        ctx.setLineWidth(5)
        ctx.stroke()

        // 二维码
        ctx.drawImage('/img/qcode.jpg', 120, 438, 135, 135)

        // 设置标题
        let title = `快领取${obj.userNames}的近邻红包`
        ctx.font = 'normal bold 20px 微软雅黑'
        ctx.setFillStyle('#A75938')
        let borderWidth = (375 - ctx.measureText(title).width) / 2 //x轴偏移
        ctx.fillText(`快领取${obj.userNames}的近邻红包`, borderWidth, 335)

        //领取范围
        if(obj.kilometers){
            var rangeTxt = `领取范围：${obj.centerAddress}周围${obj.kilometers}公里内`
        }else{
            var rangeTxt = `领取范围：${obj.dist}${obj.communityName}`
        }
        let px = 0
        let rangeTxtArr = []
        ctx.font = 'normal normal 14px 微软雅黑'
        ctx.setFillStyle('#A75938')
        for (let i = 0; i < rangeTxt.length; i++) {
            px += ctx.measureText(rangeTxt[i]).width
            if (px > 309) {
                rangeTxtArr[0] = rangeTxt.substr(0, i)
                rangeTxtArr[1] = rangeTxt.substr(i)
                break
            }else{
                rangeTxtArr[0] = rangeTxt.substr(0, i+1)
            }
        }
        ctx.fillText(rangeTxtArr[0], 35, 365)
        if(px>309){
            ctx.fillText(rangeTxtArr[1], 100, 388)
        }
        ctx.draw()
        var that = this
        setTimeout(() => {
            wx.canvasToTempFilePath({
                // 通过id 指定是哪个canvas
                canvasId: "myCanvas",
                fileType: "png",
                success(res) {
                    console.log(res.tempFilePath)
                    that.setData({
                        tempFilePath: res.tempFilePath
                    })

                }
            })
        }, 500)
    },
    //保存
    // 重新保存图片
    tosave: function () {
        var that = this;
        /** 检测用户是否授权**/
        wx.getSetting({
            success: function (res) {
                /** 授权，则调用相册**/
                if (res.authSetting['scope.writePhotosAlbum'] === true) {
                    that.saveimg();
                } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
                    /** 未授权，则打开授权页面，让用户授权**/
                    wx.openSetting({
                        success: res => {
                            /** 授权成功，则保存图片，失败则不保存**/
                            if (res.authSetting['scope.writePhotosAlbum'] === true) {
                                that.saveimg();
                            }
                        }
                    });
                } else {
                    that.saveimg();
                }
            },
            fail: function (res) {
                console.log('打开设置失败', res);
            }
        });
    },
    // 保存图片到相册
    saveimg: function () {
        var _that = this;
        wx.saveImageToPhotosAlbum({
            filePath: _that.data.tempFilePath,
            success(res) {
                wx.showToast({
                    title: '已保存到相册'
                });
            },
            fail(res) {}
        });
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


        // 服务器资源  先下载再绘制
        // wx.downloadFile({
        //     url: '',
        //     success() {
        //     }
        // })



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
 
})