//app.js
var func = require('./lib/func.js');
var api = require('./lib/api.js');
var map = require('./lib/baiduMap.js');
App({
  onLaunch: function () {
    var self = this;
    /**
     * 获取自定义头部高
     */
    wx.getSystemInfo({
      success: function (res) {
        self.globalData.rpx = res.windowWidth / 375;
        self.globalData.statusBarHeight = res.statusBarHeight;
        //通过获取胶囊的位置信息来计算titilbar的的高度
        let jn = wx.getMenuButtonBoundingClientRect();
        self.globalData.titleBarHeight = jn.height + (jn.top - res.statusBarHeight) * 2;
      }
    })
    //获取用户位置
    self.getLocaAddress(false)
  },
  onShow: function (options) {},
  onHide: function () {
    // wx.removeStorage({
    //   key: 'newOne',
    // })
  },
  watch: function () {

  },

  // 重新获取地理位置
  tosave: function (sucess) {
    var that = this;
    /** 检测用户是否授权**/
    wx.getSetting({
      success: function (res) {
        /** 授权，则调用相册**/
        if (res.authSetting['scope.userLocation'] === true) {
          that.getLocaAddress(sucess);
        } else if (res.authSetting['scope.userLocation'] === false) {
          /** 未授权，则打开授权页面，让用户授权**/
          wx.openSetting({
            success: res => {
              /** 授权成功，则保存图片，失败则不保存**/
              if (res.authSetting['scope.userLocation'] === true) {
                that.getLocaAddress(sucess);
              }
            }
          });
        } else {
          that.getLocaAddress(sucess);
        }
      },
      fail: function (res) {
        console.log('打开设置失败', res);
      }
    });
  },
  getLocaAddress(sucess) {
    var BMap = new map.BMapWX({
      ak: "T4VNUFGdHflp7pOj61YDFKjpsVoX00wn"
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        BMap.regeocoding({
          type: 'wgs84',
          location: latitude + ',' + longitude,
          success: function (res) {
            console.log(res,"地理")
            let district = res.originalData.result.addressComponent.district;
            let city = res.originalData.result.addressComponent.city;
            let province = res.originalData.result.addressComponent.province;
            wx.setStorageSync("district", district)
            wx.setStorageSync("province", province)
            wx.setStorageSync("city", city)
            wx.setStorageSync("latitude", latitude)
            wx.setStorageSync("longitude", longitude)
            if (sucess) {
              sucess(`${district},${province},${city}`)
            }
            // wx.showToast({
            //   title: res.originalData.result.formatted_address,
            //   duration: 20000
            // })
          },
          fail: function () {
            // wx.showToast({
            //   title: '请检查位置服务是否开启',
            // })
          },
        });
      }
    })
  },
  getMsgNum(success) {
    if (wx.getStorageSync('token') != '') {
      func.request(`${api.msg_count}`, "", "GET").then(res => {
        if (res.code === 200) {
          success(res.data)
        }
      })
    }
  },
  /**
   * 时间转换
   * @param {*} timestamp 
   * @param {*} format 
   */
  dateFormat(timestamp, format) {
    // :ss
    format = format == null ? 'yyyy.MM.dd hh:mm' : format
    const date = new Date(timestamp)
    const o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      S: date.getMilliseconds() // millisecond
    }
    const week = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六'
    ]
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    if (/(w+)/.test(format)) {
      format = format.replace(RegExp.$1, week[date.getDay()])
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ?
          o[k] :
          ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  },
  /**
   * 朋友圈时间格式
   */
  getDateDiff(dateTime) {
    let dateTimeStamp = new Date(dateTime).getTime();
    let result = '';
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let year = day * 365;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    let monthEnd = diffValue / month;
    let weekEnd = diffValue / (7 * day);
    let dayEnd = diffValue / day;
    let hourEnd = diffValue / hour;
    let minEnd = diffValue / minute;
    let yearEnd = diffValue / year;
    if (yearEnd >= 1) {
      result = dateTime;
    } else if (monthEnd >= 1) {
      result = "" + parseInt(monthEnd) + "月前";
    } else if (weekEnd >= 1) {
      result = "" + parseInt(weekEnd) + "周前";
    } else if (dayEnd >= 1) {
      result = "" + parseInt(dayEnd) + "天前";
    } else if (hourEnd >= 1) {
      result = "" + parseInt(hourEnd) + "小时前";
    } else if (minEnd >= 1) {
      result = "" + parseInt(minEnd) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  },

  //获取用户信息
  async setUserInfo() {
    if (wx.getStorageSync('token') != '') {
      const data = await func.request(`${api.getUserInfo}`, "", "GET")
      if (data.code === 200) {
        if (!data.data.register) {
          wx.navigateTo({
            url: '/pages/home/changeHouse/changeHouse',
          })
          // func.showToast("请先注册")
          // setTimeout(()=>{
          //   wx.navigateTo({
          //     url: '/pages/home/login/login',
          //   })
          // },1000)
        } else {
          if (!data.data.isAuth) {
            wx.navigateTo({
              url: '/pages/home/changeHouse/changeHouse',
            })
            // func.showToast("请先认证小区")
            // setTimeout(()=>{
            //   wx.navigateTo({
            //     url: '/pages/home/changeHouse/changeHouse',
            //   })
            // },1000)
          } else {
            return true
          }
        }
      }
    }

  },
  // 上传图片
  randomString(len) {
    len = len || 32
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  },
  /**
   * 
   * @param {获取oss} type 
   */
  aliyunOss() {
    func.request(api.getOss, "", "GET").then(res => {
      if (!res.code) {
        let obj = {}
        obj.aliyunFileKey = `${res.dir}`;
        obj.aliyunServerURL = res.host + '/'; // OSS地址需要https
        obj.accessid = res.accessid;
        obj.policyBase64 = res.policy;
        obj.signature = res.signature; // 获取签名
        wx.setStorageSync("objOss", JSON.stringify(obj))
      }
    })
  },
  uploadFile(filePath, successc) {
    if (!filePath) {
      wx.showModal({
        title: '图片错误',
        content: '请重试',
        showCancel: false
      });
      return;
    }
    const sign = JSON.parse(wx.getStorageSync("objOss"))
    const aliyunFileKey = sign.aliyunFileKey + `${this.randomString(36)}`;
    const aliyunServerURL = sign.aliyunServerURL; // OSS地址需要https
    const accessid = sign.accessid;
    const policyBase64 = sign.policyBase64;
    const signature = sign.signature; // 获取签名
    wx.uploadFile({
      url: aliyunServerURL, // 开发者服务器 url aliyunServerURL /https://static.wmeimob.com
      filePath: filePath, // 需要上传的图片路径
      name: 'file', // 必须填写为file
      formData: {
        key: aliyunFileKey,
        policy: policyBase64,
        OSSAccessKeyId: accessid,
        signature: signature,
        success_action_status: '200'
      },
      success: function (res) {
        if (res.statusCode !== 200) {
          wx.showModal({
            title: '图片错误',
            content: '请重试',
            showCancel: false
          });
          return;
        }
        console.log(aliyunFileKey, 9999)
        successc(aliyunServerURL + aliyunFileKey);
      },
      fail: function (err) {
        err.wxaddinfo = aliyunServerURL;
        wx.showModal({
          title: '图片错误',
          content: '请重试',
          showCancel: false
        });
      }
    });
  },
  globalData: {
    statusBarHeight: '',
    titleBarHeight: '',
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
  },
  api: api,
  func: func
})