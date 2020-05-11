//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navHeight: '',
    menuButtonInfo: {},
    searchMarginTop: 0,
    searchWidth: 0,
    searchHeight: 0
  },
  onLoad: function () {
    this.setData({
      menuButtonInfo: wx.getMenuButtonBoundingClientRect()
    })
    console.log(this.data.menuButtonInfo)
    const { top, width, height, right } = this.data.menuButtonInfo
    wx.getSystemInfo({
      success: (res) => {
        const { statusBarHeight } = res
        const margin = top - statusBarHeight
        this.setData({
          navHeight: (height + statusBarHeight + (margin * 2)),
          searchMarginTop: statusBarHeight + margin,
          searchHeight: height,
          searchWidth: right - width
        })
      },
    })
  }
})
