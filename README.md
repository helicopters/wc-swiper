## wc-swiper
基于 Vue 的移动端的图片轮播组件.

## why
我之前一直在用 vue-awesome-swiper, 功能很齐全, 但是唯一的问题就是体积比较大. 
我只是想要一个简单的图片轮播, 但是却要引入 100多k 大小的文件, 这样是不对的. 

## 特点
* 支持自动播放 & 无限轮播 (loop) 效果
* 支持用户滑动
* 压缩后大概 ~8k 大小.

## 使用方式
```shell
npm i wc-swiper --save
```
```javascript
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper);
```


```html
<wc-swiper>
	<wc-slide v-for="(v, k) in list" :key="k">
		// 这里放具体内容
	</wc-slide>
</wc-swiper>

备注:
wc-swiper 上面有一些配置选项:

duration: 配置每一次滑动持续的时间  // 默认 500ms
interval: 配置两次滑动的间隔时间    // 默认 2500ms
pagination: 是否显示 pagination   // 默认 true
autoplay: 是否自动轮播            // 默认 true


```

## 使用说明
* wc-swiper 默认高度为 100%, 实际有多高, 取决于你给 wc-swiper 设置的高度, 或者父元素的高度. 

* 异步数据的渲染: 建议在 wc-swiper 上面添加 v-if 判断条件, 比如 v-if="slidesList.length",
以防止在数据返回之前, swiper 已经渲染执行完毕. 

* wc-slide 上面可以监听两个事件: touchstart & click, 所以用户可以直接在 wc-slide 上监听事件
```html
<wc-slide @click="fa" @touchstart="fb"></wc-slide>
```

* 关于 pagination
目前暂时没有提供相关的接口去修改 pagination 的样式。如果有需要可以直接覆盖默认样式.
pagination 的实现结构:
```html
.wc-pagination
	.wc-dot
	.wc-dot.wc-dot-active
```
覆盖上面 3 个class 即可.


## BUG
有一个很奇特的bug, 不是必现. 重现步骤:
第一次进入, 假设我们总计有 4 个 slide, init 的时候显示 1, 滑动到 4 的时候 

















