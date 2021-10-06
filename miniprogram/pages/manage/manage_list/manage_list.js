// pages/list/list.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '加载中...', // 状态
    datas: [], // 数据列表
    type: null, // 数据类型
    loading: true, // 显示等待框
    openid: null,
    result_msg:"请先进行新增"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type)
    {
      this.setData({
        type: options.type,
        openid: app.globalData.openid,
      })
      this.getDatas(options.type)
      if (options.type == "order") {
        this.getPublicDatas("order")
      }
      this.setData({
        loading: false
      })
    }
    else
    {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  getPublicDatas(type) {
    var database = "order_public"
    if (type != "order") {
      return false
    }
    const db = wx.cloud.database()
    db.collection(database).where({
      "type": "order_public"
    }).get({
      success: res => {
        console.log(res.data)
        var data = this.data.datas
        data = data.concat(res.data)
        if (data.length > 0) {
          this.setData({
            datas: data
          })
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getDatas(database) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(database).where({
      _openid: this.data.openid
    }).get({
      success: res => {
        var type_title = "";
        if (this.data.type == "order") {
          type_title = "外卖类别"
        }
        else {
          type_title = "菜品管理"
        }
        if (res.data.length > 0) {
          this.setData({
            datas: res.data,
            title: type_title
          })
        }
        else
        {
          this.setData({
            title: type_title
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
})