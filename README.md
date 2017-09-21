## wc-swiper
基于 Vue 的移动端的图片轮播组件.

## why
之前一直在用 vue-awesome-swiper, 功能很齐全, 但是唯一的问题就是体积比较大. 
我只是想要一个简单的图片轮播, 但是却要引入 100多k 大小的文件, 这样是不对的. 

## 特点
* 支持自动播放 & 无限轮播 (loop) 效果
* 支持用户手动滑动
* 压缩后大概 ~8k

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
<wc-swiper :duration="900" :interval="2000" :pagination="false" @transitionend="fn">
	<wc-slide>
		// 这里放你需要轮播的内容, 比如一张图片
	</wc-slide>
</wc-swiper>


```

## 配置选项
在 wc-swiper 上面暴露了一些配置选项:

```shell
duration:	一次滑动的时间 | default: 500ms
interval:	两次滑动间隔时间 | default: 2500ms
autoplay:	是否自动播放 | default: true
pagination:	是否显示 dots | default: true
transitionend:	每次滑动结束之后会触发transitionend 钩子函数. 携带唯一一个参数, 为当前 slide 的位置.
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
默认的, wc-swiper 的高度为 100%; 所以你也可以为 wc-swiper 外层包裹一个父元素, 设置父元素的高度. 或者通过 style 设置 wc-swiper 的高度. 

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

**4. 怎么修改 pagination 的样式**
> 目前没有提供修改 pagination 样式的入口. 因为一般对于 pagination 的修改, 要改就改的非常多. 所以你可以尝试直接覆盖默认的样式. 覆盖下面几个样式即可. 

```html
.wc-pagination
	.wc-dot
	.wc-dot.wc-dot-active
```

## Others
想着让用户自己提供 pagination 组件, 样式想怎么调整就怎么调整.

想着可以设置默认 slide, 不再始终是 1

想着可以在每次滑动之前和之后, 加上hook函数  // done

可以支持点击分页的时候, 可以跳转到指定的 slide.

