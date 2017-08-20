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
<wc-swiper>
	<wc-slide v-for="(v, k) in list" :key="k">
		{{v}}
	</wc-slide>
</wc-swiper>
```

## 配置说明
1. wc-swiper 上暴露了两个配置选项, duration, interval, 类似这样:
```html
<wc-swiper :duration="300" :interval="2000">
duration: 配置每一次滑动持续的时间
interval: 配置两次滑动的间隔时间
```

2. 可以在 wc-slide 上面添加class, 用来控制 slide 的样式, 比如这样
```html
<wc-slide class="custom-slide"></wc-slide>
```
```css
.custom-slide{
	height: 300px;
	...
}
```

## 尚未解决的问题
1. 多指触碰的时候, 会导致 slide 定位错乱;
2. 如果 interval 设置的比较短 (比如 < 100), 此时有很大概率使得用户行为出错. 
