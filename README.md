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


当 f1 放上去的时候, 有时候会出现滑动一会, 才跟随的情况. 



有时当 f1 放上去的时候, 然后放 f2, 
理想状态: 直接响应 f2, 当 f1 不存在. 


设置了一个模块

try1: 当 f1 放上, id 为 undefined, curId 应该存在, 当 f2 放上去, id 为第一个 curId, 第二
个 curId 不应该和 第一个 curId 相同. 

实际情况: 两个不同的 touch 的 id 是相同的. 

因为你是始终拿第一个 touch 的 id 啊. 
var curId = T.id(T.changedTouches(e)[0]);

而我的要求是这样:
1. 我要拿到每一次 touch 的 id, 这个不应该始终拿 0, 而是拿当前的最后一个. 
所以改下算法. 

改好了, 现在我放上去, 但

f1 放上不动, 放 f2, 然后移开 f2, 会自动滑动回去, 也就是还是响应了
期望不响应, 也就是 touchend 事件不能响应 。

好吧, 我看了下, 好像是自己定义的 lib 的关系,

吗的 , 现在就替换. 

等下, 我发现用的是 changedTouches 实际上. 暂时也可以吧, 这个逻辑就相当于, 我拿到现在变化的是谁了. 

吗的吗的吗的, 老子才他吗发现, 不是自己的问题, 是代码写错了, 我之前通过 id 判断的方式是正确de, 
我草草草, 你当时封装什么封装, 吗的. 

现在第一个, 闪烁的问题解决了, 我要解决第二个问题,

去掉 lib-touch


然后
f1 放上去, f2 放上去, 此时跟随 f2 移动而移动. 
要改之前的判断条件, 不应该以 id 为跟随条件了. 

现在的情况是这样:

f1 放上, f2 上, 移动, 跟随, 
此时

f1 松开, 没有任何变化, 但是是有变化的. 会跟着动一下, 
因为 end 事件绑定的是 changedTouches, 但是我们要干嘛. 

我们要这样, 我们要在当前存在 len 

只要判断当前松开的的 id, 是不是, 生效的 id 就好了啊 

现在的情况是 f1 up, f2 up, f2 down, 此时 f1 还在, 此时, 

我们做到了, f1 在的时候 f2 放上去, f1 松开, 不会动, 只会跟着 f2 走啊走的. 


但是还存在问题 

现在好了. 

有时想想, 用户很傻逼才会一根手指放在屏幕上面, 然后另外一根手指在那里动啊动, 傻逼. 











































