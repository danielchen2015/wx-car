// pages/user/user.js
const app = getApp();
import http from '../../utils/http.js';
import urlApi from '../../utils/const.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleid: "" || wx.getStorageSync("roleid"),
    car:[],
    userInfoBtn: true,
    isPhoneBtn:false,
    showOperation:false,
    operation: [{
      name: "朋友圈",
      img: "/images/user/friend.png"
    }, {
      name: "状态",
      img: "/images/user/status.png"
    }, {
      name: "编辑",
      img: "/images/user/edit.png"
    }],
    RES_HOST: urlApi.RES_HOST
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
  },
  //车辆列表
  bindcar() {
    let that = this;
    http({
      url: "api/vehicle/getvehicleinfo",
      data: {
        openid: app.globalData.OPEN_ID,
        self: "1"
      },
      success: function (res) {
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){
          that.setData({
            car: resultMsg
          })
        }else{
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '你还没有发布车辆',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/write/write',
                })
              }
            }
          })
        }
      },
      fail: function (err) {
        console.log("err", err);
      }
    })
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
    if (wx.getStorageSync("phone")){
      this.setData({
        userInfoBtn:false
      })
      this.bindcar();
    }else{
      this.setData({
        userInfoBtn: true
      })

    }
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
  //授权登录
  getUserInfo: function (e) {
    let that = this;
    if (e.detail){
      let { encryptedData, iv,} = e.detail;
      http({
        url:"/api/User/loginWxxcx",
        data:{
          code: app.globalData.code,
          encryptedData,
          iv
        },
        success:function(res){
          let { resultCode, resultMsg} =  res;
          if (resultCode == 0){
            let { openId } = resultMsg;
            getApp().globalData.OPEN_ID = openId;
            wx.setStorageSync("OPEN_ID", openId);
            wx.setStorageSync("session_key",resultMsg.session_key);
            wx.setStorageSync("nickName", resultMsg.nickName);
            that.setData({
              isPhoneBtn: true
            })
          }
        }
      })
    }else{

    }
  },
  //获取手机号
  getPhoneNumber: function(e){
    let that = this;
    http({
      url:"/api/User/getUserPhone",
      data:{
        session_key: wx.getStorageSync("session_key"),
        iv:e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 0){
          let phone = resultMsg.phoneNumber;
          wx.setStorageSync("phone", phone);
          that.addUser();
        }
      },
      fail: function(err){
        console.log("err",err);
      }
    })
  },
  //添加用户
  addUser: function(){
    let that = this;
    http({
      url: "/api/User/add",
      method:"POST",
      data:{
        openid: wx.getStorageSync("OPEN_ID"),
        mobileno: wx.getStorageSync("phone"),
        username: wx.getStorageSync("nickName"),
      },
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){
          that.getUerInfo()
        }else{
          that.getUerInfo()
        }    
      }
    })
  },
  //获取用户信息
  getUerInfo(){
    let that = this;
    http({
      url:"/api/User/info",
      data:{
        openid: wx.getStorageSync("OPEN_ID"),
        mobileno: wx.getStorageSync("phone")
      },
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200) {
          let {roleid, mobileno } = resultMsg;
          that.setData({
            roleid: roleid,
            userInfoBtn: false
          })
          wx.setStorageSync("roleid", roleid);
          that.bindcar();
        }    
      }
    })
  },
  //页面跳转
  handInfo(){

  },
  showOperation(e){
    wx.navigateTo({
      url: '/pages/home/car/car?id=' + e.currentTarget.dataset.id + '&roleid=' + this.data.roleid
    })
  }
})