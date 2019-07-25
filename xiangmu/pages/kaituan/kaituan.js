const app = getApp();
import errorMessage from '../../utils/errorMessage';
var util = require('../../utils/fengzhuang.js');
import youhuijuanService from '../../utils/youhuijuanService'
Page({
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
  onLoad: function (options) {
    console.log()
    app.changeTabBar();
    const params = JSON.parse(options.params);
    //存放参数
    this.setData({
      params: params
    })
    this.initOrganGroupData(params)
    console.log(options)
  },
  initOrganGroupData: function (params) {
    const e = wx.getStorageSync("e");
    const that = this;
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        let curData = youhuijuanService.mapData(data.data.data)
        curData.validityDate.endDate = curData.validityDate.endDate.substring(0, 10)
        that.setData({
          data: curData
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
    const e = wx.getStorageSync("e");
    const params = {
      ct_id: this.data.ctid,
      uid: this.data.params.uid,
    }
    var that = this;
    util.postRequest(app.globalData.url + "partner/open?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!userTest()) {
          return;
        }
        // if (data.code == 200) {
        const shareParams = {
          uid: that.data.params.uid,
          cid: that.data.params.cid,
          tuan_id: data.data.data.tuan_id,
          merchants_id: app.globalData.merchantsId
        }
        this.setData({
          shareParams: shareParams
        })
        wx.showModal({
          title: "开团成功",
          showCancel: true,
          success: function (res) {
            // if (res.confirm) {
            //   wx.redirectTo({
            //     url: '../cantuan/cantuan?params=' + JSON.stringify(params1)
            //   })
            // } else {
            // }
          }
        })
        // }
      })
  },

  //分享
  onShareAppMessage: function (res) {
    
    return {
      title: '分享优惠券',
      path: 'pages/cantuan/cantuan?params=' + JSON.stringify(this.data.shareParams),
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