//app.js
App({
  onLaunch: function () {
    this.globalData = {
      "type":{
        0:"order",
        1:"out",
        2:"canteen",
        3:"cook",
        4:"breeder"
      }
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'zeke-gn9i1',
        traceUser: true,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'userInfo',
          })
        }
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            this.globalData = res.userInfo
          }
        })
      }
    })
  }

})
