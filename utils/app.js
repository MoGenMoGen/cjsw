//app.js
const api = require("./config.js");
//const { $Toast } = require("components/iview/base/index");
App({
  onLaunch(ops) {
    // 图片路径
    wx.imgURL = api.imgURL;
    //定义全局toast弹窗
    //wx.toast = $Toast;
    //定义全局post
    wx.post = this.post;
    wx.gets = this.gets;

    //  获取分享参数
    if (ops.query && ops.query.uid) {
      this.globalData.sourcePath = ops.path;
      this.globalData.query = ops.query;
    }
    // if (!wx.getStorageSync('userInfo') || !wx.getStorageSync('paramKey')) {
    //   wx.redirectTo({
    //     url: 'pages/login/login',
    //   })
    // }
  },
  onShow() {},
  getScreen() {
    wx.getSystemInfo({
      success: function(res) {
        wx.$screenHeight = res.screenHeight;
      }
    });
    wx.$BarHeight = wx.getSystemInfoSync()["statusBarHeight"];
  },
  globalData: {
    cartsCount: 0
  },
  //变量监听相关
  watchCallBack: {},
  watchingKeys: [],
  $watch(key, cb) {
    this.watchCallBack = Object.assign({}, this.watchCallBack, {
      [key]: this.watchCallBack[key] || []
    });
    this.watchCallBack[key].push(cb);
    if (!this.watchingKeys.find(x => x === key)) {
      const that = this;
      this.watchingKeys.push(key);
      let val = this.globalData[key];
      Object.defineProperty(this.globalData, key, {
        configurable: true,
        enumerable: true,
        set(value) {
          const old = that.globalData[key];
          val = value;
          that.watchCallBack[key].map(func => func(value, old));
        },
        get() {
          return val;
        }
      });
    }
  }
});
