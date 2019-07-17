const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
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
      numDigits: 2000,
      //小数位数值
      decimalDigits: 21,
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
    this.initData();
    app.changeTabBar();
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
    this.initLoginUser();
    //红包余额
    this.findBalance();
    //账单查询
    this.findBillRecord();
  },

  //申请体现
  onCashOut: function () {
    const e = wx.getStorageSync("e");
    //申请提现
    util.postRequest(app.globalData.url + "withdrawal/add?access-token=" + e.accessToken, { uid: e.loginUser.id, mid: '' })
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        console.log('data.data.data', data)

        //将余额修改为0
        let loginUser = e.loginUser;
        loginUser = { ...loginUser, red_envelope: '0.00' }
        wx.setStorageSync('e', { ...e, loginUser: loginUser })
      })
  },

  //红包记录查询
  findBillRecord: function () {
    this.setData({
      billRecord: []
    })
    const e = wx.getStorageSync("e");
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    const params = {
      uid: 1,
      startDay:this.data.beginDate,
      endDay:this.data.endDate
    }
    const that = this
    //消费记录
    util.postRequest(app.globalData.url + "user/red-log?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        console.log('data', data);

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

  //获取登录用户信息
  initLoginUser: async function () {
    const e = wx.getStorageSync("e");
    e.accessToken = 'XXMrUxwlndZWdSN_ob6UO-CfFH2Ookr-';
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
})