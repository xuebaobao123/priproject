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
       cuid:"16",
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
})