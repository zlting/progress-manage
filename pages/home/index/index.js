//默认首页
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newOne: false,
    alertImg: false,
    index: 0,
    interval: 3000,
    duration: 500,
    tabList: [],
    animationType: false,
    alertType: false,
    currentIndex: 0,
    swiper_height: 0,
    scrollTop: 0,
    bannerList: [],
    ad: null,
    userInfo: {},
    topInfoList: [],
    classifyList: [],
    pages: {
      pageIndex: 1,
      pageSize: 5
    },
    loadMore: true,
    list: [],
    number: 0,
    releaseNum: 0,
    msgNumber: 0,
    isRecommend: true, //是否推荐 true推荐
    bulletinTypeId: "", //类型id（获取分类信息的id）
    communityId: "", //小区id
    packList: [], //红包
    packType: false,
    latitude: "",
    longitude: "",
    ani: "",
    forbidden: true,
    share: true,
    lookType: true,
    id: '',
    userInfoId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.alertAnimation()
    console.log(options, "获取参数")
    this.setData({
      loadMore: true,
      id: (options && options.id) ? options.id : '',
      userInfoId: (options && options.userInfoId) ? options.userInfoId : ''
    }, () => {
      if (this.data.id != '') {
        wx.setStorageSync("id", this.data.id)
        wx.setStorageSync("userInfoId", this.data.userInfoId)
      }
      this.setData({
        currentIndex: 0,
        isRecommend: true,
        bulletinTypeId: ''
      }, () => {
        this.getUser()
      })
      // this.getList(true)
    })
    // if (wx.getStorageSync("token") == '') {
    // var that = this
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     console.log(res, "微信位置")
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })
    //   }
    // })
    // }
    // tab右上角小图标
  },
  /** 根据code获取token */
  getUser() {
    var that = this;
    // if (wx.getStorageSync("token")) {
    wx.login({
      success(result) {
        if (result.code) {
          app.func.request(app.api.wxToken, {
            code: result.code,
          }, "GET").then((res) => {
            if (res.code === 200) {
              wx.setStorageSync("token", res.data)
              that.userInfo()
              that.setData({
                forbidden: true
              })
            }
            if (res.code == 0) {
              that.setData({
                forbidden: false
              })
              wx.redirectTo({
                url: "/pages/home/forbidden/forbidden"
              })
            }
          })
        }
      }
    });
  },
  //获取用户信息
  userInfo() {
    app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          currentIndex: res.data.currentCommunity.share ? 0 : 1,
          userInfo: res.data,
          communityId: res.data.currentCommunity.id,
          share: res.data.currentCommunity.share,
        }, () => {
          this.communityNum(res.data.currentCommunity.id) //获取入住人数
          this.getAd() //广告
          this.getList(true)
        })
      }
    })
  },
  //获取入住人数
  communityNum(communityId) {
    app.func.request(`${app.api.communityPersonNum}`, {
      communityId: communityId
    }, "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          number: res.data
        })
      }
    })
  },
  //数组转化
  arrTrans(num, arr) { // 一维数组转换为二维数组
    const iconsArr = []; // 声明数组
    arr.forEach((item, index) => {
      const page = Math.floor(index / num); // 计算该元素为第几个素组内
      if (!iconsArr[page]) { // 判断是否存在
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
  },
  //获取首页banner
  getAd() {
    app.func.request(`${app.api.getAd}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          bannerList: res.data.bannerList,
          ad: res.data.ad || null,
        }, () => {
          if (wx.getStorageSync("newOne") == '' && res.data.ad && res.data.ad.grounding) {
            this.setData({
              alertImg: true
            })
          }
        })
      }
    })
    //信息置顶区
    app.func.request(`${app.api.top_info_list}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          topInfoList: this.arrTrans(3, res.data),
        })
      }
    })
    //获取还剩多少次发布机会
    app.func.request(`${app.api.release_num}`, "", "GET").then(res => {
      if (res.code === 200) {
        this.setData({
          releaseNum: res.data,
        })
      }
    })
    /**分类 */
    app.func.request(`${app.api.classify}`, "", "GET").then(res => {
      if (res.code === 200) {
        var arr = [{
          typeName: "推荐"
        }, {
          typeName: "全部"
        }]
        this.setData({
          tabList: [...arr, ...res.data]
        })
      }
    })
  },
  //获取红包
  getPack() {
    /**红包 */
    // const {
    //   latitude,
    //   longitude,
    // } = this.data
    const latitude=wx.getStorageSync("latitude")||''
    const longitude=wx.getStorageSync("longitude")||''
    console.log(latitude, longitude, "当前位置")
    app.func.request(`${app.api.redpackList}`, "", "GET").then(res => {
      if (res.code === 200) {
        if (res.data.length === 0) {
          this.setData({
            packList: [],
            packType: false
          })
        } else {
          console.log(res.data, "红包数组")
          res.data.map(item => {
            if (!item.share) {
              item.packState = true
            } else {
              if (!item.allArea) {
                console.log(this.GetDistance(item.centerLat, item.centerLng, latitude, longitude), "位置比较")
                item.packState = (this.GetDistance(item.centerLat, item.centerLng, latitude, longitude) >= 0 && this.GetDistance(item.centerLat, item.centerLng, latitude, longitude) <= item.kilometers) ? true : false
              } else {
                item.packState = true
              }
            }
          })
          var arrObj = {}
          let arr = res.data.filter(item => {
            return item.packState == true;
          });
          console.log(arr, "红包1")
          if (wx.getStorageSync("id") != '' && arr.find(item => {
              return item.id == wx.getStorageSync("id")
            })) {
            var arrObj = arr.find(item => {
              return item.id == wx.getStorageSync("id")
            })
          } else {
            wx.removeStorageSync('id')
            wx.removeStorageSync('userInfoId')
            arrObj = arr[0]
          }
          console.log(arrObj, "红包2")
          this.setData({
            packList: arrObj,
            packType: arr.length > 0 ? true : false
          })
        }
      }
    })
  },
  //经纬度
  GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  //消息数据分页
  getList(reload = false) {
    let {
      pages,
      isRecommend,
      bulletinTypeId,
      communityId,
      currentIndex
    } = this.data
    if (reload) {
      pages.pageIndex = 1
      this.setData({
        page: {
          ...pages
        },
        list: [],
        loadMore: true
      })
    }
    if (this.data.loadMore) {
      if (currentIndex === 1) {
        app.func.request(`${app.api.indexAllList}`, {
          communityId: communityId,
          ...pages
        }, "GET").then(res => {
          ++pages.pageIndex
          res.data.list.forEach(item => {
            // item.content=item.content.replace(/↵/g,"\n");
            item.headImgUrl = item.headImgUrl ? item.headImgUrl + '?x-oss-process=image/resize,m_fill,w_80,h_80/quality,Q_100' : null
            if (item.type === 0 && !item.isTop) {
              item.img = JSON.parse(item.img)
            }
            if (item.type === 0 && item.isTop) {
              item.img = JSON.parse(item.img).length === 0 ? "https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/hhcfpAwNecBKxm3bj5TwhCTEt5rT4EjNzz2Y" : JSON.parse(item.img)[0]
            }
            item.time = app.getDateDiff(item.time)
            // item.content="物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业"
            if (item.content && item.content.length > 50) {
              item.contentType = true
            } else {
              item.contentType = false
            }
          })
          this.setData({
            list: this.data.list.concat(res.data.list),
            pages: {
              ...pages
            },
            loadMore: res.data.isLastPage ? false : true
          })
        })
      } else {
        app.func.request(`${app.api.indexList}`, {
          isRecommend: isRecommend,
          bulletinTypeId: bulletinTypeId,
          communityId: communityId,
          ...pages
        }, "GET").then(res => {
          ++pages.pageIndex
          res.data.list.forEach(item => {
            // item.content=item.content.replace(/↵/g,"\n");
            if (!item.isTop) {
              item.img = JSON.parse(item.img)
            }
            if (item.isTop) {
              item.img = JSON.parse(item.img).length === 0 ? "https://jinlin-property.oss-cn-shanghai.aliyuncs.com/img/hhcfpAwNecBKxm3bj5TwhCTEt5rT4EjNzz2Y" : JSON.parse(item.img)[0]
            }
            item.headImgUrl = item.headImgUrl ? item.headImgUrl + '?x-oss-process=image/resize,m_fill,w_80,h_80/quality,Q_100' : null
            item.time = app.getDateDiff(item.time)
            // item.content="物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业物业是指已经建成并投入使用的各类房屋及其与之相配套的设备、设施和场地。物业可大可小，一个物业可大可小物业"
            if (item.content && item.content.length > 50) {
              item.contentType = true
            } else {
              item.contentType = false
            }
          })
          this.setData({
            list: this.data.list.concat(res.data.list),
            pages: {
              ...pages
            },
            loadMore: res.data.isLastPage ? false : true
          })
        })
      }

    }
  },
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    const item = e.currentTarget.dataset
    wx.previewImage({
      current: item.src, // 当前显示图片的http链接  
      urls: item.item // 需要预览的图片http链接列表  
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
        url: `/pages/home/html/html?id=${id}`,
      })
    }
  },
  /**
   * 跳转到公告详情
   */
  async jumpNotice(e) {
    if (await app.setUserInfo()) {
      const dataset = e.currentTarget.dataset.item
      //  指定信息 0 投票活动 1 报名活动 2 问卷 3
      /**活动 */
      switch (dataset.type) {
        case 0:
          wx.navigateTo({
            url: `/pages/home/messageDetail/messageDetail?id=${dataset.id}`,
          })
          break;
        case 1:
          wx.navigateTo({
            url: `/pages/home/voteRule/voteRule?id=${dataset.id}`,
          })
          break;
        case 2:
          wx.navigateTo({
            url: `/pages/home/activityDetail/activityDetail?id=${dataset.id}`,
          })
          break;
        case 3:
          wx.navigateTo({
            url: `/pages/home/questionnaire/questionnaire?id=${dataset.id}`,
          })
          break;
      }
    }
  },
  /**
   * 弹框详情
   * @param {跳转} e 
   */
  async jumpAlertDetail() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: '/pages/home/html/html?id=' + this.data.ad.id,
      })
    }
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
  //用户点击tab时调用
  titleClick: function (e) {
    let {
      isRecommend,
      bulletinTypeId
    } = this.data
    let index = e.currentTarget.dataset.idx
    let id = e.currentTarget.dataset.id
    if (index === 0) {
      isRecommend = true
      bulletinTypeId = ''
    } else if (index === 1) {
      isRecommend = ''
      bulletinTypeId = ''
    } else {
      isRecommend = ''
      bulletinTypeId = id
    }
    this.setData({
      currentIndex: index,
      isRecommend: isRecommend,
      bulletinTypeId: bulletinTypeId,
    }, () => {
      // this.setUserInfo()
      this.getList(true)
    })

  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  //查看详情
  async lookDetail(e) {
    if (await app.setUserInfo()) {
      const item = e.currentTarget.dataset
      if (item.type = 0) {
        wx.navigateTo({
          url: '/pages/home/messageDetail/messageDetail?id=' + e.currentTarget.dataset.id,
        })
      }

    }
  },
  /**
   * 开红包
   */
  async start() {
    if (await app.setUserInfo()) {
      var that = this
      that.setData({
        alertType: true,
        animationType: true
      }, () => {
        that.alertAnimation()
      })
      // var animation = wx.createAnimation({
      //   duration: 1000,
      //   ease: 'ease',
      //   delay: 100
      // });
      // animation.opacity(0.01).translate(136, -213).step()
      // that.setData({
      //   ani: animation.export()
      // })
      // setTimeout(() => {
      //   that.setData({
      //     alertType: true
      //   }, () => {
      //     that.alertAnimation()
      //   })
      // }, 1000)
    }
  },
  /**
   * 弹框动画
   */
  alertAnimation() {
    setTimeout(() => {
      this.animate('.icon1', [{
          scale: [0.8],
          ease: 'ease-out'
        },
        {
          scale: [1.06],
          ease: 'ease-in'
        },
        {
          scale: [1],
          ease: 'ease-out'
        },
      ], 1000)
    }, 200)
    this.animate('.packet', [{
        scale: [0.8],
        ease: 'ease-out'
      },
      {
        scale: [1.06],
        ease: 'ease-in'
      },
      {
        scale: [1],
        ease: 'ease-out'
      },
    ], 1000)
  },
  /**
   * 
   */
  jumpOpen() {
    var that = this
    const {
      packList,
    } = this.data
    app.func.request(`${app.api.sendRedPack}`, {
      id: packList.id,
      userId: wx.getStorageSync("userInfoId") || ''
    }, "GET").then(res => {
      if (res.code == 200) {
        that.animate('.icon3', [{
            rotateY: 0
          },
          {
            rotateY: 90
          },
          {
            rotateY: 180
          },
          {
            rotateY: 270
          },
          {
            rotateY: 360
          },
        ], 1000)
        wx.removeStorageSync('userInfoId')
        wx.removeStorageSync('id')
        setTimeout(() => {
          that.setData({
            alertType: false
          })
          wx.navigateTo({
            url: "/pages/home/drawSucess/drawSucess?id=" + res.data
          })
        }, 1000)
      }
    })
  },
  /**
   * 关闭第一次广告
   */
  closeAlertImg() {
    wx.setStorageSync("newOne", true)
    this.setData({
      alertImg: false
    })
  },
  closeAlertType() {
    this.setData({
      alertType: false,
      animationType: false
    })
  },
  /**
   * 收起/展开按钮点击事件
   */
  ellipsis(e) {
    const {
      list
    } = this.data
    var type = !e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    list[index].contentType = type
    this.setData({
      list: [...list]
    })
  },
  /**
   * 点赞
   */
  async addLike(e) {
    if (await app.setUserInfo()) {
      const {
        list
      } = this.data
      var type = !e.currentTarget.dataset.isthumbup;
      var index = e.currentTarget.dataset.index;
      list[index].isThumbUp = type

      if (type) {
        //点赞
        app.func.request(`${app.api.nbBulletinLike}`, {
          bulletinId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum += 1
            this.setData({
              list: [...list]
            })
          }
        })
      } else {
        //取消
        app.func.request(`${app.api.likeCancel}`, {
          bulletinId: list[index].id
        }, "POST").then(res => {
          if (res.code === 200) {
            list[index].likeNum -= 1
            this.setData({
              list: [...list]
            })
          }
        })
      }
    }
  },
  /**入驻小区 */
  async jumpHouse() {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: '/pages/home/changeHouse/changeHouse',
      })
    }
  },
  //跳转到评论页面
  async jumpEvalute(e) {
    if (await app.setUserInfo()) {
      wx.navigateTo({
        url: '/pages/home/evaluate/evaluate?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  // 投票活动答题
  async jumpDetail(e) {
    console.log(e)
    if (await app.setUserInfo()) {
      const dataset = e.currentTarget.dataset
      if (dataset.type == null) {
        dataset.type = 0
      }
      //  指定信息 0 投票活动 1 报名活动 2 问卷 3
      /**活动 */
      switch (dataset.type) {
        case 0:
          wx.navigateTo({
            url: `/pages/home/messageDetail/messageDetail?id=${dataset.id}`,
          })
          break;
        case 1:
          wx.navigateTo({
            url: `/pages/home/voteRule/voteRule?id=${dataset.id}`,
          })
          break;
        case 2:
          wx.navigateTo({
            url: `/pages/home/activityDetail/activityDetail?id=${dataset.id}`,
          })
          break;
        case 3:
          wx.navigateTo({
            url: `/pages/home/questionnaire/questionnaire?id=${dataset.id}`,
          })
          break;
      }
    }
  },
  /**发布 */
  async jumpIssue() {
    if (await app.setUserInfo()) {
      const {
        releaseNum,
        userInfo
      } = this.data
      if (releaseNum > 0) {
        wx.navigateTo({
          url: '/pages/home/postMessage/postMessage?share=' + userInfo.currentCommunity.share,
        })
      } else {
        app.func.showToast("今日无发布次数")
      }
    }
  },
  //跳转到个人信息
  async jumpUserInfo(e) {
    if (await app.setUserInfo()) {
      var obj = {
        index: e.currentTarget.dataset.index
      }
      wx.setStorageSync('indexObj', JSON.stringify(obj))
      wx.navigateTo({
        url: `/pages/home/userinfo/userinfo?userId=${e.currentTarget.dataset.userid}`,
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
  onShow: function (e) {
    this.setData({
      animationType: false
    })
    if(wx.getStorageSync("longitude")==''){
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          wx.setStorageSync("latitude", res.latitude)
          wx.setStorageSync("longitude", res.longitude)
        }
      })
    }
 
    // const {
    //   returnType
    // } = this.data
    // if (returnType) {
    //   this.setData({
    //     loadMore: true
    //   }, () => {
    //     this.setData({
    //       currentIndex:0,
    //       isRecommend:true,
    //       bulletinTypeId:''
    //     },()=>{
    //       this.getUser()
    //     })
    //     // this.getList(true)
    //   })
    // } else {
    //   var obj = JSON.parse(wx.getStorageSync('indexObj')) || {}
    //   if (obj.likeNum != null) {
    //     const {
    //       list
    //     } = this.data
    //     console.log(list)
    //     list[obj.index].likeNum = obj.likeNum,
    //       list[obj.index].isThumbUp = obj.isThumbUp
    //     this.setData({
    //       list
    //     })
    //   }
    // }
    if (wx.getStorageSync('token') != '') {
      app.func.request(`${app.api.getUserInfo}`, "", "GET").then(res => {
        if (res.code === 200) {
          this.setData({
            userInfo: res.data,
          }, () => {
            this.getPack()
          })
        }
      })
      app.getMsgNum((res) => {
        if (res > 0) {
          this.setData({
            msgNumber: res
          }, () => {
            wx.setTabBarBadge({
              index: 2,
              text: `${this.data.msgNumber}`
            })
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      alertImg: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1200
    });

    this.setData({
      isRecommend: true,
      bulletinTypeId: ''
    }, () => {
      this.getUser()
    })
    this.setData({
      animationType: false
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },

})