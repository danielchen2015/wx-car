//app.js
const APP_ID = '';//输入小程序appid  
const APP_SECRET = '';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
import http from './utils/http.js';
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
            wx.clearStorageSync();
          }
        }
      })
    });
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    let that = this;
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("没有过期");
        if (!wx.getStorageSync("code")){
          wx.login({
            success(res){
              if (res.code) {
                that.globalData.code = res.code;
              }
            }
          })
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log("过期了,重新登录")
        wx.clearStorageSync();
        that.login(); // 重新登录
      }
    })
    wx.setStorageSync("roleid", 1);
  },
  login: function(){
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          that.globalData.code = res.code;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    OPEN_ID: "" || wx.getStorageSync("OPEN_ID"),
    SESSION_KEY: null,
    PHONE:"",
    code:''
  },
  onReady: function () {

  },
})

//ozfv9447vCxnVCygkLjw7taxbt4I