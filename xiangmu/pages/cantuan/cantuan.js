const app = getApp();
var util = require('../../utils/fengzhuang.js');
// pages/xiangqing/xiangqing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //项目名称
    projectName: '',
    content: '',//内容
    endDate: '',//截至日期
    //项目进度
    projectSpeed: {
      //文字描述
      projectDesc: '',
      //图片
      projectImage: ''
    },
    //参团人员
    userList: [
      {
        //名称
        userName: '',
        //头像
        headImg: '../images/weixin_03.png',
      }
    ],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();
    // this.initData();
    this.initInvolvedData()
  },

   //我参与的团数据
  initInvolvedData: function () {
    const that = this
    const e = wx.getStorageSync("e");
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    const params = {
      uid: e.loginUser.id,
    }
    util.postRequest(app.globalData.url + "user/participate-list?access-token=" + e.accessToken,params)
    .then(function (data) {
      if (data.success && !data.success) {
        console.log('检索失败，' + data.message);
        return;
      }
      if (data.data.status != '200') {
        console.log('参团接口请求失败，错误信息：' + data.data.msg);
        return;
      }
      that.setData({
        //
      })

    })
  },

  //初始化数据
  initData: function () {
    //请求数据
    //创建模拟数据
    this.setData({
      projectName: '项目名称写在这里,字体是思源黑体简体中无,字号是30px。',
      content: '满100减50元',//内容
      endDate: '2019/07/31',//截至日期
      surNumber: '3',//剩余
      projectSpeed: { projectDesc: '此处开始为项目的运营进度的详细介绍,字体是思源黑体字号控制在25px,可以图文并茂介绍。' },//项目进度
      //参团人
      userList: [
        { headImg: '../images/weixin_03.png' }
      ]
    })

    this.initUserList();
  },
  // 开团
  group: function () {
    const that = this
    const e = wx.getStorageSync("e");
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    const params = {
      uid: e.loginUser.id,
      tuan_id: 0
    }
    
    util.postRequest(app.globalData.url + "add-tuan?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        if (data.data.status != '200') {
          console.log('参团接口请求失败，错误信息：' + data.data.msg);
        }

      })
    // wx.navigateTo({
    //   url: '../cantuan/cantuan',
    // })
  },
  //加载用户头像
  initUserList: function () {
    const that = this
    const e = wx.getStorageSync("e");
    const params = {
      uid: e.loginUser.id,
      tuan_id: 0
    }
    util.postRequest(app.globalData.url + "coupon/tuan-user?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        that.setData({
          userList: data.data.data.map(item => {
            return { headImg: item.avatarurl }
          })
        })

      })
  }
})