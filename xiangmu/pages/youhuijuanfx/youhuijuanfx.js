// pages/kaituanxiangqing/kaituanxiangqing.js
const app = getApp();
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
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
    usableIntegral: 300
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    const params={
       cuid:options.cuid,
       merchants_id: app.globalData.merchantsId
    }
    var that=this;
    youhuijuanService.initUserShareCoupon(params).then(data => {
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
  exReceive: function () {
    const current = wx.getStorageSync("e");
    const currentCoupon = this.data.couponArray[e.detail.value];
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: current.loginUser.id,
      cuid: currentCoupon.id,
      type: 2//表示领取
    }
    util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + e.accessToken, params)
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