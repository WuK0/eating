// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "zeke-gn9i1"
})

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "msg": {
      return msgSecCheck(event)
    }
    case "img": {
      return imgSecCheck(event)
    }
    default: {
      return false;
    }
  }
}

async function msgSecCheck(event) {
  try {
    var result = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    return result;
  } catch (err) {
    return false
  }
}

async function imgSecCheck(event) {
  try {
    var result = await cloud.openapi.security.imgSecCheck({
      media: {
        header: {
          'Content-Type': 'application/octet-stream'
        },
        contentType: 'image/png;image/jpg',
        value: Buffer.from(event.content)
      }
    })
    return result;
  } catch (err) {
    return false
  }
}