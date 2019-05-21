//logs.js

Page({
  data: {
    bgSrc: '',
  },
  onLoad: function() {

    const ctx = wx.createCanvasContext('shareCanvas')
    ctx.drawImage('/images/logo2.jpg', 0, 0, 350, 200);
    ctx.drawImage('/images/logo.jpg', 0, 250, 200, 200)
    ctx.draw()
  },
  save() {
   wx.canvasToTempFilePath({
     x: 0,
     y: 0,
     width: 500,
     height: 500,
     destWidth: 500,
     destHeight: 500,
     canvasId: 'shareCanvas',
     fileType:"jpg",
     success(res){
       wx.saveImageToPhotosAlbum({
         filePath: res.tempFilePath,
         success(res) {
           wx.showModal({
             title: '温馨提示',
             content: '已保存到系统相册中',
             showCancel: false
           })
         },
         fail(res) {
           wx.showModal({
             title: '温馨提示',
             content: '保存失败',
             showCancel: false
           })
         }
       })
     }
   })
  }
})