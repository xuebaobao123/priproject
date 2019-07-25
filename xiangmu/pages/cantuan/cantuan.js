const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
import userTest from '../../utils/userTest'
// pages/xiangqing/xiangqing.js
Page({
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
  onLoad: function (options) {
    console.log('cantuan.options', options);
    const shareParams = JSON.parse(options.shareParams);
    console.log(shareParams)
    this.setData({
      shareParams: shareParams,
      type:options.type
    })
    app.changeTabBar();
    this.initInvolvedContent(shareParams);
  },
  //参团内容
  initInvolvedContent: function (shareParams) {
    const e = wx.getStorageSync("e");
    var that = this;
    // 参团内容详情
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, shareParams)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        that.initUserList();
        let curData = youhuijuanService.mapData(data.data.data)
        curData.validityDate.endDate = curData.validityDate.endDate.substring(0, 10);
        console.log(curData, "详情数据")
        that.setData({
          canhuo: curData
        })
      })
  },
  // 参团
  group: function () {
    //检测用户是否具有权限
    const that = this
    console.log('cantuan.group.shareParams',that.data.shareParams)
    const e = wx.getStorageSync("e");
    const params = {
      uid: e.loginUser.id,
      tuan_id: that.data.shareParams.tuan_id
    }
    console.log('cantuan.group.params',params)
    userTest().then(data => {
      if (!data)
        return;
      util.postRequest(app.globalData.url + "coupon/add-tuan?access-token=" + e.accessToken, params)
        .then(function (data) {
          if (!errorMessage(data)) {
            return;
          }

          wx.showModal({
            title: "参团成功",
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../index/index'
                })
              } else {
              }
            }
          })
        })
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
        if (!errorMessage(data)) {
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