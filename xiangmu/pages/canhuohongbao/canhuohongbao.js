const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"2019-7-6",
    date1: "2019-7-6"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();
  },
  // 起止时间
  bindDateChange(e) {
    let { value } = e.detail;
    console.log("日期改变:", value);
    this.setData({
      date: value
    })
  },
  bindDateChange1(e) {
    let { value } = e.detail;
    console.log("日期改变:", value);
    this.setData({
      date1: value
    })
  },
})