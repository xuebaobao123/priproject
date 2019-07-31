const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import youhuijuanService from '../../utils/youhuijuanService'
import userTest from '../../utils/userTest'
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import bindUserInfo from '../../utils/bindUserInfo'
// pages/xiangqing/xiangqing.js
Page({
  data: {
    //项目名称
    projectName: '',
    content: '', //内容
    endDate: '', //截至日期
    //项目进度
    projectSpeed: {
      //文字描述
      projectDesc: '',
      //图片
      projectImage: ''
    },
    //参团人员
    userList: [{
      //名称
      userName: '',
      //头像
      headImg: '../images/weixin_03.png',
    }],
    shouquan: true,
  },
  onLoad: function (options) {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const shareParams = JSON.parse(options.shareParams);
    this.setData({
      shareParams: shareParams,
      shouquan: !!e,
      orUid: options.uid
    })

    this.initInvolvedContent(shareParams);
    //检索是分享还是参团
    this.isGroupOrShare().then(data => {
      if (data) { //分享
        this.setData({
          type: "fenxiang",
        })
      }
    });

  },
  //参团内容
  initInvolvedContent: async function (shareParams) {
    const e = wx.getStorageSync("e");
    var that = this;
    console.log('shareParams', shareParams)
    console.log('url', 'coupon/tuan-info')
    // 参团内容详情
    return util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, shareParams)
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
  //判断是参团还是分享
  isGroupOrShare: async function () {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid");
    const shareParams = this.data.shareParams
    const params = {
      uid: uid,
      tuan_id: shareParams.tuan_id,
    }
    // 参团人员头像
    return util.postRequest(app.globalData.url + "coupon/tuan-user?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        //循环判断，若登录用户存在于参团人员中，则是分享，若不存在，则是参团
        const haveList = data.data.data.filter(item => item.uid === uid + '');
        console.log('haveList', haveList);
        //表示用户存在于参团人员中，可以分享
        if (haveList && haveList.length > 0) {
          return true;
        }
        //表示用户不存在于参团人员中，表示参团
        return false;
      })
  },
  // 参团
  group: function () {
    //检测用户是否具有权限
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync('uid')
    const that = this
    const params = {
      uid,
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
              } else { }
            }
          })
        })
    })
  },
  //加载用户头像
  initUserList: function () {
    const that = this
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync('uid')
    const params = {
      uid,
      tuan_id: that.data.shareParams.tuan_id
    }
    console.log('userListParams',params)
    util.postRequest(app.globalData.url + "coupon/tuan-user?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }

        console.log('imgList',data.data.data.map(i=>{return i.avatarurl}))
        that.setData({
          kaituan: data.data.data[0].kaiTuan,
          userList: data.data.data.map(item => {
            return {
              headImg: item.avatarurl
            }
          })
        })
        console.log("开团", data.data.data[0].kaiTuan)

      })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      const that = this
      bindUserInfo(e.detail.userInfo)
        .then(({ accessToken, uid }) => {
          wx.setStorageSync('uid', uid)
          wx.setStorageSync('e', {
            ...e.detail.userInfo,
            accessToken
          })
          //用户登录
          return userLogin.initLoginUser();
        })
        .then(()=>{
          const e = wx.getStorageSync('e');
          const openId = e.loginUser.openid;
         
          //将分享传递过来的UID作为父级ID
          const parentId = that.data.params.uid
          const newE = {...e,openId,parentId}

          //更新用户信息
          return userLogin.registerOrUpdate(newE)
        })
        .then(() => {
          return that.initInvolvedContent(that.data.shareParams);
        })
        .then(() => {
          this.setData({
            shouquan: !this.data.shouquan,
          })
        })
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
  },

  //分享
  onShareAppMessage: function (res) {
    var uid = wx.getStorageSync('uid');
    const shareParams = {
      uid: uid,
      cid: this.data.shareParams.cid,
      tuan_id: this.data.shareParams.tuan_id,
      merchants_id: app.globalData.merchantsId
    }
    console.log(shareParams, "分享")
    return {
      title: this.data.canhuo.integralName,
      path: 'pages/cantuan/cantuan?uid=' + uid + '&shareParams=' + JSON.stringify(shareParams),
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