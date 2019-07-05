const app = getApp();
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
    beginDate: "2019-7-6",
    endDate: "2019-7-6",

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
    this.setData({
      billRecord: [
        {
          //消费日期
          time: '2019-06-20',
          //金额
          money: {
            //整数值
            numDigits: 50,
            //小数位数值
            decimalDigits: '10',
          },
          //账单类型
          type: this.data.BILLTYPE.INCOME,
          //账单描述
          desc: ''
        },
        {
          //消费日期
          time: '2019-06-20',
          //金额
          money: {
            //整数值
            numDigits: 20,
            //小数位数值
            decimalDigits: '01',
          },
          //账单类型
          type: this.data.BILLTYPE.EXPEND,
          //账单描述
          desc: ''
        },
        {
          //消费日期
          time: '2019-07-20',
          //金额
          money: {
            //整数值
            numDigits: 40,
            //小数位数值
            decimalDigits: '01',
          },
          //账单类型
          type: this.data.BILLTYPE.INCOME,
          //账单描述
          desc: ''
        },
      ]
    })
  }
})