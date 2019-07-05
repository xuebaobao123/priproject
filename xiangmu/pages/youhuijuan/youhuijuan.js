// pages/youhuijuan/youhuijuan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //券类型
    COUPONTYPE:{
      //开团券
      GROUP:0,
      //优惠券
      DISCOUNT:1,
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
        couponType:''
      }
    ],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    fanhui: "< 返回",//返回
    usableIntegral:300
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },
  //查看详情
  onToggle(e) {
    const index = this.data.activeIndex;
    this.setData({
      //控制查看详情的展开和关闭
      activeIndex: index === e.currentTarget.dataset.index ? -1 : e.currentTarget.dataset.index
    })
  },

  //初始化
  initData: function () {

    let couponArray = [];
    //加载数据
    couponArray.push(
      {
        //主键,扩展
        id: 1,
        //需要积分
        needIntegral: 30,
        integralName: '此处写名字,字体是思源黑体1',
        //规则
        content: '满200元减100元',
        //数量
        number: 3,
        //优惠说明
        integralExplain: '优惠说明1',
        //有效期
        validityDate: {
          //开始时间
          beginDate: '',
          //结束时间
          endDate: '',
          //文字描述
          desc: '使用时段1'
        },
        //使用须知
        useRequire: '使用须知1',
        //优惠券所有者
        owner: '',
        imgUrl: '../images/youhuijuan1.png',
        couponType:this.data.COUPONTYPE.GROUP
      }
    )

    couponArray.push(
      {
        //主键,扩展
        id: 2,
        //需要积分
        needIntegral: 20,
        integralName: '此处写名字,字体是思源黑体2',
        //规则
        content: '满200元减100元',
        //数量
        number: 3,
        //优惠说明
        integralExplain: '优惠说明2',
        //有效期
        validityDate: {
          //开始时间
          beginDate: '',
          //结束时间
          endDate: '',
          //文字描述
          desc: '使用时段2'
        },
        //使用须知
        useRequire: '使用须知2',
        //优惠券所有者
        owner: '',
        imgUrl: '../images/youhuijuan1.png',
        couponType:this.data.COUPONTYPE.DISCOUNT
      }
    )
    this.setData({
      couponArray: couponArray
    })
  },
  //我的会员
  goMyMember: function () {
    wx.redirectTo({
      url: '../wode/wode'
    })
  },
  // 立即兑换
  exchange:function(){
    wx.navigateTo({
      url: '../lijiduihuan/lijiduihuan',
    })
  },

  //开团
  organGroup:function(){
    //
    console.log(222);
  }
})