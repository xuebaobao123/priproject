// pages/kaituanxiangqing/kaituanxiangqing.js
const app = getApp();
import errorMessage from '../../utils/errorMessage'
import userLogin from '../../utils/userLogin'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      }
    ],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    usableIntegral: 300
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userLogin();
    //获取团购券参数
    const params = JSON.parse(options.params);
    this.initTuanInfo(params);
  },

  //团购券详情
  initTuanInfo: function (params) {
    const that = this;
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, params)
      .then(function (data) {
        if (!(errorMessage(data.data))) {
          return;
        }
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
      cid: data.data.data.cid,
      ctid: data.data.data.ctid,
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

  //查看详情
  onToggle(e) {
    const index = this.data.activeIndex;
    this.setData({
      //控制查看详情的展开和关闭
      activeIndex: index === e.currentTarget.dataset.index ? -1 : e.currentTarget.dataset.index
    })
  },

  //开团
  partnerOpen: function () {
    const current = wx.getStorageSync("e");
    const currentCoupon = this.data.couponArray[e.detail.value]
    const params = {
      uid: current.loginUser.id,
      ct_id: currentCoupon.id,
    }

    util.postRequest(app.globalData.url + "partner/open?access-token=" + e.accessToken, params)
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
  // 返回
  fanhui: function () {
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
})