// pages/kaituanxiangqing/kaituanxiangqing.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import bindUserInfo from '../../utils/bindUserInfo'
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
    index: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin.initLoginUser();
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const params = JSON.parse(options.params);
    const shareParams = {
      cuid: params.cuid,
      merchants_id: app.globalData.merchantsId,
      uid: uid
    }

    var that = this;
    that.setData({
      shouquan: !!e,
      params: params,
    })
    youhuijuanService.initUserShareCoupon(shareParams).then(data => {
      that.setData({
        couponArray: new Array(data),
      })
    });
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
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
      cuid: this.data.params.cuid,
      //表示领取
      type: 2,
      share_id:this.data.params.share_id, 
      share_uid:this.data.params.share_uid,      
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
    const params = {
      cuid: this.data.params.cuid,
      merchants_id: app.globalData.merchantsId,
      share_uid: uid,
      share_id:this.data.couponArray[res.target.dataset.index].share_id,
    }
    const currentCoupon = this.data.couponArray[0];
    return {
      title: currentCoupon.name,
      path: 'pages/youhuijuanfx/youhuijuanfx?params=' + JSON.stringify(params),
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
    const that = this;
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
          return userLogin.initLoginUser()
        })
        .then(() => {
          const shareParams = {
            cuid: that.data.params.cuid,
            merchants_id: app.globalData.merchantsId,
            uid: wx.getStorageSync('uid')
          }
          return youhuijuanService.initUserShareCoupon(shareParams)
        })
        .then(curData => {
          this.setData({
            couponArray: new Array(curData),
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
})