const apiRequest = (url, method, data, header) => {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header ? header : {},
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data) {
            resolve(res.data);
          }
          else {
            reject({ errormsg: '服务器错误,请稍后重试', code: 0 });
          }
        }
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ errormsg: '网络错误,请稍后重试', code: 0 });

      }
    })
  })
  return promise;
}

const getRequest = (url, data, header) => apiRequest(url, 'get', data, header);
const postRequest = (url, data, header) => apiRequest(url, 'post', data, header);
module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}