/**
 * 用户登录方法，若用户未登录，则执行登录，否则返回
 */
var util = require('./fengzhuang.js');
const app = getApp();
import regeneratorRuntime from '../regenerator-runtime/runtime.js';

//获取登录用户信息
export default async function initLoginUser() {
    const e = wx.getStorageSync("e");
    e.accessToken = 'XXMrUxwlndZWdSN_ob6UO-CfFH2Ookr-';
    if (e.loginUser)
        return;

    //检索登录用户
    await util.postRequest(app.globalData.url + "user/user-info?access-token=" + e.accessToken, { uid: '35' })
        .then(function (data) {
            if (!errorMessage(data)) {
                return;
            }
            //是参伙用户，则底部导航栏显示参伙，否则显示优惠券
            app.tabbar.isJoin = data.data.data.is_canhuo===2;
            wx.setStorageSync("e", { ...e, loginUser: data.data.data });

        })
}

