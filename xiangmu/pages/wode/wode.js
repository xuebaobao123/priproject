const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //累计积分
    cumIntegral: 2000,
    //优惠券数量
    couponCount: 2,
    //可用积分
    usableIntegral:300,
    //余额
    surplus: {
      //整数值
      numDigits: 5000,
      //小数位数值
      decimalDigits: 20,
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
  },

  //消费查询
  findConsumeRecord:function(){

    //消费记录展示判断条件
    let activeIndex = this.data.activeIndex||false;
    this.setData({
      activeIndex: !!!activeIndex,
    })
  },

  //查询累计积分
  findCumIntegral:function(){

  },

  //查询优惠券个数
  findCouponCount:function(){

  },
  
  //查询可用积分
  findUsableIntegral:function(){

  },

  //跳转
  foward: function (e) {
    //单个
    const detail = this.data.detailArray[e.currentTarget.dataset.index];
    //跳转页面
    wx.redirectTo({
      url:detail.fowardUrl
    })
  },
  //进入优惠券包
  goCouponPage: function (e) {
    wx.redirectTo({
      url: '../youhuijuan/youhuijuan'
    })
  }
})