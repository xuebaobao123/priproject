const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import DateFormat from '../../utils/dateFormat'
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
    beginDate: DateFormat.curDay(),
    endDate: DateFormat.curDay(),

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
    const that = this
    userLogin.initLoginUser().then(() => {
      const loginUser = wx.getStorageSync("e").loginUser;
      //红包余额
      that.findBalance(loginUser);
      //账单查询
      that.findBillRecord();
      that.setData({
        //判断是否可提现
        enable: loginUser.withdrawal_state === 1
      })
    });
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

  //申请体现
  onCashOut: function () {
    if (this.data.balance.numDigits == 0) {
      wx.showModal({
        title: '提示',
        content: '金额不能等于0',
      })
    }
    else {
      wx.navigateTo({
        url: '../tixianjine/tixianjine',
      })
    }
  },

  //红包记录查询
  findBillRecord: function () {
    this.setData({
      billRecord: []
    })
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    // e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    const params = {
      uid: uid,
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
  findBalance: function (loginUser) {
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