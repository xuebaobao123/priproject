const MESSAGE = {
    100: '请求参数错误',
    101: '数据库错误',
    102: '已拥有提现申请',
    103: '余额为0，无法进行提现',
    104: '参团时间已过',
    105: '参团人数已满',
    106: '已经参加过，不能重复参加',
    107: '已经开团或者参加了本团',
    108: '用户不存在',
    109: '没有父级关系并且不是参伙用户',
    110: '券不存在',
    111: '优惠券领取方式错误',
    112: '券已失效',
    113: '优惠券已过期',
    114: '用户已有此券',
    115: '用户已有参与此团券',
    116: '用户积分不足',
    117: '操作类型错误',
    118: '自己不能领取自己的券',
    121: "团已满",
    122: "团已失效",
    119: "不符合使用条件",
    120: "收银台下单",
    201: '暂无数据',
    600: '返回数据格式错误'
}

export default function showModal(data) {
    let result = false;

    // return true;
    try {
        if (data.success && data.data.status && (data.data.status === 200 || data.data.status === 201)) {
            // if (data.success && data.data.status) {
            result = !result;
        } else {
            if (typeof (MESSAGE[data.data.status || 600]) === 'undefined') {
                console.log('errorMessage out 错误代码：' + data.data.status)
                result = false;
                return;
            }
            throw MESSAGE[data.data.status || 600];
        }
    } catch (error) {
        console.log("errorMessage.data", data)
        console.log("error", error);

        //此处自定义错误弹窗
        wx.showModal({
            title: error
        })
    } finally {
        return result;
    }
}