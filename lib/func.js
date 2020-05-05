//通用请求接口
function request(url, data,type) {
  // wx.showLoading({
  //   title: '加载中...',
  // })
  var token=wx.getStorageSync('token');
  return new Promise(function (resolve, reject) {
    wx.request({
      method:type,
      url: url,
      data: { ...data},
      header: {
        'content-type': 'application/json',
        'Authorization': token || '',
      },
      success: function (res) {
        if(res.statusCode!=200){
          showToast('服务器错误');
          return;
        }else {
          if (res.data.code == 401 ){
            wx.clearStorageSync();
          }
          if (res.data.code == 418 ){
            setTimeout(()=>{
              showToast(res.data.description);
            },50)
          }
          // wx.hideLoading();
        }
        resolve(res.data);
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}



//距离
function getDistance(distance) {
  var d = "";
  if (distance < 100) {
    d = '<100m';
  } else if (distance >= 100 && distance < 1000) {
    d = distance.toFixed(2) + 'm';
  } else if (distance > 1000 && distance < 500000) {
    d = (distance / 1000).toFixed(2) + 'km';
  } else {
    d = "未知"
  }
  return d;
}

//打折取整
function discount(count) {
  return Number(count * 10).toFixed(1)
}

//弹出框
function showToast(title) {
  wx.showToast({
    title: title,
    icon: "none",
    duration: 2000
  })
}
//验证手机号格式
function regPhone(str) {
  const reg = /^[1][2, 3,4,5, 6 ,7,8, 9][0-9]{9}$/;
  if(reg.test(str)){
    return true
  }else{
    return false
  }
}
//去掉字符串前后的所有空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//分享小程序主体
function share(e){
  return {
    title: '锁定信任，趣享一生',
    path: '/pages/index/index',
    imageUrl: "/img/btn_share.jpg"
  }
}
module.exports = {
  request,
  getDistance,
  showToast,
  trim,
  discount,
  share,
  regPhone
}