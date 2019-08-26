const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
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
      { text: '我参与的团', img: '../images/jiantou-2_03.png', fowardUrl: '../youhuijuan/youhuijuan?owner=involved' },
      { text: '红包获取规则', img: '../images/jiantou-2_03.png', fowardUrl: '../guize/guize?type=1' },
      { text: '积分获取规则', img: '../images/jiantou-2_03.png', fowardUrl: '../guize/guize?type=2' },
      { text: '积分使用规则', img: '../images/jiantou-2_03.png', fowardUrl: '../guize/guize?type=3' },
      { text: '隐私权政策', img: '../images/jiantou-2_03.png', fowardUrl: '../guize/guize?type=4' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //登录用户
    userLogin.initLoginUser();
    app.changeTabBar();
    this.initData();
  },

  //消费查询
  findConsumeRecord: function () {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    // e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    console.log('loginUser',e.loginUser);
    const that = this
    
    //消费记录
    util.postRequest(app.globalData.url + "user/balance-log?access-token=" + e.accessToken, { uid: uid })
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        
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
    wx.navigateTo({
      url: detail.fowardUrl
    })
  },
  //进入优惠券包
  goCouponPage: function (e) {
    wx.navigateTo({
      // url: '../youhuijuan/youhuijuan?owner=user'
      url: '../youhuijuan/youhuijuan?owner=business'
    })
  },

  //页面数据
  initData: function () {
    const loginUser = wx.getStorageSync("e").loginUser;
    const e = wx.getStorageSync("e");
    var that=this;
    console.log('loginUser', loginUser);
    util.postRequest(app.globalData.url + "user/user-info?access-token=" + e.accessToken, { uid: e.loginUser.id })
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        console.log('user.balance.data', data);
        //页面数据
        that.setData({
          //头像
          avatarurl: data.data.data.avatarurl,
          //昵称
          nickname: data.data.data.nickname,
          //累计积分
          cumIntegral: data.data.data.total_integral,
          //优惠券数量
          couponCount: data.data.data.coupon_num,
          //可用积分
          usableIntegral: data.data.data.integral,
          //余额
          surplus: {
            //整数值
            numDigits: data.data.data.balance.split('.')[0],
            //小数位数值
            decimalDigits: data.data.data.balance.split('.')[1],
          },

        })
      })
    
  }
})