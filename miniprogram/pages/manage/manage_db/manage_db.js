// miniprogram/pages/manage/manage_db/manage_db.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:null,
    fileID:null,
    cloudPath:null,
    filePath:null,
    collection:"",
    // 输入
    name: null,
    price: 0,
    note: null,
    // 数据库信息
    info:{},
    lastId:0
  },

  // 上传图片
  doUpload: function () {
    var thisPage = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (!res.tempFilePaths[0]) {
          console.log("图片不存在")
          return;
        }
        if (res.tempFiles[0] && res.tempFiles[0].size > 1024 * 1024) {
          wx.showToast({
            title: '图片不能大于1M',
            icon: 'none'
          })
          return;
        }
        const filePath = res.tempFilePaths[0]
        wx.getFileSystemManager().readFile({
          filePath: filePath,
          success: buffer => {
            wx.cloud.callFunction({
              name: 'checkInput',
              data: {
                'content': buffer.data,
                "type": 'img'
              },
              success: res => {
                if (res.result.errCode == 0) {
                  wx.showLoading({
                    title: '上传中',
                  })
                  // 上传图片
                  const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
                  wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                      console.log('[上传文件] 成功：', res)
                      var info_detail = thisPage.data.info
                      info_detail.img = res.fileID
                      thisPage.setData({
                        fileID: res.fileID,
                        cloudPath: cloudPath,
                        imagePath: filePath,
                        info: info_detail
                      })
                    },
                    fail: e => {
                      console.error('[上传文件] 失败：', e)
                      wx.showToast({
                        icon: 'none',
                        title: '上传失败',
                      })
                    },
                    complete: () => {
                      wx.hideLoading()
                    }
                  })
                }
                else {
                  wx.showToast({
                    icon: 'none',
                    title: '图片内容违规',
                  })
                  return false;
                }
              },
              fail:res=>{
                console.log(res)
              }
            })
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 更新图片
  updateImage:function(e){
    var deleteFile = Array(this.data.fileID)
    console.log(deleteFile)
    var thisPage = this
    console.log(thisPage)
    wx.cloud.deleteFile({
      fileList: deleteFile,
      success:function(){
        console.log("删除成功")
        thisPage.setData({
          fileID: null,
          cloudPath: null,
          imagePath: null,
          info:{}
        })
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            if (!res.tempFilePaths[0]) {
              console.log("图片不存在")
              return;
            }
            if (res.tempFiles[0] && res.tempFiles[0].size > 1024 * 1024) {
              wx.showToast({
                title: '图片不能大于1M',
                icon: 'none'
              })
              return;
            }
            const filePath = res.tempFilePaths[0]
            wx.getFileSystemManager().readFile({
              filePath: filePath,
              success: buffer => {
                wx.cloud.callFunction({
                  name: 'checkInput',
                  data: {
                    'content': buffer.data,
                    "type": 'img'
                  },
                  success: res => {
                    if (res.result.errCode == 0) {
                      wx.showLoading({
                        title: '上传中',
                      })
                      // 上传图片
                      const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
                      wx.cloud.uploadFile({
                        cloudPath,
                        filePath,
                        success: res => {
                          console.log('[上传文件] 成功：', res)
                          var info_detail = thisPage.data.info
                          info_detail.img = res.fileID
                          thisPage.setData({
                            fileID: res.fileID,
                            cloudPath: cloudPath,
                            imagePath: filePath,
                            info: info_detail
                          })
                        },
                        fail: e => {
                          console.error('[上传文件] 失败：', e)
                          wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                          })
                        },
                        complete: () => {
                          wx.hideLoading()
                        }
                      })
                    }
                    else {
                      wx.showToast({
                        icon: 'none',
                        title: '图片内容违规',
                      })
                      return false;
                    }
                  },
                  fail: res=>{
                    console.res
                  }
                })
              }
            })
          },
          fail: e => {
            console.error(e)
          }
        })
      },
      fail:function(){
        return
      }
    })
  },

  // 获取输入
  getClassInfo:function(e){
    if (this.data.type == "class" && e.target.id == "class_input"){
      this.data.info.name = e.detail.value
      this.data.name = e.detail.value
    }
  },
  getName:function(e){
    if (this.data.type != "class") {
      console.log(e)
      this.data.info.name = e.detail.value
      this.data.name = e.detail.value
    }
    console.log(this.data)
  },
  getPrice:function(e){
    if (this.data.type != "class") {
      if (e.detail.value)
      {
        this.data.info.price = e.detail.value
        this.data.price = e.detail.value
      }
      else
      {
        this.data.info.price = 0
        this.data.price =  0
      }
      
    }
  },
  getNote:function(e){
    if (this.data.type != "class") {
      this.data.info.note = e.detail.value
      this.data.note = e.detail.value
    }
  },
  checkInput:function(){
    if (this.data.fileID)
    {
      if (!isNaN(this.data.price)){
        if (this.data.name && this.data.note) {
          return true
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '菜名与备注必填',
            duration: 1000,
          })
        }
      }
      else
      {
        wx.showToast({
          icon: 'none',
          title: '价格应该为数字',
          duration: 1000,
          
        })
      }
    }
    else
    {
      wx.showToast({
        icon: 'none',
        title: '请先选择图片',
        duration: 1000,
      })
    }
    return false;
  },
  // 提交输入
  submitClass:function(e){
    if (Object.keys(this.data.info).length === 0) {
      wx.showToast({
        icon:"none",
        title: '输入不可为空',
        mask:true
      })
      return false // 如果为空,返回false
    }
    if (this.data.type == "class" && e.target.id == "class_submit") {
      this.onAdd("menu", this.data.info)
    }
    else if(this.checkInput()){
      wx.cloud.callFunction({
        name: 'checkInput',
        data: {
          'content': this.data.info.name,
          "type": 'msg'
        },
        success: res => {
          if (res.result.errCode == 0) {
            wx.cloud.callFunction({
              name: 'checkInput',
              data: {
                'content': this.data.info.note,
                "type": 'msg'
              },
              success: res => {
                if (res.result.errCode == 0) {
                  this.onAdd(this.data.collection, this.data.info)
                }
                else {
                  return false;
                }
              }
            })
          }
          else {
            return false;
          }
        }
      })
    }
  },
  onAdd: function (database,info_data) {
    wx.showLoading({
      title: '提交中',
      mask: true,
    })
    const db = wx.cloud.database()
    var current_type = this.data.type
    info_data.type = current_type
    db.collection(database).add({
      data: info_data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // this.setData({
        //   lastId: res._id,
        //   name:"",
        //   info:{}
        // })
        wx.hideLoading();
        
        wx.showToast({
          image:"../../../images/smile.png",
          duration: 1000,
          title: '新增记录成功',
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateTo({
                url: '../manage_list/manage_list?type=' + current_type,
              })
            }, 1000) //延迟时间
          }
        })
        
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type)
    {
      this.setData({
        openid: app.globalData.openid,
        type: options.type,
        collection: options.type,
      })
    }
    else
    {
      wx.navigateTo({
        url: '../../index/index',
      })
    }
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