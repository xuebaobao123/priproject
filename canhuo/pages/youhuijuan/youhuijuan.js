// pages/youhuijuan/youhuijuan.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import userTest from '../../utils/userTest'
import youhuijuanService from '../../utils/youhuijuanService'
Page({
  data: {
    //券类型
    COUPONTYPE: {
      //开团券
      GROUP: 0,
      //优惠券
      DISCOUNT: 1,
    },
    //优惠券数组
    couponArray: [],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    fanhui: "< 返回",//返回
    usableIntegral: 300,
    //加载详情数据标志位
    initActiveDataFlag: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    const e = wx.getStorageSync("e");
    this.setData({
      usableIntegral: e.loginUser.integral
    })
    let dataArray = null;
    if (!options.owner) {
      //没有owner参数默认加载我的优惠券包数据
      dataArray = youhuijuanService.initUserCouponArrayData();
      this.setData({
        couponArray: dataArray
      })
      return;
    }
    const that = this;
    that.setData({
      params:options.owner
    })
    switch (options.owner) {
      case 'business':
        //所有商家优惠券
        youhuijuanService.initBusinessCouponArrayData().then(data=>{
          that.setData({
            couponArray: data
          })
        })
        break;
      case 'involved':
        //我参与的团
        youhuijuanService.initInvolvedCouponArrayData().then(data => {
          that.setData({
            couponArray: data
          })
        });
        break;
      case 'user':
        //我的优惠券包
       youhuijuanService.initUserCouponArrayData().then(data => {
          that.setData({
            couponArray: data
          })
        })
      default:
        break;
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
  //立即兑换
  exchange: function (event) {
    const current = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
      cid: event.currentTarget.dataset.id,
      type: 1//表示兑换
    }
    const that=this;
    //检测用户是否具有权限
    if (!userTest()) {
      return;
    }
    console.log('params', params);
    util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + current.accessToken, params)
      .then(function (data) {

        if (!errorMessage(data)) {
          return;
        }
        if (data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
        }
        else {
        }
      })
  },

  //开团
  organGroup: function (event) {
    const current = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const currentCoupon = this.data.couponArray[event.detail.value]
    const params = {
      uid: uid,
      ct_id: event.currentTarget.dataset.id,
    }
    //检测用户是否具有权限
    if (!userTest()) {
      return;
    }
    // util.postRequest(app.globalData.url + "partner/open?access-token=" + current.accessToken, params)
    //   .then(function (data) {
    //     if (!errorMessage(data)) {
    //       return;
    //     }
    //     if (data.code == 200) {
    //       const params1 = {
    //         uid: uid,
    //         cid: event.currentTarget.dataset.id,
    //         tuan_id:data.data.data.tuan_id,
    //         merchants_id: app.globalData.merchantsId
    //       }
    //       wx.showModal({
    //         title:"开团成功",
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.redirectTo({
    //               url: '../kaituan/kaituan?params=' + JSON.stringify(params1)
    //             })
    //           } else {
    //           }
    //         }
    //       })
    //     }
    //     else {

    //     }
    //   })
    const params1 = {
      uid: uid,
      cid: event.currentTarget.dataset.id,
      merchants_id: app.globalData.merchantsId
    }
    wx.showModal({
        title:"开团成功",
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../kaituan/kaituan?params=' + JSON.stringify(params1)
            })
          } else {
          }
        }
      })
  },
  //我的会员
  goMyMember: function () {
    wx.redirectTo({
      url: '../wode/wode'
    })
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: '分享优惠券',
      path: 'pages/youhuijuanfx/youhuijuanfx?cuid=' + res.target.dataset.cuid,
      imageUrl: '../images/canhuo.png',  //用户分享出去的自定义图片大小为5:4,
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
})