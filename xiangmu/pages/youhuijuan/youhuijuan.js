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
    userLogin.initLoginUser();
    const e = wx.getStorageSync("e");
    const loginUser = wx.getStorageSync("e").loginUser;
    var that=this;
    that.setData({
      usableIntegral: loginUser.integral,
      params: options.owner,
      loginUser:loginUser
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
    const shareParams = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
      cid: event.currentTarget.dataset.id,
      type: 1//表示兑换
    }
    const that=this;
    //检测用户是否具有权限
    userTest().then(data => {
      if (!data)
        return;
      util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + current.accessToken, shareParams)
      .then(function (data) {
        if (data.data.status == 200) {
         wx.showModal({
           title: '提示',
           content: "兑换成功",
           showCancel: false, 
         })
        }
        else {
          wx.showModal({
            title: '提示',
            content: data.data.msg,
            showCancel: false,
          })
        }
      })
    })
  },

  //开团
  organGroup: function (event) {
    const current = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const currentCoupon = this.data.couponArray[event.detail.value]
    const shareParams = {
      uid: uid,
      cid: event.currentTarget.dataset.id,
      merchants_id: app.globalData.merchantsId
    }     
    wx.navigateTo({
      url: '../kaituan/kaituan?shareParams=' + JSON.stringify(shareParams)
    })
  },
  //进入我参与的团
  organgoto: function (event){
    const uid = wx.getStorageSync("uid");
    const shareParams = {
      uid: uid,
      cid: event.currentTarget.dataset.id,
      merchants_id: app.globalData.merchantsId,
      tuan_id: event.currentTarget.dataset.tuanid
    }
    this.setData({
      cid: event.currentTarget.dataset.id,
    })
    wx.navigateTo({
      url: '../cantuan/cantuan?type=kaituan&uid='+uid+'&shareParams=' + JSON.stringify(shareParams)
    })
  },
  //我的会员
  goMyMember: function () {
    wx.navigateTo({
      url: '../wode/wode'
    })
  },
  //分享
  onShareAppMessage: function (res) {
    console.log(this.data.couponArray[res.target.dataset.index])
    var uid = wx.getStorageSync('uid');
    const params = {
      cuid: res.target.dataset.cuid,
      merchants_id: app.globalData.merchantsId,
      uid: uid
    }
    return {
      title: this.data.couponArray[res.target.dataset.index].integralName,
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
})