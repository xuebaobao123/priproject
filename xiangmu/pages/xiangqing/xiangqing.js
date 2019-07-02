// pages/xiangqing/xiangqing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //项目名称
    projectName: '',
    money: '',//金额
    endDate: '',//截至日期
    surNumber: '',//剩余
    //项目进度
    projectSpeed:{
      //文字描述
      projectDesc:'',
      //图片
      projectImage:''
    },
    total: ''//合计
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //初始化数据
  initData: function () {

    //请求数据

    //创建模拟数据
    this.setData({
      projectName: '项目名称写在这里,字体是思源黑体简体中无,字号是30px。字数不宜过多,控制在量行内即可。',
      money: '5000.00',//金额
      endDate: '2019/07/31',//截至日期
      surNumber: '3',//剩余
      projectSpeed:{projectDesc:'此处开始为项目的运营进度的详细介绍,字体是思源黑体字号控制在25px,可以图文并茂介绍。'},//项目进度
      total: '5000.00'//合计
    })
  },
  
})