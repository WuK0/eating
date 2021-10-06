// miniprogram/pages/random/random.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    type:"class",
    choose_type:null,
    datas:[],
    length:0,
    currentNum: 0,
    isBegin:false,
    isFirst:true,
    // 具体菜单
    userInfo: {},
    // 计时器
    setInter:null,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type != "class"){
      var collection = options.type
      this.setData({
        openid: app.globalData.openid,
        type: options.type
      })
      this.getDatas(collection, this.data.type);
      if (options.type == "order"){
        this.getPublicDatas("order")
      }
      
      this.setData({
        loading: false
      })
    }
    else
    {
      this.setData({
        datas: {
          "0": {
            "img": "../../images/class/order.png",
            "name": "点个外卖"
          },
          
          "1": {
            "img": "../../images/class/out.png",
            "name": "吃顿好的"
          },
          "2": {
            "img": "../../images/class/canteen.png",
            "name": "食堂走起"
          },
          "3": {
            "img": "../../images/class/cook.png",
            "name": "自力更生"
          },
          "4": {
            "img": "../../images/class/breeder.png",
            "name": "找饲养员"
          }
        },
        length: 5,
        loading: false
      })
    }
  },
  getPublicDatas(type){
    var database = "order_public"
    if(type != "order"){
      return false
    }
    const db = wx.cloud.database()
    db.collection(database).where({
      "type": "order_public"
    }).get({
      success: res => {
        if (res.data.length > 0) {
          console.log(res.data)
          var data = this.data.datas
          data = data.concat(res.data)
          var len = data.length
          this.setData({
            length: len,
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
  getDatas(database){
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(database).where({
      _openid: this.data.openid
    }).get({
      success: res => {
        if (res.data.length>0){
          var data = this.data.datas
          data = data.concat(res.data)
          var len = data.length
          this.setData({
            length: len,
            datas: data
          })
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  
  startSetInter: function(){
    var thisPage = this
    if(!this.userInfo){
      wx.getUserInfo({
        success: function (res) {
          thisPage.setData({
            userInfo: res.userInfo
          })
        },
        fail:function(){
          return
        }
      })
    }
    this.setData({
      isBegin: true
    })
    if(this.data.isFirst){
      this.setData({
        isFirst: false
      })
    }
    // 开始计时
    var thisLength = this.data.length 
    this.data.setInter = setInterval(
      function () {
        thisPage.setData({
          currentNum: Math.floor(Math.random() * thisLength)
        })
      }
      , 50);
  },
  stopSetInter:function(){
    clearInterval(this.data.setInter)
    if(this.data.type == "class"){
      var choose = app.globalData.type[this.data.currentNum]
      this.setData({
        isBegin: false,
        choose_type:choose
      })
    }
    else
    {
      this.setData({
        isBegin: false
      })
    }
  },
  meituan:function(){
    wx.showToast({
      image: '../../images/smile.png',
      title: '祝您用餐愉快~~~',
      duration: 3000
    })
    wx.navigateToMiniProgram({
      appId: 'wx2c348cf579062e56',
    })
  },
  eleme:function(){
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
    })
  },
  enjoyShow:function(){
    wx.showToast({
      image: '../../images/smile.png',
      title: '祝您用餐愉快~~~',
      duration: 2000,
      success: function () {
        setTimeout(function () {
          //要延时执行的代码
          wx.switchTab({
            url: '../index/index',
          })
        }, 2000) //延迟时间
      }
    })
    
  },
  enjoyBreeder: function () {
    wx.showToast({
      image: '../../images/smile.png',
      title: '想都别想！',
      duration: 3000
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})