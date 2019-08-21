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
    chanxun:"../images/touxiang.png",
    chanxun1: "../images/wenzi_03.png",
    chanpin:"../images/xinxi.png",
    border: "../images/border.png",
    neirong: "../images/cc_03.png",
    erweima: "../images/erweima.jpg",
    canhuo: "../images/canhuo_03.png",
    hidden:true
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
    const params = {
      ...shareParams,
      uid
    }
    if (e) {
      this.initInvolvedContent(params);
    }

    // //检索是分享还是参团
    // this.isGroupOrShare().then(data => {
    //   if (data) { //分享
    //     this.setData({
    //       type: "fenxiang",
    //     })
    //   }
    // });

  },
  onReady: function () {
    var that = this;
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
    const context = wx.createCanvasContext('shareFrends');
    context.setFillStyle('#dd7432')
    context.fillRect(0, 0, this.data.screenWidth -30, this.data.screenHeight)
    context.setLineWidth(2)
    context.drawImage(this.data.chanxun, 20,20, 50, 50);
    context.setFillStyle('white');
    context.setFontSize(12);
    context.setTextAlign('center');
    context.fillText("微信名称", 46, 86);
    context.drawImage(this.data.chanxun1, 80, 20, this.data.screenWidth/1.6, 50);
    context.drawImage(this.data.chanpin, 20, 110, this.data.screenWidth-70, 160);
    context.drawImage(this.data.border, 20, 220, this.data.screenWidth - 70, 50);
    var text = '这是一段文字用于文本自动换行文本长度自行设置欢迎大家指出缺陷';//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(12);
    context.setFillStyle("#000");
    context.setTextAlign('left');
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 250) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 170) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], 30, 240 + b * 20, 170);
    }



    var text = '满100减50元';//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(14);
    context.setFillStyle("#dd7432");
    context.setTextAlign('left');
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 40) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 260) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], 210, 240 + b * 20, 80);
    }
    context.setFillStyle('white');
    context.fillRect(0, 280, this.data.screenWidth - 30, 200);
    context.setLineWidth(2);
    context.drawImage(this.data.neirong, 80, 290, this.data.screenWidth - 180, 24);
    context.drawImage(this.data.erweima, 140, 325, 80, 80);
    context.drawImage(this.data.canhuo, 50, 400, 30, 30);
    context.setFillStyle('black');
    context.setFontSize(14);
    context.fillText("此处写小程序的slogin", 100, 420);
    context.draw()
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
            }
          })

          //刷新页面
          that.initInvolvedContent({
            ...that.data.shareParams,
            uid
          });
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
    console.log('userListParams', params)
    util.postRequest(app.globalData.url + "coupon/tuan-user?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }

        console.log('imgList', data.data.data.map(i => { return i.avatarurl }))
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
      this.setData({
        shouquan: true,
      })
      //将分享传递过来的UID作为父级ID
      const parentId = that.data.shareParams.uid
      bindUserInfo({ ...e.detail.userInfo, parentId })
        .then(({ accessToken, uid }) => {
          wx.setStorageSync('uid', uid)
          wx.setStorageSync('e', {
            ...e.detail.userInfo,
            accessToken
          })
          //用户登录
          return userLogin.initLoginUser();
        })
        .then(() => {
          const uid = wx.getStorageSync('uid');
          const shareParams = {
            ...that.data.shareParams,
            uid
          }
          console.log('参团参数:', shareParams)
          return that.initInvolvedContent(shareParams);
        })
        .then(() => {
          // this.setData({
          //   shouquan: true,
          // })
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
  //关闭
  guanbi:function(){
    this.setData({
      hidden:true
    })
  },
  fenxiang:function(){
    this.setData({
      hidden: false
    })
  },
  shouye: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  baocun:function(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.screenWidth,
      height: this.data.screenHeight,
      destWidth: this.data.screenWidth,
      destHeight: this.data.screenHeight,
      canvasId: 'shareFrends',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,   // 需要保存的图片地址
          success(res) {
            setTimeout(function () {
              wx.showToast({
                title: '图片保存成功',
                icon: 'success',
                duration: 2000
              })
            }, 1000)

          },
          fail: function (res) {
            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg == "saveImageToPhotosAlbum:fail:auth denied" || res.errMsg == "saveImageToPhotosAlbum:fail authorize no response") {
              wx.showModal({
                title: '提示',
                content: '需要授权才可保存图片',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingdata) {
                        if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                          wx.showToast({
                            title: '获取权限成功，再次点击可保存图片',
                            icon: 'none',
                            duration: 2000
                          })
                        } else {
                          wx.showToast({
                            title: '获取权限失败',
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      },
                      fail() {
                        wx.showToast({
                          title: '获取权限失败',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  }
})