        // pages/home/home.js
import http from '../../utils/http.js';
import urlApi from '../../utils/const.js'
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
    circular:true,
    bedate: "",
    ladate: "",
    car:{},
    pricefrom: '0',
    priceto: '111',
    timefrom: '',
    timeto: '',
    models: '',
    self: '',
    RES_HOST: urlApi.RES_HOST,
    urls:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSlider();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bindcar()
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

  },
  //图片
  viewImage(e){
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: this.data.urls // 需要预览的图片http链接列表
    })
  },
  // 选择开始日期
  bindBeDateChange(e) {
    let timefrom = this.datetime_to_unix(e.detail.value)
    this.setData({
      timefrom: timefrom,
      bedate:e.detail.value
    })
  },
  //选择结束日期
  bindLaDateChange(e) {
    if (!this.data.timefrom){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请前选择开始时间',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return false
    }
    let timeto = this.datetime_to_unix(e.detail.value);
    if (Number(this.data.timefrom) >= Number(timeto)){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请大于结束时间',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return false
    }
    this.setData({
      timeto: timeto,
      ladate:e.detail.value
    })
  },
  //车辆列表
  bindcar(){
    let that = this;
    let status = 2;//wx.getStorageSync("roleid") == 1?2:1;
    http({
      url: "/api/vehicle/getvehicleinfo",
      data: {
        openid: wx.getStorageSync("OPEN_ID"),
        status:status
      },
      success: function (res) {
        that.setData({
          car:res.resultMsg
        })
        
      },
      fail: function (err) {
        console.log("err", err);
      }
    })
  },
  bePrice(e) {
    this.setData({
      pricefrom: e.detail.value
    })
  },
  ovPrice(e) {
    this.setData({
      priceto: e.detail.value
    })
  },
  getmodels(e) {
    this.setData({
      models: e.detail.value
    })
  },
  searchCar(){
    let that = this;
    let status = 2;//wx.getStorageSync("roleid") == 1 ? 2 : 1;
    http({
      url: "/api/vehicle/getvehicleinfo",
      data: {
        openid: wx.getStorageSync("OPEN_ID"),
        pricefrom: that.data.pricefrom,
        priceto: that.data.priceto,
        timefrom: that.data.timefrom,
        timeto: that.data.timeto,
        models: that.data.models,
        self: that.data.self,
        status:status
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
            content: '没有找到你要的车辆',
            success(res) {
              if (res.confirm) {
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
  datetime_to_unix(datetime) {
    var tmp_datetime = datetime.replace(/:/g, '-');
    tmp_datetime = tmp_datetime.replace(/ /g, '-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0], arr[1] - 1));
    return parseInt(now.getTime() / 1000);
  },
  //车辆详情
  gotoCar(e){
    wx.navigateTo({
      url: '../home/car/car?id=' + e.currentTarget.dataset.id,
    })
  },
  //轮播图
  getSlider(){
    let that = this;
    http({
      url:"/api/Config/info",
      success: function(res){
        let { resultCode, resultMsg} = res;
        if (resultCode == 200){
         
          let imgList = resultMsg.arr;
          let urls = [];
          imgList.map((item)=>{
            urls.push(urlApi.RES_HOST+item)
          })
          that.setData({
            imgUrls: resultMsg.arr,
            urls:urls
          })

        }
      },
      fail: function(){

      }
    })
  }

})