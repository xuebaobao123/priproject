//app.js
App({
  tabbar: {
    color: "#515151",
    selectedColor: "#fa8582",
    backgroundColor: "#ffffff",
    borderStyle: "#d7d7d7",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/pages/images/index1.png",
        selectedIconPath: "/pages/images/index.png",
        selected: true
      },
      {
        pagePath: "/pages/fabu/fabu",
        text: "发布",
        iconPath: "/pages/images/fabu@2x.png",
        selectedIconPath: "/pages/images/fabu@2x.png",
        selected: false
      }
    ],
    position: "bottom"
  },
  tabbar: {
    "color": "black",
    "selectedColor": "#666",
    "backgroundColor":"#f8f8f8",
    "list": [
      {
        "pagePath": "../index/index",
        "text": "首页",
        "iconPath": "../images/index.png",
        "selectedIconPath": "../images/index1.png"
      },
      {
        "pagePath": "../xiangqing/xiangqing",
        "text": "参伙",
        "iconPath": "../images/hb.png",
        "selectedIconPath": "../images/hb1.png"
      },
      {
        "pagePath": "../index/index",
        "text": "优惠卷包",
        "iconPath": "../images/wode.png",
        "selectedIconPath": "../images/wode1.png"
      },
      {
        "pagePath": "../index/index",
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
    for (var i = 0; i < tabBar.list.length; i++) {
      console.log(_pagePath + '--' + tabBar.list[i].pagePath)
      tabBar.list[i].selected = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].selected = true;//根据页面地址设置当前页面状态  
      }
    }
    _curPage.setData({
      tabbar: tabBar
    });
  },
  onLaunch: function () {
  },
  globalData: {
    
  }
})