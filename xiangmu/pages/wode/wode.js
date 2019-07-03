const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  zhi:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();
  },
  onToggle(e) {
    if(this.data.zhi==1){
      this.setData({
        activeIndex: 1,
        zhi:2
      })
    }
    else{
      this.setData({
        activeIndex: 2,
        zhi:1
      })
    }
  },
})