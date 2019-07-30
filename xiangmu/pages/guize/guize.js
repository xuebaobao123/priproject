const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import userTest from '../../utils/userTest'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const params={
      merchants_id:app.globalData.merchantsId,
      type:options.type
    }
    const e=wx.getStorageSync("e");
    util.postRequest(app.globalData.url + "rule/index?access-token=" + e.accessToken, params)
      .then(function (data) {
        console.log(data)
        if (!(errorMessage(data))) {
          return;
        }
        that.setData({
          guize:data.data.data
        })
      })
  },
})