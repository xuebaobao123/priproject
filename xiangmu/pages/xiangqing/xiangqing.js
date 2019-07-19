const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
// pages/xiangqing/xiangqing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    //项目名称
    projectName: '',
    money: '',//金额
    endDate: '',//截至日期
    surNumber: '',//剩余
    //项目进度
    projectSpeed: {
      //文字描述
      projectDesc: '',
      //图片
      projectImage: ''
    },
    total: '',//合计
    imgUrls: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    app.changeTabBar();
    //加载轮播图
    this.initImgUrls();
    this.initData();
  },

  //初始化数据
  initData: function () {
    const e = wx.getStorageSync('e');
    const loginUser = e.loginUser;
    const that = this;
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se'
    const params = {
      merchants_id: '1',
      uid: loginUser.id,
    }

    util.postRequest(app.globalData.url + "partner/info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if(!errorMessage(data)){
          return
        }
        that.setData({
          projectName: data.data.data.name,
          money: data.data.data.price,//金额
          endDate: data.data.data.end_time,//截至日期
          surNumber: data.data.data.num,//剩余
          projectSpeed: { projectDesc: data.data.data.describe },//项目进度
          total: parseFloat(data.data.data.price * data.data.data.num).toFixed(2)//合计
        })

      })

  },

  //加载轮播图
  initImgUrls: function () {
    var e = wx.getStorageSync('e');
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    //消费记录
    const params = {
      "type": 3, //表示参伙
      "merchants_id": 1//商家ID，暂定为1
    }
    const that = this
    util.postRequest(app.globalData.url + "banner/list?access-token=" + e.accessToken, params)
      .then(function (data) {
        if(!errorMessage(data)){
          return
        }
        that.setData({
          imgUrls: data.data.data.map(item => {
            return item.address
          })
        })

      })
  },
  zhifu:function(){
    const that = this;
    var e = wx.getStorageSync('e');
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    wx.showModal({
      title: '提示',
      content: '确认支付',
      showCancel: false,
      confirmText: '确定',
      success: function (res) {
        // 用户没有授权成功，不需要改变 isHide 的值
        if (res.confirm) {
          const params = {
            "uid": 3,
            "merchants_id": 1
          }
          util.postRequest(app.globalData.url + "partner/order?access-token=" + e.accessToken, params)
            .then(function (data) {
            })
        }
      }
    });
   
  }
})