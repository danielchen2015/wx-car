// pages/home/car/car.jsa
import http from '../../../utils/http.js';
import https from '../../../utils/const.js'; 
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    car:{},
    https: https.RES_HOST,
    imgUrl:"/upload/20190511/iS0syubWFZ.jpeg",
    roleid: "",
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let roleid = options.roleid || '';
    if (roleid){
      this.setData({
        roleid: roleid,
        id: options.id
      })
    }else{
      this.setData({
        roleid: "",
        id: "",
        urlPics:""
      })
    }
    this.bindcar(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //浏览图片
  viewImage(e){
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: this.data.urlPics || [] // 需要预览的图片http链接列表
    })
  },
  viewWeixin(e){
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img]
    })
  },
  //车辆详情
  bindcar(id) {
    let that = this;
    http({
      url: "api/vehicle/getonevehicleinfo",
      data: {
        openid: app.globalData.OPEN_ID,
        id:id
      },
      success: function (res) {
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){
          let arrImg = JSON.parse(resultMsg[0].vehicleimgs);
          that.setData({
            car: resultMsg,
            imgUrls: arrImg
          })
          if (arrImg.length){
            let urls = [];
            arrImg.map((item)=>{
              urls.push(https.RES_HOST+item)
            })
            that.setData({
              urlPics: urls
            })
          }
        }
      
      },
      fail: function (err) {
        console.log("err", err);
      }
    })
  },
  handgoCar(){
    wx.switchTab({
      url: '/pages/write/write'
    })
  },
  allCar(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  callUser(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  handImg(){
    wx.navigateTo({
      url: '/pages/share/share'
    })
  },
  //审核
  handReview(){
    let that = this;
    http({
      url:"/api/vehicle/updatestatus",
      data:{
        id: that.data.id,
        status: 2
      },
      success: function(res){
        let { resultCode} = res;
        if (resultCode == 200){
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '审核成功',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }
            }
          })
        }else{
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '审核失败',
            success(res) {
              if (res.confirm) {

              }
            }
          })
        }
      }
    })
  }
})