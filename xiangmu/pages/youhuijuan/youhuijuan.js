// pages/youhuijuan/youhuijuan.js
const app = getApp();
var util = require('../../utils/fengzhuang.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //券类型
    COUPONTYPE: {
      //开团券
      GROUP: 0,
      //优惠券
      DISCOUNT: 1,
    },
    //优惠券数组
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
        //优惠券类型 开团券和优惠券
        couponType: '',
        //获取方式
        accessType: {
          //文字描述
          content: '',
          //事件
          targetEvent: ''
        }
      }
    ],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    fanhui: "< 返回",//返回
    usableIntegral: 300,
    //加载详情数据标志位
    initActiveDataFlag: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.owner){
      //没有owner参数默认加载我的优惠券包数据
      this.initUserCouponArrayData();
      return;
    }

    switch (options.owner) {
      case 'business'://所有商家优惠券
        this.initBusinessCouponArrayData();
        break;
      case 'involved'://我参与的团
        this.initInvolvedCouponArrayData();
        break;
      case 'user'://我的优惠券包
        this.initUserCouponArrayData();
      default:
        break;
    }
  },
  //查看详情
  onToggle(e) {
    const index = this.data.activeIndex;
    this.setData({
      //控制查看详情的展开和关闭
      activeIndex: index === e.currentTarget.dataset.index ? -1 : e.currentTarget.dataset.index
    })
  },

  //优惠券包数据
  initBusinessCouponArrayData: function () {
    const params = {
      merchants_id: 1
    }
    this.initDataFromUrl('coupon/coupon-list', params)
  },

  //我参与的团数据
  initInvolvedCouponArrayData: function () {
    this.initDataFromUrl('user/participate-list', { uid: 3 });
  },

  //我的优惠券包
  initUserCouponArrayData: function () {
    const params = {
      uid: 1,
      merchants_id: 1
    }
    this.initDataFromUrl('coupon/coupon-list', params)
  },


  /**
   * 从不同的接口路径加载不同的数据
   * @param {*} url 
   */
  initDataFromUrl(url, params) {
    const e = wx.getStorageSync("e");
    e.accessToken = '9NfL1S6yWoIZHSd4cXsKOb1Iz816_3se';
    console.log('e', e);

    this.setData({
      usableIntegral: e.loginUser.integral
    })
    const that = this
    //优惠券记录
    util.postRequest(app.globalData.url + url + "?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        console.log('data.data.data', data.data.data)
        that.setData({
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
      //需要积分
      needIntegral: 30,
      integralName: item.name,
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
      case "3"://暂时将优惠券获取方式的团购方式设置为我要参团，后续有变更可调整
        accessType = { content: '我要参团', targetEvent: 'organGroup' }
        break;
    }
    return accessType;
  },
  // 立即兑换
  exchange: function () {
    wx.navigateTo({
      url: '../lijiduihuan/lijiduihuan',
    })
  },
  //立即领取
  exReceive: function () {
    //...
  },

  //参团
  organGroup: function () {
    wx.redirectTo({
      url: '../cantuan/cantuan'
    })
  },
  //我的会员
  goMyMember: function () {
    wx.redirectTo({
      url: '../wode/wode'
    })
  },
})