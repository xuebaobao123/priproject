const app = getApp();
var util = require('../../utils/fengzhuang.js');
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
import userTest from '../../utils/userTest'
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
    imgUrls: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    app.changeTabBar();
    //加载轮播图
    this.initImgUrls();
    this.initData();
  },

  //初始化数据
  initData: function () {
    const e = wx.getStorageSync('e');
    const uid = wx.getStorageSync("uid");
    const that = this;
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
    }
    console.log(params)
    util.postRequest(app.globalData.url + "partner/info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return
        }
        that.setData({
          projectName: data.data.data.name,
          money: data.data.data.price,//金额
          endDate: data.data.data.end_time.substring(0,10),//截至日期
          surNumber: data.data.data.num,//剩余
          projectSpeed: { projectDesc: data.data.data.describe },//项目进度
          zhifu: data.data.data.partnerStatus

          // total: parseFloat(data.data.data.price * data.data.data.num).toFixed(2)//合计
        })
        console.log(that.data.zhifu)

      })

  },

  //加载轮播图
  initImgUrls: function () {
    var e = wx.getStorageSync('e');
    //消费记录
    const params = {
      "type": 3, //表示参伙
      "merchants_id": app.globalData.merchantsId//商家ID，暂定为1
    }
    const that = this
    util.postRequest(app.globalData.url + "banner/list?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return
        }
        that.setData({
          imgUrls: data.data.data.map(item => {
            return item.address
          })
        })

      })
  },
  zhifu: function () {
    const that = this;
    var e = wx.getStorageSync('e');
    const uid = wx.getStorageSync("uid")

    // //检测用户是否具有权限
    // if (!userTest()) {
    //   return;
    // }

    wx.showModal({
      title: '提示',
      content: '确认支付',
      showCancel: false,
      confirmText: '确定',
      success: function (res) {
        // 用户没有授权成功，不需要改变 isHide 的值
        if (res.confirm) {
          const params = {
            "uid": uid,
            "merchants_id": app.globalData.merchantsId
          }
          util.postRequest(app.globalData.url + "partner/order?access-token=" + e.accessToken, params)
            .then(function (data) {
              wx.requestPayment({
                "timeStamp": data.data.data.timeStamp,
                "nonceStr": data.data.data.nonceStr,
                "package": data.data.data.package,
                "signType": data.data.data.signType,
                "paySign": data.data.data.paySign,
                success(res) {
                  const params = {
                    "uid": uid,
                    "merchants_id": app.globalData.merchantsId,
                    "oid": data.data.data.oid
                  }
                  util.postRequest(app.globalData.url + "partner/getpaystatus?access-token=" + e.accessToken, params)
                    .then(function (data) {
                      that.setData({
                        zhifu: data.data.data.status,
                      })
                      if (data.data.data.status == 1) {
                        that.onLoad();
                        that.zhifu();
                      }
                      else {
                        that.onLoad();
                      }
                    })
                },
                fail(res) { }
              })
            })
        }
      }
    });

  }
})