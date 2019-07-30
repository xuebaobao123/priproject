// pages/kaituanxiangqing/kaituanxiangqing.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //优惠券数组
    couponArray: [],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    usableIntegral: 300,
    shouquan: true,
    index:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const params = JSON.parse(options.params);
    const shareParams={
       cuid:params.cuid,
       merchants_id: app.globalData.merchantsId,
       uid:uid
    }
    var that = this;
    this.setData({
      shouquan: !!e,
      params: params,
    })
    if(that.data.shouquan){
      userLogin();
      youhuijuanService.initUserShareCoupon(shareParams).then(data => {
        that.setData({
          couponArray: new Array(data),
        })
      });
      
    }
  
  },
  //查看详情
  onToggle(e) {
    const index = this.data.activeIndex;
    this.setData({
      //控制查看详情的展开和关闭
      activeIndex: index === e.currentTarget.dataset.index ? -1 : e.currentTarget.dataset.index
    })
  },
  // 返回
  fanhui: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  //我的会员
  goMyMember: function () {
    wx.redirectTo({
      url: '../wode/wode'
    })
  },
  //立即领取
  exReceive: function (e) {
    const current = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const currentCoupon = this.data.couponArray[0];
    console.log("currentCoupon", currentCoupon)
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
      cuid: this.data.params.cuid,
      type: 2//表示领取
    }
    util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + current.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return
        }
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
      })
  },
  //分享
  onShareAppMessage: function (res) {
    var uid = wx.getStorageSync('uid');
    const params={
      cuid: this.data.params.cuid,
      merchants_id: app.globalData.merchantsId,
      uid: uid
    }
    return {
      title: '分享优惠券',
      path: 'pages/youhuijuanfx/youhuijuanfx?params='+params,
      imageUrl: this.data.couponArray[res.target.dataset.index].imgUrl,  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        console.log(res, "分享成功")
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        console.log(res, "失败")
        // 分享失败
      },
    }
  },
  bindGetUserInfo: function (e) {
    wx.setStorageSync('e', e.detail.userInfo);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //加载token
      that.initToken();
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
    this.setData({
      shouquan: !this.data.shouquan,
    })
  },
  initToken: async function () {
    var e = wx.getStorageSync('e');
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          var data = {
            merchants_id: app.globalData.merchantsId,
            client_code: res.code,
          }
          util.postRequest(app.globalData.url + "auth/openid", data)
            .then(function (data) {
              if (!(errorMessage(data))) {
                return;
              }
              wx.setStorageSync("openid", data.data.data.openid)
              util.postRequest(app.globalData.url + "auth/login", { openid: data.data.data.openid })
                .then(function (tokenData) {
                  if (!(errorMessage(tokenData))) {
                    return;
                  }
                  //成功获取token
                  wx.setStorageSync("e", { ...e, accessToken: tokenData.data.data.access_token })
                  that.initlogin();
                }, function (error) {
                })
            }, function (error) {
            })
        }
      }
    })
  },
  initlogin: function () {
    var e = wx.getStorageSync('e');
    var data = {
      merchants_id: app.globalData.merchantsId,
      openid: wx.getStorageSync('openid'),
      nickname: e.nickName,
      avatarurl: e.avatarUrl,
      gender: e.gender,
      province: e.country,
      city: e.city,
      country: e.province,
      parent_id: "",
    }
    var that = this;
    util.postRequest(app.globalData.url + "user/up-info?access-token=" + e.accessToken, data)
      .then(function (data) {
        wx.setStorageSync("uid", data.data.data.uid);
        const shareParams={
          cuid: that.data.params.cuid,
          merchants_id: app.globalData.merchantsId,
          uid: uid
        }
        youhuijuanService.initUserShareCoupon(shareParams).then(data => {
          that.setData({
            couponArray: new Array(data),
          })
        });
        userLogin();
      }, function (error) {
      })
  },
})