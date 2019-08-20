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
    enable: false
  },
  onLoad: function (options) {
    userLogin.initLoginUser();
    const loginUser = wx.getStorageSync("e").loginUser;
    //红包余额
    this.findBalance();
  },
  //申请
  shenqing: function () {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid")
    //申请提现
    util.postRequest(app.globalData.url + "withdrawal/add?access-token=" + e.accessToken, { uid: uid, merchants_id: app.globalData.merchantsId })
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        wx.showToast({
          title: "提现成功",
          icon: 'success',
          duration: 2000
        })

        wx.redirectTo({
          url: '../canhuohongbao/canhuohongbao',
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