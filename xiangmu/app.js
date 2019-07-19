//app.js
App({
  
  
  tabbar: {
    "color": "black",
    "selectedColor": "#666",
    "backgroundColor": "#f8f8f8",
    "isJoin": false,
    "beforeJoinList": [
      {
        "pagePath": "../index/index",
        "text": "首页",
        "iconPath": "../images/index.png",
        "selectedIconPath": "../images/index1.png",
      },
      {
        "pagePath": "../xiangqing/xiangqing",
        "text": "参伙",
        "iconPath": "../images/ch.png",
        "selectedIconPath": "../images/ch1.png"
      },
      {
        "pagePath": "../canhuohongbao/canhuohongbao",
        "text": "红包",
        "iconPath": "../images/hb.png",
        "selectedIconPath": "../images/hb1.png"
      },
      {
        "pagePath": "../wode/wode",
        "text": "我的会员",
        "iconPath": "../images/wode.png",
        "selectedIconPath": "../images/wode1.png"
      }
    ],
    "afterJoinList": [
      {
        "pagePath": "../index/index",
        "text": "首页",
        "iconPath": "../images/index.png",
        "selectedIconPath": "../images/index1.png",
      },
      {
        "pagePath": "../youhuijuan/youhuijuan?owner=business",
        "text": "优惠卷包",
        "iconPath": "../images/yhq.png",
        "selectedIconPath": "../images/yhq1.png"
      },
      {
        "pagePath": "../canhuohongbao/canhuohongbao",
        "text": "红包",
        "iconPath": "../images/hb.png",
        "selectedIconPath": "../images/hb1.png"
      },
      {
        "pagePath": "../wode/wode",
        "text": "我的会员",
        "iconPath": "../images/wode.png",
        "selectedIconPath": "../images/wode1.png"
      }
    ],
    position: "bottom"
  },
  changeTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.tabbar;
    let list = this.tabbar.isJoin ? this.tabbar.beforeJoinList : this.tabbar.afterJoinList
    // for (var i = 0; i < list.length; i++) {
    //   if (tabBar.list[i].pagePath == _pagePath) {
    //     tabBar.list[i].selected = true;//根据页面地址设置当前页面状态  
    //   }
    // }
    _curPage.setData({
      tabbar: tabBar
    });
  },
  onLaunch: function () {
  },
  globalData: {
    url:'https://c.cityzht.com/',
    merchantsId:"1"

  }
})