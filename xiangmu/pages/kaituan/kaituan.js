const app = getApp();
import errorMessage from '../../utils/errorMessage';
var util = require('../../utils/fengzhuang.js');
// pages/xiangqing/xiangqing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
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
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();
    /**
     * 参数 
     * uid：  用户id
       ct_id: 优惠券id
     */
    const params = options.params;
    //存放参数
    this.setData({
      params: params
    })

    this.initOrganGroupData({ uid: params.uid, cid: params.ct_id, merchants_id: app.globalData.merchantsId })
  },

  initOrganGroupData: function (params) {
    const e = wx.getStorageSync("e");
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        that.setData({
          headImg: data.data.data.pic,
          projectName: data.data.data.name,
          //截至日期暂时获取开团结束日期。。可能是参团截至日期
          endDate: data.data.data.end_time,
          projectSpeed: {
            projectDesc: data.data.data.describe,
          }
        })
      })
  },
  //初始化数据
  // initData: function () {
  //   this.setData({
  //     projectName: '项目名称写在这里,字体是思源黑体简体中无,字号是30px。',
  //     content: '满100减50元',//内容
  //     endDate: '2019/07/31',//截至日期
  //     projectSpeed: { projectDesc: '此处开始为项目的运营进度的详细介绍,字体是思源黑体字号控制在25px,可以图文并茂介绍。' },//项目进度
  //   })
  // },
  // 返回
  fanhui: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 开团
  group: function () {
    const params = this.data.params;
    util.postRequest(app.globalData.url + "partner/open?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        //开团成功
        wx.showToast({
          title: '',
          icon: 'success',
          duration: 2000
        })
      })
  },
  //分享
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: '分享优惠券',
      path: 'pages/lijiduihuan/lijiduihuan',
      imageUrl: '../images/touxiang.png',  //用户分享出去的自定义图片大小为5:4,
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