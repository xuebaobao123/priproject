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
    console.log(options)
    this.setData({
      options: options
    })
    userLogin();
    app.changeTabBar();
    // this.initData();
    this.initInvolvedData();
    this.initInvolvedContent();
  },

  //我参与的团数据
  initInvolvedData: function () {
    const that = this
    const e = wx.getStorageSync("e");
    const params = {
      uid: e.loginUser.id,
    }
    util.postRequest(app.globalData.url + "user/participate-list?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        that.setData({
          //
        })

      })
  },
  //参团内容
  initInvolvedContent:function(){
    const e = wx.getStorageSync("e");
    var that=this;
    const params={
      merchants_id:app.globalData.merchantsId,
      uid: e.loginUser.id,
      tuan_id:that.data.options.tuan_id,
      cid:that.data.options.ct_id,
    }
    // 参团内容详情
    util.postRequest(app.globalData.url + "user/participate-list?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
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
    const params = {
      uid: e.loginUser.id,
      tuan_id: that.data.options.tuan_id
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
  },
  //分享
  onShareAppMessage: function (res) {
    const params = {
      uid: this.data.params.uid,
      tuan_id: this.data.params.tuan_id
    }
    return {
      title: '分享优惠券',
      path: 'pages/cantuan/cantuan?params=' + params,
      imageUrl: '../images/canhuo.png',
      success: function (res) {
        console.log(res, "分享成功")
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        console.log(res, "失败")
        // 分享失败
      },
    }
  },
})