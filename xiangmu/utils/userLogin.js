/**
 * 用户登录方法，若用户未登录，则执行登录，否则返回
 */
var util = require('./fengzhuang.js');
const app = getApp();
import regeneratorRuntime from '../regenerator-runtime/runtime.js';
import errorMessage from './errorMessage'

//获取登录用户信息
export default function initLoginUser() {
    const e = wx.getStorageSync("e");
    const uid=wx.getStorageSync("uid")
    //检索登录用户
    return util.postRequest(app.globalData.url + "user/user-info?access-token=" + e.accessToken, { uid: uid })
        .then(function (data) {
            if (!errorMessage(data)) {
                return;
            }
            console.log('loginUser',data.data.data);
            //是参伙用户，则底部导航栏显示参伙，否则显示优惠券
            app.tabbar.isJoin = data.data.data.is_canhuo===2;
            wx.setStorageSync("e", { ...e, loginUser: data.data.data });
        })
}

