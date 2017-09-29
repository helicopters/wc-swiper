## wc-swiper
基于 Vue 的移动端的图片轮播组件.

## why
之前一直在用 vue-awesome-swiper, 功能很齐全, 但是唯一的问题就是体积比较大. 
我只是想要一个简单的图片轮播, 但是却要引入 100多k 大小的文件, 这样是不对的. 

## 特点
* 支持自动播放 & 无限轮播 (loop) 效果
* 支持用户手动滑动
* 压缩后大概 ~8k
* 支持鼠标事件
* 支持上一页, 下一页, 以及滚动到指定页面
* 支持自定义 Pagination 以及左右箭头


## 使用
```shell
npm i wc-swiper --save

```
```javascript
// 在入口文件中引入(暂时不支持单组件引入的方式):
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);

```


```html
// 在需要使用的 view 里面引入:
<wc-swiper>
	<wc-slide>
		// 这里放你需要轮播的内容, 比如一张图片
	</wc-slide>
</wc-swiper>

// 循环列表
<wc-swiper>
   <wc-slide v-for="(slide, key) in slides" :key="key">
   </wc-slide>
</wc-swiper>

// 异步获取 slides 的时候, 需要在 wc-swiper 上面添加 v-if 判断
<wc-swiper v-if="slides.length">
   <wc-slide v-for="(slide, key) in slides" :key="key">
   </wc-slide>
</wc-swiper>

// 带配置选项
<wc-swiper :duration="900" :interval="2000" @transitionend="fn">
	<wc-slide>
		// 这里放你需要轮播的内容, 比如一张图片
	</wc-slide>
</wc-swiper>


```

## 配置
在 wc-swiper 上面暴露了一些配置选项:

```shell
duration:	一次滑动的时间 | default: 500ms
interval:	两次滑动间隔时间 | default: 2500ms
autoplay:	是否自动播放 | default: true
therehold:	用户滑动多少距离之后自动翻页 | default: 110
curSlide:   默认显示第几个 slide | default: 0

```

## 事件
* 在 wc-swiper 上可以监听一些事件:
```shell
transitionend 事件
每一次滑动结束(不论用户手动滑动, 还是自动滑动) 都会触发 transitionend 事件. 
transtionend 携带唯一一个参数:currentSlide, 用来表明, 当前 slide 是第几个 slide.
并且要注意: slide 从 0 开始计数.
```
* 在 wc-slide 上面可以监听 click 事件. 

## 方法

> 有些时候, 你可能想要实现这样一种操作: 点击一个按钮, 让 swiper 跳转到指定的 slide, 或者点击按钮, 让
swiper 跳转到上一个或者下一个. 对此, 你可以这样操作:

```javascript
1. 在 <wc-swiper> 标签上添加 ref 属性, 例如: <wc-swiper ref="swiper"></wc-swiper>
2. 通过 this.$refs.swiper 来引用预先提供的 3 个方法:

slideTo (index) 跳转至指定索引 (index 从 0 开始)
next () 跳转到下一个
previous () 跳转到上一个

例如:
this.$refs.swiper.slideTo(3) // 跳转到索引为 3 的 slide

```


## 问题描述

**1. 如何设置轮播图的高度**
> 通过设置 wc-swiper 的高度即可. 比如:

```html
<wc-swiper class="swiper"></wc-swiper>
```
```css
.swiper {
	height: 200px;
}
```


**2. 如何渲染异步数据**
> 一般情况下, 轮播的数据可能通过接口请求得来, 此时, 需要在 wc-swiper 上面加上 v-if 判断, 从而延迟 wc-swiper 的渲染时机:

```html
<wc-swiper v-if="slides.length">
   <wc-slide v-for="(slide, key) in slides" :key="key">
   </wc-slide>
</wc-swiper>
```

**3. 点击 slide 的时候如果需要跳转新的页面该怎么办**
> 可以为 wc-slide 的内容包裹一层 a 标签

```html
<wc-swiper>
	<wc-slide>
		<a>
		   //content
		</a>
	</wc-slide>
</wc-swiper>
```

> 或者可以在 wc-slide 上面监听 click 事件:

```html
<wc-swiper>
	<wc-slide @click="fn"></wc-slide>
</wc-swiper>
```

**4. 怎么添加 pagination 或者左右箭头?**
> 个人认为, pagination 以及 arrow-left, arrow-right, 都只是 swiper 的配套设施, 而不应该是组成的一部分. 所以没有提供默认的 pagination 和 arrow, 而是提供了 slot, 如果你希望
为 swiper 添加 pagination 或者 arrow, 可以通过这样的方式添加: 

```html
<wc-swiper>
	<div slot="pagination"></div>
	<div slot="arrowLeft"></div>
	<div slot="arrowRight"></div>
</wc-swiper>
```

可以参考这个的写法: ![Pagination](https://github.com/helicopters/wc-swiper/blob/master/src/Pagination.vue)

## 存在的问题
* 多指触碰的时候, 比如多根手指同时滑动的时候, 就会出现问题, 这种极端情况, 比较复杂和少见, 暂时不考虑. 


## 项目地址
![wc-swiper](https://github.com/helicopters/wc-swiper)