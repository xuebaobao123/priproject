import regeneratorRuntime from '../regenerator-runtime/runtime.js';
var util = require('./fengzhuang.js');
const app = getApp();
import errorMessage from './errorMessage'
// //优惠券包数据
const initBusinessCouponArrayData = () => {
  const params = {
    merchants_id: app.globalData.merchantsId
  }
  console.log('Businessparams', params)
  return initDataFromUrl('coupon/coupon-list', params);
}
//我参与的团数据
const initInvolvedCouponArrayData = () => {
  const uid = wx.getStorageSync("uid");
  const params = {
    uid: uid,
    merchants_id: app.globalData.merchantsId
  }
  return initDataFromUrl('user/participate-list', params, 'involved');
}
//我的优惠券包
const initUserCouponArrayData = () => {
  const uid = wx.getStorageSync("uid");
  const params = {
    uid: uid,
    merchants_id: app.globalData.merchantsId
  }
  console.log('Userparams', params)
  return initDataFromUrl('coupon/coupon-list', params)
}
//用户优惠卷包
const initUserShareCoupon = (params) => {
  return initDataFromUrl('coupon/cuinfo', params);
}
const initDataFromUrl = async(url, params, type) => {
  const e = wx.getStorageSync("e");
  let curData = null;
  //优惠券记录
  await util.postRequest(app.globalData.url + url + "?access-token=" + e.accessToken, params)
    .then(function(data) {
      if (!errorMessage(data)) {
        return;
      }
      if (data.data.data instanceof Array) {
        curData = data.data.data.map(item => {
          return mapData(item, type);
        })
      } else {
        curData = mapData(data.data.data);
      }
    })
    console.log('curData',curData);
  return curData;
}
//封装后台对象至页面对象
const mapData = (item, type) => {
  console.log(item,"开团")
  const loginUser = wx.getStorageSync("e").loginUser;
  //根据优惠券类型显示内容
  console.log('undefined',)
  return {
    id: item.id,
    tuan_id: item.tuan_id || item.utid,

    //需要积分
    needIntegral: (loginUser.is_canhuo && loginUser.is_canhuo == 2) ? item.integral_2 : item.integral,
    integralName: item.name,
    //规则
    content: concatContent(item),
    cuid: item.cuid,
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
    couponType: couponType(item),
    accessType: initAccessType(item, type),
  }
}
//拼接代金券描述
const concatContent = (item, type) => {
  let content = "";
  switch (item.type || item.coupon_type) {
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
}
//加载优惠券类型
function couponType(item) {
  return (item.access && item.access === '2') ? 0 : 1
}
//优惠券获取方式
function initAccessType(item, type) {
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
      accessType = {
        content: '立即兑换',
        targetEvent: 'exchange'
      }
      break;
    case "2":
      if (type && type === 'involved') { //我参与的团
        accessType = {
          content: '进入',
          targetEvent: 'organgoto'
        }
      } else {
        //暂时将优惠券获取方式的团购方式设置为我要开团，后续有变更可调整
        accessType = {
          content: '我要开团',
          targetEvent: 'organGroup'
        }
      }
      break;
    case "3":
      
      //暂时将优惠券获取方式的团购方式设置为我要开团，后续有变更可调整
      accessType = {
        content: '我要开团',
        targetEvent: 'organGroup'
      }
      break;
  }
  return accessType;
}
module.exports = {
  initBusinessCouponArrayData: initBusinessCouponArrayData,
  initInvolvedCouponArrayData: initInvolvedCouponArrayData,
  initUserShareCoupon: initUserShareCoupon,
  mapData: mapData,
  initUserCouponArrayData: initUserCouponArrayData
}