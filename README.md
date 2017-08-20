## wc-swiper
基于 Vue 的移动端的图片轮播组件.

## why
我之前一直在用 vue-awesome-swiper, 功能很齐全, 但是唯一的问题就是体积比较大. 
我只是想要一个简单的图片轮播, 但是却要引入 100多k 大小的文件, 这样是不对的. 

## 功能点
1. 支持自动播放
2. 支持用户滑动行为
3. 仅支持无限轮播 (loop) 效果.

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
<div v-if="list.length">
	<wc-swiper>
		<wc-slide v-for="(v, k) in list" :key="k">
			// 这里放具体类容
		</wc-slide>
	</wc-swiper>
</div>
```

## 配置说明
* wc-swiper 上暴露了两个配置选项, duration, interval, 类似这样:
```html
	<wc-swiper :duration="300" :interval="2000">
	duration: 配置每一次滑动持续的时间
	interval: 配置两次滑动的间隔时间
```

* wc-slide 上面可以监听两个事件: touchstart & click, 因为可能点击跳转并不是通过 a 标签实现的,
而是用户自定义实现.

* 在 wc-swiper 外面包裹了一层div, 是因为防止这样的一种情况: 数据是异步获取, 而 wc-swiper 在页面
进入的时候就开始初始化, 这样会导致初始化失败: 因为此时数据为空. 所以包裹一层, 通过 v-if, 来控制当存在
数据的时候才初始化. 

* 关于 pagination
目前暂时没有提供相关的接口去修改 pagination 的样式。同时 pagination 的样式比较少, 所以你可以选择直接覆盖:
pagination 的实现结构:
```html
.wc-pagination
	.wc-dot
	.wc-dot.wc-dot-active
```

## 尚未解决的问题
1. 多指触碰的时候, 会导致 slide 定位错乱;
2. 如果 interval 设置的比较短 (比如 < 100), 此时有很大概率使得用户行为出错. 


## 实现步骤

