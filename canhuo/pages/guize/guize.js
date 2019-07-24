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
    baseURL:'http://ch.cityzht.com/ruleview/detail'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      srcURL: this.data.baseURL +"?mid=1&type="+options.type
    })
  },
})