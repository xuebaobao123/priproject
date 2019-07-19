const app = getApp();
import errorMessage from '../../utils/errorMessage'
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
    this.initData();
  },

  //初始化数据
  initData: function () {
    //请求数据
    //创建模拟数据
    this.setData({
      projectName: '项目名称写在这里,字体是思源黑体简体中无,字号是30px。',
      content: '满100减50元',//内容
      endDate: '2019/07/31',//截至日期
      projectSpeed: { projectDesc: '此处开始为项目的运营进度的详细介绍,字体是思源黑体字号控制在25px,可以图文并茂介绍。' },//项目进度
    })
  },
  // 返回
  fanhui: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 开团
  group: function () {
  }
})