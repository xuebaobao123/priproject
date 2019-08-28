var util = require('./fengzhuang.js');
import regeneratorRuntime from '../regenerator-runtime/runtime.js';
import errorMessage from './errorMessage'
import userLogin from './userLogin'
const app = getApp();

/**
 * 加载token
 */
export default async function (e) {
    return new Promise(function (resolve, reject) {
        initToken().then(data => {
            initOpenId(data)
                .then(openId => {
                    return authLogin(openId);
                })
                .then(({ openId, accessToken }) => {
                    const newE = {...e,accessToken,openId}
                    return userLogin.registerOrUpdate(newE)
                })
                .then(({ accessToken, uid }) => {
                    resolve({ accessToken, uid })
                })

        })
    })
}

//获取登录CODE
const initToken = () => {
    const that = this;
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function (res) { 
              if (res.code) {
                var data = {
                  merchants_id: app.globalData.merchantsId,
                  client_code: res.code,
                }
                console.log('获取登录CODE【' + res.code + '】')
                resolve(res);
              } else {
                console.log('获取用户登录态失败！' + res.errMsg);
                reject('error');
              }
              
             },
            fail: function (res) {
                wx.login({
                    success(res) {
                        if (res.code) {
                            var data = {
                                merchants_id: app.globalData.merchantsId,
                                client_code: res.code,
                            }
                            console.log('获取登录CODE【' + res.code + '】')
                            resolve(data);
                        } else {
                            console.log('获取用户登录态失败！' + res.errMsg);
                            reject('error');
                        }
                    }
                })
            }
        })

    })

}

//获取OPENID
const initOpenId = (data) => {
  console.log("initOpenId",data)
    return util.postRequest(app.globalData.url + "auth/openid", data).then(function (data) {
        if (!(errorMessage(data))) {
            return;
        }
        console.log('获取用户OPENID【' + data.data.data.openid + '】')
        return data.data.data.openid;
    }, function (error) { })
}
//获取TOKEN
const authLogin = (openId) => {
    return util.postRequest(app.globalData.url + "auth/login", { openid: openId }).then(function (tokenData) {
        if (!(errorMessage(tokenData))) {
            return;
        }
        const accessToken = tokenData.data.data.access_token
        console.log('获取TOKEN【' + tokenData.data.data.access_token + '】')
        return { openId, accessToken };

    }, function (error) { })
}