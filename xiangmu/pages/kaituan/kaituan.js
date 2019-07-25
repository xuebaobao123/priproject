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
    const params = JSON.parse(options.params);
    //存放参数
    this.setData({
      params: params
    })
    this.initOrganGroupData(params)
    console.log(options)
  },
  initOrganGroupData: function (params) {
    const e = wx.getStorageSync("e");
    const that = this;
    util.postRequest(app.globalData.url + "coupon/tuan-info?access-token=" + e.accessToken, params)
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
    const params = {
      ct_id: this.data.data.ctid,
      uid: this.data.params.uid,
    }
    var that = this;
    userTest().then(data => {
      if (!data)
        return;
      util.postRequest(app.globalData.url + "partner/open?access-token=" + e.accessToken, params)
        .then(function (data) {
          console.log('partner/open.data', data);
          if (!errorMessage(data)) {
            return;
          }
          const shareParams = {
            uid: that.data.params.uid,
            cid: that.data.params.cid,
            tuan_id: data.data.data.tuan_id,
            merchants_id: app.globalData.merchantsId
          }
          wx.showModal({
            title: '操作成功！',
            showCancel: true,
            success: function (res) {
              wx.navigateTo({
                url: '../cantuan/cantuan?type=kaituan&shareParams=' + JSON.stringify(shareParams),
              })
            }
          })
        })
    })
  },


})