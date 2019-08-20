const app = getApp();
import errorMessage from '../../utils/errorMessage';
var util = require('../../utils/fengzhuang.js');
import youhuijuanService from '../../utils/youhuijuanService'
import userTest from '../../utils/userTest'
Page({
  data: {
    headImg: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    //项目名称
    projectName: '',
    content: '', //内容
    endDate: '', //截至日期
    //项目进度
    projectSpeed: {
      //文字描述
      projectDesc: '',
      //图片
      projectImage: '',
    },
  },
  onLoad: function (options) {
    console.log()
    app.changeTabBar();
    const shareParams = JSON.parse(options.shareParams);
    //存放参数
    this.setData({
      shareParams: shareParams
    })
    this.initOrganGroupData(shareParams)
    console.log(options,"开团")
  },
  initOrganGroupData: function (shareParams) {
    const e = wx.getStorageSync("e");
    const that = this;
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, shareParams)
      .then(function (data) {
        if (!(errorMessage(data))) {
          return;
        }
        let curData = youhuijuanService.mapData(data.data.data)
        const ctid = data.data.data.ctid
        curData.validityDate.endDate = curData.validityDate.endDate.substring(0, 10)
        that.setData({
          data: {
            ...curData,
            //团购券ID
            ctid
          }
        })
      })
  },

  // 返回
  fanhui: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 开团
  group: function () {
    const e = wx.getStorageSync("e");
    const shareParams = {
      ct_id: this.data.data.ctid,
      uid: this.data.shareParams.uid,
    }
    var that = this;
    userTest().then(data => {
      if (!data)
        return;
      util.postRequest(app.globalData.url + "partner/open?access-token=" + e.accessToken, shareParams)
        .then(function (data) {
          console.log('partner/open.data', data);
          if (!errorMessage(data)) {
            return;
          }
          const shareParams = {
            uid: that.data.shareParams.uid,
            cid: that.data.shareParams.cid,
            tuan_id: data.data.data.tuan_id,
            merchants_id: app.globalData.merchantsId
          }
          wx.showModal({
            title: '操作成功！',
            showCancel: true,
            success: function (res) {
              wx.navigateTo({
                url: '../cantuan/cantuan?type=kaituan&uid=' + that.data.shareParams.uid+'&shareParams=' + JSON.stringify(shareParams),
              })
            }
          })
        })
    })
  },
  shouye:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  }

})