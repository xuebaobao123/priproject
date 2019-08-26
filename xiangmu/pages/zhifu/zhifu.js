// pages/youhuijuan/youhuijuan.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
import errorMessage from '../../utils/errorMessage';
import userTest from '../../utils/userTest'
import youhuijuanService from '../../utils/youhuijuanService'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true, //弹框
    title: app.globalData.title,
    //优惠券数组
    //券类型
    COUPONTYPE: {
      //开团券
      GROUP: 0,
      //优惠券
      DISCOUNT: 1,
    },
    couponArray: [{
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
    }],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    usableIntegral: 300,
    money: {
      price: 0,
      balance: 0,
      discount_amount: 0,
      payPrice: 0,
      content:''
    },
    reloadFlag: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const loginUser = wx.getStorageSync("e").loginUser;
    this.setData({
      moneyZf: 0,
      loginUser:loginUser
    })
  },
  //我的优惠券包
  initUserCouponArrayData: function () {
    const uid = wx.getStorageSync("uid");
    const params = {
      uid: uid,
      merchants_id: app.globalData.merchantsId,
      price: this.data.moneyZf
    }
    const that = this
    youhuijuanService.initDataFromUrl('coupon/coupon-list', params).then(data=>{
      that.setData({
        couponArray:data,
        hidden: false,
      })
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
  youhui: function () {
    if (this.data.moneyZf=='' || this.data.moneyZf.trim() == '') {
      return;
    }
    if (parseFloat(this.data.moneyZf) <= 0) {
      return;
    }
    this.initUserCouponArrayData();

  },
  guanbi: function () {
    this.setData({
      hidden: true
    })
  },

  //请输入金额输入框
  money: function (e) {
    if (e.detail.value.trim() === '') {
      this.clearData()
      return;
    }
    //计算使用余额
    const currentCoupon = this.data.currentCoupon||{}
    this.computeMoney(currentCoupon,e.detail.value).then(flag=>{
      if(flag){
        const reloadFlag = this.data.reloadFlag
        this.setData({
          moneyZf: e.detail.value,
        })
      }
    });
  },

  clearData:function(){
    this.setData({
      money:{
        price: 0,
        balance: 0,
        discount_amount: 0,
        payPrice: 0,
        content:''
      },
      currentCoupon:{},
      reloadFlag:false
    })
  },
  // 优惠券
  youhuijuan: function (event) {
    const e = wx.getStorageSync("e");
    const id = event.currentTarget.dataset.id||'';
    const currentCoupon = this.data.couponArray.filter(item=>item.id===id)[0];
    this.setData({
      currentCoupon: currentCoupon
    })
    this.computeMoney(currentCoupon,this.data.moneyZf);
  },

  //计算使用余额
  computeMoney: async function (currentCoupon,price){
    if(!!!price)
      return
    const e = wx.getStorageSync("e");
    console.log("currentCoupon", currentCoupon)
    let params = {
      merchants_id: app.globalData.merchantsId,
      uid: e.loginUser.id,
      price: price,
    }
    if (!!!currentCoupon.id) {
      params = {
        ...params,
        cid: currentCoupon.id
      }
    } else {
      if (currentCoupon.cuid){
        params = {
          ...params,
          cuid: currentCoupon.cuid
        }
      }
    }
    this.setData({
      params: params
    })
    var that = this;
    return util.postRequest(app.globalData.url + "checkstand/price?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!errorMessage(data)) {
          return false;
        }
        console.log(data)
        const curMoney = data.data.data
        that.setData({
          hidden: true,
          money: {
            ...curMoney,
            discount_amount: curMoney.discount_amount||0,
            price: curMoney.price||0,
            content: currentCoupon ? currentCoupon.content : '',
          },        
          reloadFlag: true
        })

        return true
      })
  },
  // 支付
  zhifu: function () {
    if (this.data.moneyZf=='' || this.data.moneyZf.trim() == '') {
      wx.showModal({
        title: '金额不能为空',
      })

      return;
    }
    if (parseFloat(this.data.moneyZf) <= 0) {
      wx.showModal({
        title: '金额不能为零',
      })

      return;
    }

    // this.youhuijuan();
    //检测用户是否具有权限
    const that = this;
    userTest().then(data => {
      if (!data) {
        return
      }
      const e = wx.getStorageSync("e");
      //支付
      util.postRequest(app.globalData.url + "checkstand/order?access-token=" + e.accessToken, that.data.params)
        .then(function (data) {
          if (!(errorMessage(data))) {
            return;
          }
          if (data.data.data.type == "ok") {
            wx.showModal({
              title: "余额支付成功",
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                } else {
                  that.onLoad();
                }
              }
            })
          } else {
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
                      wx.redirectTo({
                        url: '../index/index',
                      })
                    } else {
                      that.onLoad();
                    }

                  }
                })

              }
            })
          }

        })
    });
  }
})