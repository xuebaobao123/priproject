const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import bindUserInfo from '../../utils/bindUserInfo'
Page({
  data: {
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    shouquan: false,
    //广告位
    advertPlaceArray: [
      { img: "../images/huiyuan.png", fowardUrl: '../wode/wode' },
      { img: "../images/canhuo.png", fowardUrl: '../xiangqing/xiangqing' },
      { img: "../images/weixinzhifu.png", fowardUrl: '../zhifu/zhifu' },
      { img: "../images/youhuijuan.png", fowardUrl: '../youhuijuan/youhuijuan?owner=business' },
      { img: "../images/hongbao.png", fowardUrl: '../canhuohongbao/canhuohongbao' },
    ]
  },
  onLoad: function () {
    var e = wx.getStorageSync('e');
    this.setData({
      shouquan: !!e,
    })
    this.initImageUrls();
  },
  //点击跳转
  foward: function (e) {
    const advertPlace = this.data.advertPlaceArray[e.currentTarget.dataset.index];
    //跳转页面
    wx.navigateTo({
      url: advertPlace.fowardUrl
    })
  },

  // 授权登陆
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      bindUserInfo(e.detail.userInfo)
        .then(({ accessToken, uid }) => {
          wx.setStorageSync('uid', uid)
          wx.setStorageSync('e', {
            ...e.detail.userInfo,
            accessToken
          })
          //用户登录
          return userLogin();
        }).then(() => {
          console.log('after userLogin')
          this.setData({
            shouquan: !this.data.shouquan,
          })
        })

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
  //获取轮播图
  initImageUrls: function () {
    var e = wx.getStorageSync('e');
    //消费记录
    const params = {
      "type": "2", //表示首页
      //商家ID
      "merchants_id": app.globalData.merchantsId
    }
    const that = this
    util.postRequest(app.globalData.url + "banner/list?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        that.setData({
          imgUrls: data.data.data.map(item => {
            return item.address
          })
        })

      })
  }
})
wx.showShareMenu({
  withShareTicket: true
})
