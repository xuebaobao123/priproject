const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
import userTest from '../../utils/userTest'
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
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
    shouquan:true,
  },
  onLoad: function (options) {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");

    console.log();
    const shareParams = JSON.parse(options.shareParams);
    this.setData({
      shareParams: shareParams,
      type: options.uid == uid ? "fenxiang" : "",
      shouquan: !!e,
      orUid: options.uid
    })
    console.log("options",options)
    app.changeTabBar();
    this.initInvolvedContent(shareParams)
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
    const e = wx.getStorageSync("e");
    const loginUser = wx.getStorageSync("e").loginUser;
    const that = this
    const params = {
      uid: loginUser.id,
      tuan_id: that.data.shareParams.tuan_id
    }
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
      tuan_id: that.data.shareParams.tuan_id
    }
    
    util.postRequest(app.globalData.url + "coupon/tuan-user?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        that.setData({
          kaituan: data.data.data[0].kaiTuan,
          userList: data.data.data.map(item => {
            return { headImg: item.avatarurl }
          })
        })
        console.log("开团",data.data.data[0].kaiTuan)

      })
  },

  bindGetUserInfo: function (e) {
    wx.setStorageSync('e', e.detail.userInfo);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //加载token
      that.initToken();

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
    this.setData({
      shouquan: !this.data.shouquan,
    })
  },
  initToken: async function () {
    var e = wx.getStorageSync('e');
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          var data = {
            merchants_id: app.globalData.merchantsId,
            client_code: res.code,
          }
          util.postRequest(app.globalData.url + "auth/openid", data)
            .then(function (data) {
              if (!(errorMessage(data))) {
                return;
              }
              wx.setStorageSync("openid", data.data.data.openid)
              util.postRequest(app.globalData.url + "auth/login", { openid: data.data.data.openid })
                .then(function (tokenData) {
                  if (!(errorMessage(tokenData))) {
                    return;
                  }
                  //成功获取token
                  wx.setStorageSync("e", { ...e, accessToken: tokenData.data.data.access_token })
                  that.initlogin();
                  //轮播图

                }, function (error) {
                })
            }, function (error) {
            })
        }
      }
    })
  },
   initlogin: function () {
     var that=this;
    var e = wx.getStorageSync('e');
    var data = {
      merchants_id: app.globalData.merchantsId,
      openid: wx.getStorageSync('openid'),
      nickname: e.nickName,
      avatarurl: e.avatarUrl,
      gender: e.gender,
      province: e.country,
      city: e.city,
      country: e.province,
      parent_id: "",
    }
    util.postRequest(app.globalData.url + "user/up-info?access-token=" + e.accessToken, data)
      .then(function (data) {
        wx.setStorageSync("uid", data.data.data.uid);
        that.initInvolvedContent(that.data.shareParams);
        userLogin();
      }, function (error) {
      })
  },
  //分享
  onShareAppMessage: function (res) {
    var uid = wx.getStorageSync('uid');
    const shareParams={
      uid: uid,
      cid:this.data.shareParams.cid,
      tuan_id:this.data.shareParams.tuan_id,
      merchants_id: app.globalData.merchantsId
    }
    console.log(shareParams,"分享")
    return {
      title: '分享优惠券',
      path: 'pages/cantuan/cantuan?uid='+uid+'&shareParams=' + JSON.stringify(shareParams),
      imageUrl: this.data.canhuo.imgUrl,
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
