// pages/user/user.js
const app = getApp();
import http from '../../utils/http.js';
import urlApi from '../../utils/const.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleid:"",
    car:[],
    userInfoBtn: true,
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
    if (!this.data.userInfoBtn){
      this.bindcar();
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
  getUserInfo: function (e) {
    let that = this;
    if (e.detail){
      let { encryptedData, iv,} = e.detail;
      console.log("e.detail", e.detail)
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
            that.addUser(openId);
          }
        }
      })
    }else{

    }
  },
  //添加用户
  addUser: function(id){
    let that = this;
    http({
      url: "/api/User/add",
      method:"POST",
      data:{
        openid: id
      },
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){

          that.getUerInfo(id)
          wx.switchTab({
            url: '/pages/write/write',
          })
        }else{
          that.getUerInfo(id)
          wx.switchTab({
            url: '/pages/write/write',
          })
      
        }    
      }
    })
  },
  //获取用户信息
  getUerInfo(id){
    let that = this;
    http({
      url:"/api/User/info",
      data:{
        openid: id
      },
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200) {
          let {roleid, mobileno } = resultMsg;
          getApp().globalData.PHONE = mobileno;
          that.setData({
            roleid: roleid,
            userInfoBtn: false
          })
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