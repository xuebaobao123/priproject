const app = getApp()
Page({
  data: {
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    imgUrls: [
      '../images/banner.png',
      '../images/banner.png',
      '../images/banner.png',
    ],
    //广告位
    advertPlaceArray: [
      { img: "../images/huiyuan.png", fowardUrl: '../wode/wode' },
      { img: "../images/canhuo.png", fowardUrl: '../xiangqing/xiangqing' },
      { img: "../images/weixinzhifu.png", fowardUrl: '33' },
      { img: "../images/youhuijuan.png", fowardUrl: '../youhuijuan/youhuijuan' },
      { img: "../images/hongbao.png", fowardUrl: '55' },
    ]
  },
  onLoad: function () {
  },
  //点击跳转
  foward: function (e) {
    const advertPlace = this.data.advertPlaceArray[e.currentTarget.dataset.index];
    console.log(advertPlace)
    //跳转页面
    wx.redirectTo({
      url: advertPlace.fowardUrl
    })
  }
})
