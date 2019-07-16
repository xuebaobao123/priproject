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
        couponType: ''
      }
    ],
    //优惠券详情展开标志
    activeIndex: 0,
    //可用积分
    fanhui: "< 返回",//返回
    usableIntegral: 300
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
    console.log(1);
    let couponArray = [];

    const e = wx.getStorageSync("e");
    e.accessToken = 'XXMrUxwlndZWdSN_ob6UO-CfFH2Ookr-';
    console.log('e',e);

    this.setData({
      usableIntegral:e.loginUser.integral
    })

    
    const that = this
    //优惠券记录
    util.postRequest(app.globalData.url + "user/participate-list?access-token=" + e.accessToken, { uid: e.loginUser.id })
      .then(function (data) {
        if (data.success && !data.success) {
          console.log('检索失败，' + data.message);
          return;
        }
        console.log('data.data.data', data)
        that.setData({
          couponArray: data.data.data.map(item => {
            let content = "";
            //根据优惠券类型显示内容
            switch (item.type){
              case "1":
                  //通用劵展示优惠金额
                  content = item.discount_amount+"元代金券"
                  break;
              case "2":
                  //满减券展示满多少减多少
                  content = "满"+item.restrict_amount+"元减"+item.discount_amount+"元";
                  break;
              case "3":
                  //折扣券展示折扣比例
                  content = item.discount+"折"
            }
            return {
              //需要积分
              needIntegral: 30,
              integralName: item.name,
              //规则
              content: content,
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
              couponType: item.tuan_type==='1'?this.data.COUPONTYPE.GROUP:this.data.COUPONTYPE.DISCOUNT
            }
          })
        })


      })
    //加载数据
    // couponArray.push(
    //   {
    //     //主键,扩展
    //     id: 1,
    //     //需要积分
    //     needIntegral: 30,
    //     integralName: '此处写名字,字体是思源黑体1',
    //     //规则
    //     content: '满200元减100元',
    //     //数量
    //     number: 3,
    //     //优惠说明
    //     integralExplain: '优惠说明1',
    //     //有效期
    //     validityDate: {
    //       //开始时间
    //       beginDate: '',
    //       //结束时间
    //       endDate: '',
    //       //文字描述
    //       desc: '使用时段1'
    //     },
    //     //使用须知
    //     useRequire: '使用须知1',
    //     //优惠券所有者
    //     owner: '',
    //     imgUrl: '../images/youhuijuan1.png',
    //     couponType: this.data.COUPONTYPE.GROUP
    //   }
    // )

    // couponArray.push(
    //   {
    //     //主键,扩展
    //     id: 2,
    //     //需要积分
    //     needIntegral: 20,
    //     integralName: '此处写名字,字体是思源黑体2',
    //     //规则
    //     content: '满200元减100元',
    //     //数量
    //     number: 3,
    //     //优惠说明
    //     integralExplain: '优惠说明2',
    //     //有效期
    //     validityDate: {
    //       //开始时间
    //       beginDate: '',
    //       //结束时间
    //       endDate: '',
    //       //文字描述
    //       desc: '使用时段2'
    //     },
    //     //使用须知
    //     useRequire: '使用须知2',
    //     //优惠券所有者
    //     owner: '',
    //     imgUrl: '../images/youhuijuan1.png',
    //     couponType: this.data.COUPONTYPE.DISCOUNT
    //   }
    // )
    
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

  //开团
  organGroup: function () {
    //
    console.log(222);
  }
})