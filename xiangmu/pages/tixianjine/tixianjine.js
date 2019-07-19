const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
Page({
  data: {
    //余额
    balance: {
      //整数值
      numDigits: 0,
      //小数位数值
      decimalDigits: 0,
    },
  },
  onLoad: function (options) {
    userLogin();
    //红包余额
    this.findBalance();
  },
  //申请
  shenqing: function () {
    const e = wx.getStorageSync("e");
    //申请提现
    util.postRequest(app.globalData.url + "withdrawal/add?access-token=" + e.accessToken, { uid: e.loginUser.id, mid: '' })
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        //将余额修改为0
        let loginUser = e.loginUser;
        loginUser = { ...loginUser, red_envelope: '0.00' }
        wx.setStorageSync('e', { ...e, loginUser: loginUser })
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