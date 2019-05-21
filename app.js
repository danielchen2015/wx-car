//app.js
const APP_ID = 'wx1ad4930678497276';//输入小程序appid  
const APP_SECRET = 'f39a00e41f7dfaaa18cfbf4c6fced872';//输入小程序app_secret  
var OPEN_ID = 'ozfv9447vCxnVCygkLjw7taxbt4I'//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
import http from './utils/http.js';
App({
  onLaunch: function () {
    let that = this;
    wx.login({
      success(res){
        if(res.code){
          that.globalData.code = res.code;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    OPEN_ID: "",
    SESSION_KEY: null,
    PHONE:"",
    code:''
  },
  onReady: function () {

  },
})

//ozfv9447vCxnVCygkLjw7taxbt4I