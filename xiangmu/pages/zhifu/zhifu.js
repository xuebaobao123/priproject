// pages/youhuijuan/youhuijuan.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage';
import userTest from '../../utils/userTest'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,//弹框
    title:app.globalData.title,
    //优惠券数组
    //券类型
    COUPONTYPE: {
      //开团券
      GROUP: 0,
      //优惠券
      DISCOUNT: 1,
    },
    couponArray: [
      {
        //主键,扩展
        id: 1,
        //需要积分
        needIntegral: 20,
        integralName: '此处写名字,字体是思源黑体',
        //规则
        content: '满200元减100元',
        //数量
        number: 3,
        //优惠说明
        integralExplain: '优惠说明',
        //有效期
        validityDate: {
          //开始时间
          beginDate: '',
          //结束时间
          endDate: '',
          //文字描述
          desc: ''
        },
        //使用须知
        useRequire: '',
        //优惠券所有者
        owner: '',
        //优惠券图片
        imgUrl: '',
      }
    ],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    usableIntegral: 300,
    money:{
      price:0,
      balance:0,
      discount_amount:0
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      moneyZf:0
   })
  },
  //我的优惠券包
  initUserCouponArrayData: function () {
    const uid=wx.getStorageSync("uid");
    const params = {
      uid: uid,
      merchants_id: app.globalData.merchantsId,
      price:this.data.moneyZf
    }
    this.initDataFromUrl('coupon/coupon-list', params)
  },
  /**
   * 从不同的接口路径加载不同的数据
   * @param {*} url 
   */
  initDataFromUrl(url, params) {
    const e = wx.getStorageSync("e");
    this.setData({
      usableIntegral: e.loginUser.integral
    })
    const that = this
    //优惠券记录
    util.postRequest(app.globalData.url + url + "?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return;
        }
        that.setData({
          hidden: false,
          couponArray: data.data.data.map(item => {
            return that.mapData(item);
          })
        })
      })
  },
   //封装后台对象至页面对象
   mapData: function (item) {
    //根据优惠券类型显示内容
    return {
      id: item.id,
      //需要积分
      needIntegral: 30,
      integralName: item.name,
      cuid:item.cuid,
      //规则
      content: this.concatContent(item),
      //数量
      number: 3,
      //优惠说明
      integralExplain: item.describe,
      //有效期
      validityDate: {
        //开始时间
        beginDate: item.start_time,
        //结束时间
        endDate: item.end_time,
        //文字描述
        desc: '使用时段1'
      },
      //使用须知
      useRequire: '使用须知1',
      //优惠券所有者
      owner: '',
      imgUrl: item.pic,
      couponType: this.couponType(item),
      accessType: this.initAccessType(item),
    }
  },
  //拼接代金券描述
  concatContent: function (item) {
    let content = "";
    switch (item.type) {
      case "1":
        //通用劵展示优惠金额
        content = item.discount_amount + "元代金券"
        break;
      case "2":
        //满减券展示满多少减多少
        content = "满" + item.restrict_amount + "元减" + item.discount_amount + "元";
        break;
      case "3":
        //折扣券展示折扣比例
        content = item.discount + "折"
    }
    return content;
  },
  //加载优惠券类型
  couponType: function (item) {
    return (item.access && item.access === '2') ? this.data.COUPONTYPE.GROUP : this.data.COUPONTYPE.DISCOUNT
  },
  //优惠券获取方式
  initAccessType: function (item) {
    //默认获取方式
    if (!item.access) {
      return {
        //文字描述
        content: '立即兑换',
        //事件
        targetEvent: 'exchange'
      }
    }
    let accessType = null
    switch (item.access) {
      case "1":
        accessType = { content: '立即兑换', targetEvent: 'exchange' }
        break;
      case "2":
        accessType = { content: '立即领取', targetEvent: 'exReceive' }
        break;
      case "3"://暂时将优惠券获取方式的团购方式设置为我要开团，后续有变更可调整
        accessType = { content: '我要开团', targetEvent: 'organGroup' }
        break;
    }
    return accessType;
  },
  //立即兑换
  exchange: function (event) {
    const current = wx.getStorageSync("e");
    const uid=wx.getStorageSync("uid");
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: uid,
      cid: event.currentTarget.dataset.id,
      type: 1//表示兑换
    }
    util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + current.accessToken, params)
      .then(function (data) {
        if(data.code==200){
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
      }
     else{

    }
      })
  },
  //立即领取
  exReceive: function () {
    const current = wx.getStorageSync("e");
    const currentCoupon = this.data.couponArray[e.detail.value];
    const params = {
      merchants_id: app.globalData.merchantsId,
      uid: current.loginUser.id,
      cuid: currentCoupon.id,
      type: 2//表示领取
    }
    util.postRequest(app.globalData.url + "coupon/coupon-acquire?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return
        }
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })

      })
  },
  //开团
  organGroup: function (event) {
    const current = wx.getStorageSync("e");
    const uid=wx.getStorageSync("uid");
    const currentCoupon = this.data.couponArray[e.detail.value]
    const params = {
      // merchants_id: app.globalData.merchantsId,
      uid:uid,
      ct_id:event.currentTarget.dataset.id
      // cid: currentCoupon.id,
      // tuan_id: currentCoupon.tuan_id
    }
    //跳转至开团详情页面
    wx.redirectTo({
      url: '../kaituan/kaituan?params=' + JSON.stringify(params)
    })
  },
  // 返回
  fanhui: function () {
    // wx.navigateBack({ 
    //   changed: true 
    // })
    wx.redirectTo({
      url: '../index/index',
    })
  },
  //我的会员
  goMyMember: function () {
    wx.redirectTo({
      url: '../wode/wode'
    })
  },
  // 立即兑换
  exchange: function () {
    wx.navigateTo({
      url: '../lijiduihuan/lijiduihuan',
    })
  },
  youhui:function(){
    this.initUserCouponArrayData();
   
  },
  guanbi:function(){
    this.setData({
      hidden: true
    })
  },
  money:function(e){
    this.setData({
      moneyZf:e.detail.value
    })
  },
  // 优惠券
  youhuijuan: function (event){
    const e = wx.getStorageSync("e");
      const params = {
        merchants_id: app.globalData.merchantsId,
        uid: e.loginUser.id,
        price: this.data.moneyZf,
        cuid: event.currentTarget.dataset.id
      }
      this.setData({
        cuid: event.currentTarget.dataset.id
      })
      var that = this;
      util.postRequest(app.globalData.url + "checkstand/price?access-token=" + e.accessToken, params)
        .then(function (data) {
          if (data.data.status==200) {
            that.setData({
              hidden: true,
              money: data.data.data
            })
          }
          else{
            wx.showModal({
              content: data.data.msg,
            })
          }
        })
  },
  // 支付
  zhifu:function(){
    const e = wx.getStorageSync("e");
  if (this.data.moneyZf > 0) {
      const params = {
        merchants_id: app.globalData.merchantsId,
        uid: e.loginUser.id,
        price: this.data.moneyZf,
        cuid: this.data.cuid ? this.data.cuid:""
      }
      //检测用户是否具有权限
      if (!userTest()) {
        return;
      }
      //支付
      const that = this;
      util.postRequest(app.globalData.url + "checkstand/order?access-token=" + e.accessToken, params)
        .then(function (data) {
          if (!(errorMessage(data))) {
            return;
          }
          if(data.data.data.type=="ok"){
            wx.redirectTo({
              url: '../index/index',
            })
          }
          else{
            wx.requestPayment({
              "timeStamp": data.data.data.pay.timeStamp,
              "nonceStr": data.data.data.pay.nonceStr,
              "package": data.data.data.pay.package,
              "signType": data.data.data.pay.signType,
              "paySign": data.data.data.pay.paySign,
              success(res) {
                wx.showModal({
                  title: "支付成功",
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    } else {
                    }
                  }
                })
                
              }
            })
          }
          
        })
      }
   else {
    wx.showModal({
      title: '金额不能为空',
    })
  }
  }
})