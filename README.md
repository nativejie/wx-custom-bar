# wx-custom-bar
一个自定义带搜索的微信导航栏，实现过程如下
## 自定义微信小程序导航栏
因为项目需要，要实现如京东小程序类似的搜索导航栏-下图所示搜索框在导航栏中。参考了官方API最终实现了该有的效果，顺便吧此次实现的思路和代码记录下来。
![搜索图片](https://img-blog.csdnimg.cn/20200429170802953.PNG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExMzY5NTA4NDY4,size_16,color_FFFFFF,t_70)
### 一、拆解分析
按照正常的导航栏拆解来进行计算自定义导航栏的高度。根据下图中可以得到导航栏的高度等于：手机状态栏的高度 + 胶囊按钮高度（途中标注菜单栏）+ 以及胶囊按钮的上下边距。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200429172016197.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExMzY5NTA4NDY4,size_16,color_FFFFFF,t_70)
根据微信<code> API - getMenuButtonBoundingClientRect </code>可以得到胶囊按钮的坐标和高宽此时可以得到的信息：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200429172234801.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExMzY5NTA4NDY4,size_16,color_FFFFFF,t_70)
再根据<code> getSystemInfo </code>获得状态栏高度---<code> statusBarHeight </code>
然后计算出边距为：
<code> margin = top(胶囊按钮上边界坐标) - statusBarHeight </code>
最终得到导航栏的高度为:
<code> customBarHeight = height + statusBarHeight + (margin * 2) </code>
知道这些信息剩下的就是实现了，下面是全部实现代码。
### 二、代码实现
<code> json</code>文件设置 
 ```json
  "navigationStyle": "custom"
  ```
<code> JS</code>代码部分
```javascript
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navHeight: '',
    menuButtonInfo: {},
    searchMarginTop: 0, // 搜索框上边距
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0 // 搜索框高度
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
          searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
          searchHeight: height,  // 与胶囊按钮同高
          searchWidth: right - width // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
        })
      },
    })
  }
})
```
<code> wxml</code>代码
```html
<!--index.wxml-->
<view class="custom-bar" style="height:{{navHeight}}px">
  <view class="custom-bar__wrapper" style="margin-top:{{searchMarginTop}}px; height: {{searchHeight}}px;width: {{searchWidth}}px" >
    <view class="search-group">
    <image src="../../static/images/search.png" mode="aspectFit" />
      <input class="search-group__input" auto-focus placeholder="输入点什么吧"/>
    </view>
  </view>
</view>
```
<code> wxss</code>代码
```css
view {
  box-sizing: border-box;
  overflow: hidden;
}
.custom-bar {
  /* background-color: #aaa; */
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
.custom-bar__wrapper {
  padding: 0 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-group {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #666;
  border-radius: 60rpx;
  padding: 0 10rpx;
}
.search-group > input {
  font-size: 25rpx;
}
.search-group > image {
  height: 32rpx;
  width: 32rpx;
  margin-right: 20rpx
}
```
最终实现效果（返回按钮因为懒得找图标就没加上去 - -)  ------ [代码地址](https://github.com/nativejie/wx-custom-bar)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200511161253502.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExMzY5NTA4NDY4,size_16,color_FFFFFF,t_70)



