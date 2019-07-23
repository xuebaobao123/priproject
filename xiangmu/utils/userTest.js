import regeneratorRuntime from '../regenerator-runtime/runtime.js';
var util = require('./fengzhuang.js');
const app = getApp();
import errorMessage from './errorMessage'
/**
 * 用户检测，用于检测用户是否具有相应权限
 */
export default async function userTest() {
    const e = wx.getStorageSync("e");
    const uid = wx.getStorageSync("uid")

    if (!(e && uid)) {
        //此处自定义错误弹窗
        wx.showToast({
            title: '用户登录失效',
            icon: 'success',
            duration: 2000
        })
        return false;
    }
    //检索登录用户
    await util.postRequest(app.globalData.url + "user/user-check?access-token=" + e.accessToken, { uid: uid })
        .then(function (data) {
          console.log('userTest.data',data);
            if (!errorMessage(data)) {
                return false;
            }
            if (!(data.data.data.status!==200)) {
                //此处自定义错误弹窗
                wx.showToast({
                    title: data.data.data.msg,
                    icon: 'success',
                    duration: 2000
                })

                return false;
            }
            return true;
        })
}