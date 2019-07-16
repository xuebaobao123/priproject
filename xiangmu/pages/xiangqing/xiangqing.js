const app = getApp();
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
    app.changeTabBar();
    //加载轮播图
    this.initImgUrls();
    this.initData();
  },

  //初始化数据
  initData: function () {
    const loginUser = wx.getStorageSync('e').loginUser;
    //请求数据
    // this.setData({
    //   projectName: '项目名称写在这里,字体是思源黑体简体中无,字号是30px。字数不宜过多,控制在量行内即可。',
    //   money: '5000.00',//金额
    //   endDate: '2019/07/31',//截至日期
    //   surNumber: '3',//剩余
    //   projectSpeed: { projectDesc: '此处开始为项目的运营进度的详细介绍,字体是思源黑体字号控制在25px,可以图文并茂介绍。' },//项目进度
    //   total: '5000.00'//合计
    // })
    const params = {
      merchants_id: '3',
      uid: loginUser.id,
    }

    util.postRequest(app.globalData.url + "partner/info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
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
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        that.setData({
          imgUrls: data.data.data.map(item => {
            return item.address
          })
        })

      })
  }
})