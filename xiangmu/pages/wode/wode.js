const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //头像
    avatarurl: null,
    //昵称
    nickname: '',
    //累计积分
    cumIntegral: 0,
    //优惠券数量
    couponCount: 0,
    //可用积分
    usableIntegral: 0,
    //余额
    surplus: {
      //整数值
      numDigits: 0,
      //小数位数值
      decimalDigits: 0,
    },
    //消费记录

    consumeRecord: [
      {
        lateDesc: '近一月',
        //日期
        date: '2019-06-12',
        //消费金额
        consume: {
          //整数值
          numDigits: 2000,
          //小数位数值
          decimalDigits: 21,
        }
      },
      {
        //日期
        date: '2019-06-12',
        //消费金额
        consume: {
          //整数值
          numDigits: 2000,
          //小数位数值
          decimalDigits: 21,
        }
      }
    ],
    //详细列表
    detailArray: [
      { text: '我参与的团', img: '../images/jiantou-2_03.png', fowardUrl: '../youhuijuan/youhuijuan' },
      { text: '红包获取规则', img: '../images/jiantou-2_03.png', fowardUrl: '22' },
      { text: '积分获取规则', img: '../images/jiantou-2_03.png', fowardUrl: '3' },
      { text: '积分使用规则', img: '../images/jiantou-2_03.png', fowardUrl: '3' },
      { text: '隐私权政策', img: '../images/jiantou-2_03.png', fowardUrl: '4' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();

    this.initData();
  },

  //消费查询
  findConsumeRecord: function () {
    const e = wx.getStorageSync("e");
    e.accessToken = 'XXMrUxwlndZWdSN_ob6UO-CfFH2Ookr-';

    const that = this
    //消费记录
    util.postRequest(app.globalData.url + "user/balance-log?access-token=" + e.accessToken, { uid: e.loginUser.id })
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        console.log('data.data.data', data)
        that.setData({
          consumeRecord: data.data.data.map(item => {
            return {
              date: item.create_time,
              consume: {
                numDigits: item.price.split('.')[0],
                decimalDigits: item.price.split('.')[1],
              }
            }
          })
        })

        //消费记录展示判断条件
        let activeIndex = that.data.activeIndex || false;
        that.setData({
          activeIndex: !!!activeIndex,
        })
      })

  },

  //查询累计积分
  findCumIntegral: function () {

  },

  //查询优惠券个数
  findCouponCount: function () {

  },

  //查询可用积分
  findUsableIntegral: function () {

  },

  //跳转
  foward: function (e) {
    //单个
    const detail = this.data.detailArray[e.currentTarget.dataset.index];
    //跳转页面
    wx.redirectTo({
      url: detail.fowardUrl
    })
  },
  //进入优惠券包
  goCouponPage: function (e) {
    wx.redirectTo({
      url: '../youhuijuan/youhuijuan'
    })
  },

  //获取登录用户信息
  initLoginUser: async function () {
    const e = wx.getStorageSync("e");
    e.accessToken = 'aWNPAF_Isy1IF78TyH7Dbi0fxMOHSn2n';
    if (e.loginUser)
      return;

    //检索登录用户
    await util.postRequest(app.globalData.url + "user/user-info?access-token=" + e.accessToken, { uid: '35' })
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        wx.setStorageSync("e", { ...e, loginUser: data.data.data });

      })
  },

  //页面数据
  initData: function () {
    //登录用户
    this.initLoginUser();
    const loginUser = wx.getStorageSync("e").loginUser;
    console.log('loginUser', loginUser);
    //页面数据
    this.setData({
      //头像
      avatarurl: loginUser.avatarurl,
      //昵称
      nickname: loginUser.nickname,
      //累计积分
      cumIntegral: 0,
      //优惠券数量
      couponCount: loginUser.coupon_num,
      //可用积分
      usableIntegral: loginUser.integral,
      //余额
      surplus: {
        //整数值
        numDigits: loginUser.balance.split('.')[0],
        //小数位数值
        decimalDigits: loginUser.balance.split('.')[1],
      },

    })
  }
})