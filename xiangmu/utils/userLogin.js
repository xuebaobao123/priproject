/**
 * 用户登录方法，若用户未登录，则执行登录，否则返回
 */
var util = require('./fengzhuang.js');
const app = getApp();
import regeneratorRuntime from '../regenerator-runtime/runtime.js';
import errorMessage from './errorMessage'

//获取登录用户信息
const initLoginUser = () => {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid")
    //检索登录用户
    return util.postRequest(app.globalData.url + "user/user-info?access-token=" + e.accessToken, { uid: uid })
        .then(function (data) {
            if (!errorMessage(data)) {
                return;
            }
            console.log('loginUser', data.data.data);
            //是参伙用户，则底部导航栏显示优惠券，否则显示参伙
            app.tabbar.isJoin = data.data.data.is_canhuo === 1;
            wx.setStorageSync("e", { ...e, loginUser: data.data.data });
        })
}

//注册更新
const registerOrUpdate = (e) => {
    var data = {
        merchants_id: app.globalData.merchantsId,
        openid: e.openId,
        nickname: e.nickName,
        avatarurl: e.avatarUrl,
        gender: e.gender,
        province: e.country,
        city: e.city,
        country: e.province,
        share_uid: e.parentId,
    }
    console.log('register.params',data);
    return util.postRequest(app.globalData.url + "user/up-info?access-token=" + e.accessToken, data)
        .then(function (data) {
            console.log('获取用户UID【' + data.data.data.uid + '】');
            const uid = data.data.data.uid;
            return { accessToken:e.accessToken, uid }
        }, function (error) {
        })
}

module.exports = {
    initLoginUser: initLoginUser,
    registerOrUpdate: registerOrUpdate,
}

