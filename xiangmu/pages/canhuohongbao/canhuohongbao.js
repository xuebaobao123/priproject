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
    //账单类型
    BILLTYPE: {
      //收入
      INCOME: 0,
      //支出
      EXPEND: 1
    },
    beginDate: "2019-07-06",
    endDate: "2019-07-22",

    //余额
    balance: {
      //整数值
      numDigits: 0,
      //小数位数值
      decimalDigits: 0,
    },
    //账单记录
    billRecord: [
      {
        //消费日期
        time: '',
        //金额
        money: {
          //整数值
          numDigits: 0,
          //小数位数值
          decimalDigits: 0,
        },
        //账单类型
        type: 0,
        //账单描述
        desc: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    const loginUser = wx.getStorageSync("e").loginUser;
    this.initData();
    app.changeTabBar();
    this.setData({
      //判断是否可提现
      enable: loginUser.withdrawal_state === 1
    })
  },
  // 起止时间
  bindDateChange(e) {
    let { value } = e.detail;
    console.log("日期改变:", value);
    this.setData({
      beginDate: value
    })
  },
  bindDateChange1(e) {
    let { value } = e.detail;
    console.log("日期改变:", value);
    this.setData({
      endDate: value
    })
  },

  //加载数据
  initData: function () {
    //登录用户
    userLogin();
    //红包余额
    this.findBalance();
    //账单查询
    this.findBillRecord();
  },

  //申请体现
  onCashOut: function () {
    wx.navigateTo({
      url: '../tixianjine/tixianjine',
    })
  },

  //红包记录查询
  findBillRecord: function () {
    this.setData({
      billRecord: []
    })
    const e = wx.getStorageSync("e");
    // e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    const params = {
      uid: e.loginUser.id,
      startDay: this.data.beginDate,
      endDay: this.data.endDate
    }
    const that = this
    //消费记录
    util.postRequest(app.globalData.url + "user/red-log?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }

        that.setData({
          billRecord: data.data.data.map(item => {
            return {
              //消费日期
              time: item.create_time,
              //金额
              money: {
                //整数值
                numDigits: item.price.split('.')[0],
                //小数位数值
                decimalDigits: item.price.split('.')[1],
              },
              //账单类型
              type: item.type === 'in' ? that.data.BILLTYPE.INCOME : that.data.BILLTYPE.EXPEND,
            }
          })
        })
      })
  },

  //查询余额
  findBalance: function () {
    const loginUser = wx.getStorageSync("e").loginUser;
    this.setData({
      //余额
      balance: {
        //整数值
        numDigits: loginUser.red_envelope.split('.')[0],
        //小数位数值
        decimalDigits: loginUser.red_envelope.split('.')[1],
      },
    })
  },

})