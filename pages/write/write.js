// pages/write/write.js
import http from '../../utils/http.js';
import urlApi from '../../utils/const.js'
var Base64 = require('../../utils/base64.js').Base64;
var Bei = 110000;
var Bei_num = 110100;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topStartTime:'',
    startTime: '',
    endTime: '',
    topSelectTime:'',
    topOrdertime:'',
    outSelectTime: '',
    outOrdertime: '',
    multiIndex: [0, 0, 0],
    multiArray: [],
    imgList: [],
    imgList1:[],
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    price:"",
    models:"",
    boarddateyear:"",
    boarddatemonth:"",
    proddateyear:"",
    proddatemonth:"",
    realmileage:"",
    condition:"",
    contacttel:"",
    guideprice:"",
    displacement:"",
    configuration:"",
    loc_province: "",
    loc_city: "",
    loc_area: "",
    transfer_times:"",
    cityData:"",
    RES_HOST: urlApi.RES_HOST
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getauth();
    this.getprovince();
    
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
    if (!app.globalData.OPEN_ID){
      wx.switchTab({
        url: '/pages/user/user'
      })
    }
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
  //价格
  handprice(e){
    this.setData({
      price: e.detail.value
    })
  },
  //类型
  handmodels(e){
    this.setData({
      models: e.detail.value
    })
  },
  //上牌选择时间
  topTimeChange(e) {
    let topOrdertime = this.datetime_to_unix(e.detail.value);
    this.setData({
      topSelectTime: e.detail.value,
      topOrdertime
    })
    let obj = this.setTime(this.data.topSelectTime);
    let { year,mounth}  = obj;
    this.setData({
      boarddateyear:year,
      boarddatemonth: mounth
    });
    
  },
  //出厂选择时间
  outTimeChange(e) {
    if (!this.data.topSelectTime){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请前选择上牌日期',
        success(res) {
          if (res.confirm) {
          }
        }
      })
      return false
    }
    let outOrdertime = this.datetime_to_unix(e.detail.value);
    this.setData({
      outSelectTime: e.detail.value,
      outOrdertime
    })
    let obj = this.setTime(this.data.outSelectTime);
    let { year, mounth } = obj;
    this.setData({
      proddateyear: year,
      proddatemonth: mounth,
    });
    
  },
  //处理年月
  setTime(date){
    let jsonObj = {
      year:"",
      mounth:""
    }
    let arr = date.split("-");
    jsonObj.year = arr[0];
    jsonObj.mounth = arr[1];
    return jsonObj;
  },
  //转化时间戳
  datetime_to_unix(datetime) {
    var tmp_datetime = datetime.replace(/:/g, '-');
    tmp_datetime = tmp_datetime.replace(/ /g, '-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0], arr[1] - 1));
    return parseInt(now.getTime() / 1000);
  },
  //公里
  handrealmileage(e){
    this.setData({
      realmileage: e.detail.value
    })
  },
  //描述
  handcondition(e){
    this.setData({
      condition: e.detail.value
    })
  },
  //电话
  handcontacttel(e){
    this.setData({
      contacttel: e.detail.value
    })
  },
  //新车指导
  handguideprice(e){
    this.setData({
      guideprice: e.detail.value
    })
  },
  //排量
  handdisplacement(e){
    this.setData({
      displacement: e.detail.value
    })
  },
  //汽车配置
  handconfiguration(e){
    this.setData({
      configuration: e.detail.value
    })
  },
  //过户
  handtransfer_times(e){
    this.setData({
      transfer_times: e.detail.value
    })
  },
  //地址
  MultiChange(e) {
    // let str = this.data.multiArray[0][this.data.multiIndex[0]].province + ',' + this.data.multiArray[1][this.data.multiIndex[1]].province +','+ this.data.multiArray[2][this.data.multiIndex[2]].province;
   
    // this.setData({
    //   multiIndex: e.detail.value,
    //   cityData:str
    // })
    // let arrStr = this.setCityData(this.data.cityData);

    // this.setData({
    //   loc_province: arrStr[0],
    //   loc_city: arrStr[1],
    //   loc_area: arrStr[2],
    // })
    // console.log("ok", arrStr)
  },
  MultiColumnChange(e) {
    if (e.detail.column == 0){
      let num = e.detail.value;
      let objData = this.data.multiArray[e.detail.column];
      let { id, provinceid, cityid } = objData[e.detail.value];
      this.getcity(provinceid);
      this.setData({
        'multiIndex[0]': e.detail.value,
        'multiIndex[1]': 0,
        'multiIndex[2]': 0
      })
    } else if (e.detail.column ==1){
      let num = e.detail.value;
      let objData = this.data.multiArray[e.detail.column];
      let { id, cityid } = objData[e.detail.value];
      this.getarea(cityid);
      this.setData({
        'multiIndex[1]': e.detail.value
      })
    }else{
      this.setData({
        'multiIndex[2]': e.detail.value
      })
    }

  },
  //城市数据处理
  setCityData(data){
    let strData = data.split(",");
    return strData;
  },
  //图片上传
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '这图片',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '删了',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        let pics = res.tempFilePaths;
        this.uploadimg({
          url: this.data.RES_HOST + 'index.php/api/upload/upload',
          path: pics
        })
       
      }
    });
  },
  //多张图片上传
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        //图片上传成功，图片上传成功的变量+1
        // console.log(resp)
        // console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
        let { statusCode, data } = resp
        if (statusCode == 200) {
          success++;
          let { resultMsg } = JSON.parse(data);
          that.data.imgList.push(resultMsg.imgName);
          that.setData({
            imgList: that.data.imgList
          })
        } else {

        }
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        // console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        // console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数                
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  //微信上传
  ViewImage1(e) {
    wx.previewImage({
      urls: this.data.imgList1,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg1(e) {
    wx.showModal({
      title: '这图片',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '删了',
      success: res => {
        if (res.confirm) {
          this.data.imgList1.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList1: this.data.imgList1
          })
        }
      }
    })
  },
  ChooseImage1() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.updatePic1(res.tempFilePaths[0])
      }
    });
  },
  //获取省列表
  getprovince(){
    let that = this;
    http({
      url:"api/areas/getprovince",
      success:function(res){
        let { resultCode, resultMsg} = res;
        if (resultCode == 200){
          let arrData = [...resultMsg];
          that.data.multiArray.push(arrData);
          that.setData({
            multiArray:that.data.multiArray
          })
          that.getcity(Bei);
          that.getarea(Bei_num);
        }
      },
      fail: function(err){
        console.log("err",err);
      }
    })
  },
  //获取市信息
  getcity(id){
    let that = this;
    http({
      url:"/api/areas/getcity",
      data: {
        proviceid:id
      },
      success:function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){
          let arrData = [...resultMsg];
          let newArrData = that.setcitydata(arrData);
          if (that.data.multiArray.length == 1){
            that.data.multiArray.push(newArrData);
          }else{
            that.data.multiArray.splice(1, 1, newArrData);
          }
          that.setData({
            multiArray: that.data.multiArray
          })
          let { cityid} = that.data.multiArray[1][0]
          that.getarea(cityid);
        }else{
          that.data.multiArray.splice(1, 2,[],[]);
          that.setData({
            multiArray: that.data.multiArray
          })
        }
       
      },
      fail: function(err){
        console.log("err", err);
      }
    })
  },
  //处理市的字段
  setcitydata(data){
    if (data.length) {
      let arr = [];
      data.map((item) => {
        arr.push({
          province: item.city,
          cityid: item.cityid,
          id: item.id,
          provinceid: item.provinceid
        })
      })
      return arr;
    }
  },
  //获取区的信息
  getarea(id){
    let that = this;
    http({
      url:"/api/areas/getarea",
      data:{
        cityid: id
      },
      success:function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200) {
          let arrData = [...resultMsg];
          let newArrData = that.setareadata(arrData);
          // console.log("newArrData", newArrData)
          if (that.data.multiArray.length == 2) {
            that.data.multiArray.push(newArrData);
          } else {
            that.data.multiArray.splice(2, 1, newArrData);
          }
          that.setData({
            multiArray: that.data.multiArray
          })
        }else{
          that.data.multiArray.splice(2, 1,[]);
          that.setData({
            multiArray: that.data.multiArray
          })
        }
      },
      fail: function (err) {
        console.log("err", err);
      }
    })
  },
  //处理区的字段
  setareadata(data) {
    if (data.length) {
      let arr = [];
      data.map((item) => {
        arr.push({
          province: item.area,
          cityid: item.cityid,
          id: item.id,
          areaid: item.areaid
        })
      })
      return arr;
    }
  }, 
  //微信上传
  updatePic1(data) {
    let that = this;
    wx.uploadFile({
      url: this.data.RES_HOST + 'index.php/api/upload/upload',
      filePath: data,
      name: 'file',
      success: function (res) {
        //打印
        let { resultCode, resultMsg } = JSON.parse(res.data);
        if (resultCode == 200) {
          that.data.imgList1.push(resultMsg.imgName);
          that.setData({
            imgList1: that.data.imgList1
          })
        }
      }
    })
  },
  //提交
  submitTab(){
    let that = this;
    let price = this.data.price;
    let models = this.data.models;
    let realmileage = this.data.realmileage;
    let topSelectTime = this.data.topSelectTime;
    let outSelectTime = this.data.outSelectTime;
    let contacttel = this.data.contacttel;
    let guideprice = this.data.guideprice;
    let displacement = this.data.displacement;
    let configuration = this.data.configuration;
    let multiIndex = this.data.multiIndex.length;
    let transfer_times = this.data.transfer_times;
    let imgList = this.data.imgList.length;
    let imgList1 = this.data.imgList1.length;
    if (!price || !models || !realmileage || !topSelectTime || !outSelectTime || !contacttel || !guideprice || !displacement || !configuration || !multiIndex || !transfer_times || !imgList || !imgList1){
      wx.showModal({
        showCancel:false,
        title: '提示',
        content: '*号的必输入项',
        success(res) {
          if (res.confirm) {
           
          }
        }
      })
        return false;
    }
    if (Number(this.data.topOrdertime) <= Number(this.data.outOrdertime)){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '上牌日期要大于出厂日期',
        success(res) {
          if (res.confirm) {

          }
        }
      })
      return false
    }
    if (this.data.multiArray[1].length<1){
      let artStr  =  this.data.multiArray[0][this.data.multiIndex[0]].province
      this.setData({
        loc_province: artStr,
        loc_city: artStr,
        loc_area: artStr,
      })
    }else{
      let str = this.data.multiArray[0][this.data.multiIndex[0]].province + ',' + this.data.multiArray[1][this.data.multiIndex[1]].province + ',' + this.data.multiArray[2][this.data.multiIndex[2]].province;
      this.setData({
        cityData: str
      })
      let arrStr = this.setCityData(this.data.cityData);

      this.setData({
        loc_province: arrStr[0],
        loc_city: arrStr[1],
        loc_area: arrStr[2],
      })
    }
    console.log("loc_province", this.data.loc_province, this.data.loc_city, this.data.loc_area)
    let objData = {
      price: this.data.price,
      models: this.data.models,
      boarddateyear: this.data.boarddateyear,
      boarddatemonth: this.data.boarddatemonth,
      proddateyear: this.data.proddateyear,
      proddatemonth: this.data.proddatemonth,
      realmileage: this.data.realmileage,
      condition: this.data.condition,
      contacttel: this.data.contacttel,
      vehicleimgs: this.data.imgList,
      weixinimg: this.data.imgList1[0],
      guideprice: this.data.guideprice,
      displacement: this.data.displacement,
      configuration: this.data.configuration,
      loc_province: this.data.loc_province,
      loc_city: this.data.loc_city,
      loc_area: this.data.loc_area,
      transfer_times: this.data.transfer_times,
      openid: app.globalData.OPEN_ID,
    }
    http({
      url:"/api/vehicle/add",
      method:"POST",
      data: objData,
      success: function(res){
        let { resultCode, resultMsg } = res;
        if (resultCode == 200){
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '发布车辆成功，系统将审核您发布的车辆信息',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }
            }
          })
          let objData = {
            topOrdertime:"",
            outOrdertime:"",
            topStartTime:'',
            price: "",
            models: "",
            boarddateyear: "",
            boarddatemonth: "",
            proddateyear: "",
            proddatemonth: "",
            realmileage: "",
            condition: "",
            contacttel: "",
            topSelectTime:"",
            outSelectTime:"",
            vehicleimgs: "",
            weixinimg: "",
            guideprice: "",
            displacement: "",
            configuration: "",
            loc_province: "",
            loc_city: "",
            loc_area: "",
            transfer_times: "",
            imgList: [],
            imgList1: [],
          }
          that.setData(objData)

        }else{
          wx.showToast({
            title: '发布失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(err){
        console.log("err",err);
      }
    })
  },
  //授权
  getauth(){
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //用户已经授权过
              // wx.switchTab({
              //   url: '/pages/write/write'
              // })
            }
          });
        }else{
          wx.switchTab({
                url: '/pages/user/user'
          })
        }
      }
    })
  },
  //获取用户信息接口
  queryUsreInfo: function (openid, mobileno) {
      http({
        url:"/api/User/info",
        data:{
          openid,
          mobileno
        },
        success: function(res){
            console.log("res",res);
          // getApp().globalData.userInfo = res.data;
        },
        fail: function(err){
          console.log("err",err);
        }
      })
  }
})