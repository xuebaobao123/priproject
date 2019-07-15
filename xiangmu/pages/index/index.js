const app = getApp();
var util = require('../../utils/fengzhuang.js');
Page({
  data: {
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    imgUrls: [
      '../images/banner.png',
      '../images/banner.png',
      '../images/banner.png',
    ],
    //广告位
    advertPlaceArray: [
      { img: "../images/huiyuan.png", fowardUrl: '../wode/wode' },
      { img: "../images/canhuo.png", fowardUrl: '../xiangqing/xiangqing' },
      { img: "../images/weixinzhifu.png", fowardUrl: '../zhifu/zhifu'},
      { img: "../images/youhuijuan.png", fowardUrl: '../youhuijuan/youhuijuan' },
      { img: "../images/hongbao.png", fowardUrl: '../canhuohongbao/canhuohongbao' },
    ]
  },
  onLoad: function () {
    var e = wx.getStorageSync('e');
    this.setData({
      shouquan: !!e,
    })
    this.initToken();
  },
  //点击跳转
  foward: function (e) {
    const advertPlace = this.data.advertPlaceArray[e.currentTarget.dataset.index];
    //跳转页面
    wx.navigateTo({
      url: advertPlace.fowardUrl
    })
  },
  initToken:function(){
    var e = wx.getStorageSync('e');
  
    wx.login({
      success(res) {
        if (res.code) {
          var data={
            merchants_id:"1",
            merchants_id:res.code
          }
          util.postRequest(app.globalData.url + "auth/openid",data)
            .then(function (data) {
              util.postRequest(app.globalData.url + "auth/login", { openId: data})
                .then(function (tokenData) {
                  if (tokenData.status == "0") {
                    //成功获取token
                    wx.setStorageSync("e",{...e,accessToken:tokenData})
                  }
                }, function (error) {
                })
            }, function (error) {
            })
        }
      }
    })
  },
  // 授权登陆
  bindGetUserInfo: function (e) {
    wx.setStorageSync('e', e.detail.userInfo);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      that.setData({
        shouquan: true,
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
})
