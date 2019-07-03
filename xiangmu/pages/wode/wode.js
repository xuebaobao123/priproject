const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhi: 1,
    //积分
    integral: 2000,
    //优惠券数量
    couponCount: 2,
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
        //时间描述
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
      }
    ],
    //详细列表
    detailArray: [
      { text: '我参与的团', img: '../images/jiantou-2_03.png', fowardUrl: '11' },
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
    console.log(this.data);
    app.changeTabBar();
  },
  onToggle(e) {
    if (this.data.zhi == 1) {
      this.setData({
        activeIndex: 1,
        zhi: 2
      })
    }
    else {
      this.setData({
        activeIndex: 2,
        zhi: 1
      })
    }
  },

  //跳转
  foward: function (e) {
    //单个
    const detail = this.data.detailArray[e.currentTarget.dataset.index];
    //跳转页面
    // wx.redirectTo({
    //   url:detail.fowardUrl
    // })
  },
  //进入优惠券包
  goCouponPage: function (e) {
    wx.redirectTo({
      url: '../youhuijuan/youhuijuan'
    })
  }
})