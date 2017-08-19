实现步骤
1. 让所有 slide 水平排列 , html 结构..

2. 对所有 slide 进行定位, 让它们层叠在一起, 并且位置都在可视区域之内(vp)

3. 对所有 slide 进行 translate 操作, 让它们都移动到屏幕左边, 一个屏幕的距离 (设一个屏幕的距离为 w)

4. 让 slide0 translate到屏幕中, slide1 translate 到屏幕右侧一个 w 距离

5. 在固定时间之后, 让 slide0 & slide1 向左边移动一个 w, 同时让 slide2 移动到屏幕右侧一个 w 的距离
   也就是 slide1 占据了原本 slide0 的位置, slide2 占据了原本 slide1 的位置

6. 定时重复 5, 当 当前屏幕显示的是最后一个 slide 的时候, 让 slide0, 移动到屏幕右边 一个 w 的距离. 


















/*
基于 vue 实现, 需要实现的功能
1. 可以通过列表渲染出来
2. 只要有一种样式
3. 支持自己滚动


原理:
       ---
 ---   ---   ---

首先要让3个子元素这样排列. 

1. 让所有的子元素都绝对定位, 然后通过 translate 来控制位置
2. 让元素动起来, 先让元素增加动画效果.

开始时刻, 3个 slide 的 translate 分别是 0 100% 200%
第一次动的时候, 分别为 -100% 0 200%

所以我们要在某个时刻, 修改这三个元素的值 translate 值

3. 修改的时候, 还要加上 transition, 这个只要让元素拥有transition 属性即可
bug1: slide 可以滑动, 让 swiper-box overflow hidden 即可. 

修改点
1. 现在slide的 init 位置, 是我们自己写死的, 但是应该根据 slide 是第几个元素, 自己计算一下
并且 slide 的个数不定, 所以你要通过父元素来获取 slide

bug2: 如果我们使用百分比, 在设置的时候, 不生效, 暂时不考虑为什么, 直接使用 px
bug3: 如果在最开始已经在样式里面给元素添加了 transition, 那么init translate 的时候
transition 就生效了, 所以要动态加 transition.

4. 在指定时间之后, 修改当前的所有 slides 的 translate 值, how?
a 获取当前 slide 的 translate 值, 
b 减去当前 slide 应该移动的值

但是这里存在一个问题, 获取 translate 的值的时候会发现获取的是这个玩意 translate(375px)
这不傻逼了吗

另外一种方式, 不需要计算, 我们只要记录一下当前是第几次滑动, 然后把滑动次数加到计算中, 即可.
比如对于第一个 slide
次数 translateX
0   0/-375*0
1   -375
2   -375*2
3   -375*3
4   -375*4

第二个呢
次数 translateX
0   375
1   0
2   -375*1
3   -375*2
4   -375*3

我们的公式应该是什么样子的?

375 * slideLocation - 375*times

375 * (slideLocation - times);


5 现在来解决 transition 的问题, 我们需要给 slide 增加 transition
但是又不能立即加

6 重复调用
不用 setInterval() 使用 setTimeout()
类似这样
function run(){
	setTimeout(()=>{
		move();
		times++;
		run();
	}, 2000)
}

问题: 发现一个问题, 我们设置的是, slide 2000ms 动一下, 然后动一下持续 2s
这样就会造成, 动画一直在动, 一直在动, 这样肯定不行. 
我们要的是: 2000ms, 动一下, 持续 1000ms, 停 2000ms, 再来一遍. 
那么怎么操作?

首先, 页面进来, 停 2000ms, 这里需要通过什么方式实现?
或者说你觉得相关的属性有哪些
setTimeout() 的时间
transition-duration
transition-delay

进到页面, 先初始化, 不动, 过了 2000ms, 调用 setTimeout(), 执行动画, 立即执行
执行结束之后, 需要重新开始计时, 所以需要 transition end操作?

嗯, 就是在 transition 里面操作. 

问题2: 希望在 slide 到头的时候, 从头开始, 或者衔接着来, 首先要知道, 什么时候结束了。







第三种方式, 连着来, 3 之后继续往后滚动, 滚动成1, 这个咋搞哦, 
而且还不能让用户感觉到, 也不能让啥啥啥的, 我日了狗哦

 我想到一种
 1. 假设 abc 三个 slide, a 滚出去的时候, 立刻把 a 搬到 c 后面, 形成顺序, bca
 这样不行, 因为此时用户再往回滚就傻逼了

 我记得好像是有一个 a 实际上是被重复掉的, 也不一定, 我看 swiper.js 就不是这样. 

看知乎日报的效果, 得到这个结果即可. how

可以先不考虑用户行为, 我们先实现轮播效果. 


1
0  375  750

2
-375 0 375

3
-750 -375 0   此时显示第三个

在第一个滚动完成之后, transitionEnd

此时显示的样子是这样:
-375 0 375
我们在这里把 原来的第一个, 移动到后面去
-375 移动到 750
从而重新形成 
0 375 750 的样子

也就是说, 每次的第一个的 transitionEnd 之后, 或者说, 每次移除一个之后
都直接把第一个的位置定位出去, 而其他的, 都直接移动过去

每一个元素, 只管在每次移动的时候, 将自己的值, 减去 -375 即可, 不要管其他的任何事情.

然后在一定时间之后
1. 让所有的 slide 的 translate 值, 都减去 375


a b c
c a b c a

我是希望 transition 一直存在的,  display:none, del 

abc
bca
cab
abc

如果一直可以执行这样的循环, 操作就完美了
但是需要支持, b 可以向右滑动, 然后直接

a b c 这个时候, a 向右边滑动, 会显示出来 c, 好像 c 在 a 左边一样. 


首先是 3 个元素并排, 通过 css 实现, 然后开始动起来
每一次, 每个元素往左边移动y 一个屏幕的距离, 后面称为 w

这样的话, 要解决的是: 最后一个元素出现在屏幕之后, 你该如何处理, 此时有两种方案
1. 直接回滚到第一个, 重新开始, 但是这样的方式会很闪烁, 很不好, 放弃
2. 继续往下滚动, 然后显示第一个, 这种方式比较好一点

那么如何继续往下滚动, 
我想到的方案是: 每一个移出屏幕的元素, 都在消失之后, 直接移动到最后一个元素
比如 abc, 然后 a 移出屏幕之后, 将 a 放到 c 后面, 变成 bca

这样的方式有一个问题: 比如说可能移动到 b 之后, 右滑显示 a, 这样子的话, 此时 a 已经不存在了
怎么办?

所以不能让 a 立刻移动到, 而是要等到 b 也移出屏幕之后, 显示 c 的时候
再统一移动, 变成这样 cab
但是同时, 用户也可以左滑, 比如说显示 c 之后, 用户想要

    a   b   c
此时显示 b

	a    b   c
此时显示 c, 但是把 a, 移动到 c 后面, 形成  b c a, 这样用户左滑动, 右边滑动, 都可以正常,
但是还有一点, 用户如果 在 c 的时候, 连续两次回退, 比如说先回退到 b, 然后再回退到 a 
此时 a 都移出去了, 这样的话, 就会出现问题, 所以我们要在这样操作的时候, 再将 a 回退回来, 

也就是说, 每次显示一个 slide 的时候, 都会有特定的顺序
abc 的时候是一个样子

show a  abc
show b  abc
show c  bca
show a  

    屏幕 
     a   b   c
  a  b   c
a b  c
     a   b   c
  a  b   c
a b  c

是不是可以自己再加一个元素, 直接 loop 起来

我看 vip 的是, 设置了 left 和 translate  left 是固定的值, 而且是从
0-1, 负数越来越大, 为什么, 

它不是在初始化就设置所有的 tranlate 都依次增长的

初始化第一个元素  translate 0, 然后最后一个元素是 -w, 其他的元素, 都是 w
然后向右边移动一个位置, 
此时, 显示的为 0, 移出去的为 -w, 其他的都不变, 还是 375

假设有 7  个元素



始终保证当前显示的元素, 下一个元素是 w, 上一个元素是 -w, 始终保持这个水平即可, 
或者说, 始终保持, 当前显示的元素, 左边的都是 -w, 右边的都是 w, 
所以这里要使用 left, 因为不使用 left, 大家都叠加到一起了, 不叠加在一起也没有事情啊


问题1, 对于第二个元素, 同时设置 left: -375, translate 375 , 实际上它就是显示在第一个位置的
这是因为我们刚开始都是定位在统一的位置, 我们可以这样, 让所有的元素都排列在一起. 

显示成 table-cell ?

调整布局, 先让所有的元素处于一行. ok

布局一行之后, 再用代码处理一下
规则:


translate 的值
1 2 3 4 5 6 7
0 w w w w w -w
-w0 w w w w -w
-w-w0 w w w -w
-w-w-w0 w w -w
-w-w-w-w0 w -w
-w-w-w-w-w0 w
w -w-w-w-w-w 0

初始化的时候, 第一个元素的 t = 0, 同时 left = 0
第二个元素 t = w, left = -w
第三个元素 t = w, left = -2w?

这里是 translate 和 left 都用到了, 那没有 translate 的时代, 是怎么做到这个玩意的. 
肯定是有其他的方案的, 

位置 t  l
1    0  0
2    w  -w
3    w  -

所有的 slide 都是 relative 定位, left 是相对于自己本身的位置,
那么第一个元素, left 0 保持原来位置
第二个位置 , left -375 正好在屏幕中

这样布局结束之后, 最终的定位结果, 是三个元素都重叠起来了. 那我们要它们重叠起来干嘛啊. 

再看, 按照规则, 
1. 当前显示的 slide 肯定是 0, 当前显示的下一个是 w, 其他的都是 -w,

2. 在一定时间之后, 自动的更改次数, 然后重新跳转, 如果不加动画, 已经完整实现 loop 效果
但是加上 transiton 之后, 就会出现问题, 乱动,

乱动是因为, 一次修改多个值之后, 值需要以 transition 的形式过去, 我们有两种解决方案:

通过控制 transition-duration 的时间, 为0 的时候是瞬间变过去的



首先要触发第一个 slide , 通过change 吗.


0 1 2 这种循环的东西, 0 - 1 = 2
1 -1 0 
2- 1 =0


加上 left 
如果不加 t 的话, 所有的元素实际上都是放在可视区域的, 
通过代码, 再将一些元素直接修改掉, 

它这样搞, 当前元素肯定是 t0, 下一个元素肯定是 t 1w, 然后其他的所有元素都是 - w
为啥啊, 因为这样一次性, 得到的结果, 只是一个很简单的东西, 

肯定是最后一个元素, 然后设置好的, 因为 left 在最后, 所以也在最上面. 


每一个时刻, 都必定保持这样一种状态

    a  b  c

显示 a
a  的下一个元素, 是 w
其他的所有元素都是 -w

显示 b 的时候
b 是 0, c 就是 w, a 就是 -w

这样的方式, 前面的都是 -w, 后面的都是 w, 不是, 是所有的都是 -w, 
这样实际上

abcde
     c
       d  e
   b
   a

- - - -
0 w -w -w

仅仅定位的时候, 会这样:
- - - -
0 -w -2w -3w

挨个叠加起来的, 顺序是最后的放在前面. 

规则: 
1. 布局
2. 规则是

我们把一个slide的宽度称为 s, 把当前显示 slide 称为 c
1. 当前显示的 s


1 让所有的 slide 水平排列
2 通过定位, 将所有的 slide 定位到第一个 slide 所在的位置
    每一个 slide 的 left 比上一个多 一个 w
    定位的结果是所有的 slide 重叠在一起, 并且, 最后一个 slide 在最上面, 第一个 slide 在最下面
3 通过 translate 将所有的 slide 移动 -w 
然后将第一个 slide 移动 0, 这样第一个 slide 就显示出来了
然后将第二个(第一个slide的下一个 slide) translate w, 这样第二个就会在第一个 slide 的右边了

通过这一系列的操作, 我们得到的是这样一个结果

第一个 slide 显示在屏幕中
第二个 slide 在屏幕的右边
最后一个 slide 在屏幕的左边 (层叠的它层级最高)

此时我们开始进行变换:
要达到
1. 第一个 slide 往左边移动一个 w, 变成 -w
2. 第二个 slide 往左边移动一个 w, 变成 0
3. 第三个 slide 移动到右边, 变成 w

那么此时的结果是:

第二个 slide 显示在屏幕
第三个 slide 显示在屏幕的右边
第一个 slide 显示在屏幕的左边
  
  为什么此时第一个 slide 没有覆盖掉最后一个 slide ?
  不是, 此时最后一个 slide 依旧在最上面, 这一点没有错的. 

然后依次往下走, 走到最后一个 slide 的时候
最后一个 slide 在屏幕中, 下一个slide, 也就是第一个 slide 在右边
倒数第二个在左边

从而实现最后的代码. 那么如果只有两个元素呢. 

如何监听屏幕的滑动?


实现步骤

1. 先让多个 slide 水平排列成一行, 结构如下
```html
    .swiper-container
      .slide
      .slide
      .slide
```
css 如下

2. 对每一个 slide 进行定位, 使用相对定位, 假设每一个 slide 的宽度为屏幕宽度 w,
各个 slide 的left值分别为
```javascript
1 0
2 -w
3 -2w
```
也就是符合这样一个公式: left(slide) = -w * index(slide)
index 为 slide 的索引位置.

这样定位的结果就是, 所有的 slide 层叠在一起, 并且最后一个 slide 在最上面.

3 对所有的 slide 进行一次 translate, 让它们都移动到屏幕的左边,一个 w 单位
结果如下

4 现在的情况是所有的 slide 都不在屏幕内, 而在屏幕左边, 然后我们开始进行布局
让第一个 slide 放到屏幕中
让第二个 slide 放到屏幕右侧
通过 translate实现:
  slide1: translate(0)
  slide2: translate(w)

到这里, slide的第一种排列就出来了, 当 slide 滑动一次之后, 我们称为第二种状态, 第二种
状态如下:
第二个 slide 在屏幕中
第三个 slide 在屏幕右侧
此时第一个 slide 在屏幕左侧

同样是通过 translate 实现:
  
  slide2: translate(0)
  slide3: translate(w)

从而我们可以得到规律:
设置一个变量 times 来记录滑动次数, times 初始化为 0, 
初始化的时候:
  times = 0, 此时显示索引为 0 的 slide
  slide(0): translate(0)
  slide(1): translate(w)
  times = 1
  slide(1): translate(0)
  slide(2): translate(w)
也就是说:
times 的值, 就是当前需要显示在屏幕中的 slide 
times + 1 的值, 就是当前需要显示在屏幕右边的 slide, 所以我们可以这样设置:

  slide(times): tranlslate(0)
  slide(times + 1): translate(w)
其他的所有的 slide, 都是 transalte(-w)














触摸的时候, 先直接禁掉滑动, 不是, 还是先让元素滑动

touchstart 的时候, 直接开始更改左右的滑动位置. 



































<style>
	.swiper-box {
		height: 300px;
		width: 100%;
		position: relative;
		overflow: hidden;
	}
	.slide {
		position: absolute;
		top:0;
		left:0;
		width: 100%;
		height: 100%;
		
		/*transition: all 3s ease-in 2s;*/
	}
	.transition {
		transition: all 2s;
		/*transition-delay: 1.2s;*/
	}
	.slide-a {
		background: red;
	}
	.slide-b {
		background: yellow;
		/*transform: translateX(100%);*/
	}
	.slide-c {
		background: blue;
		/*transform: translateX(200%);*/
	}
</style>
<template>
	<div class="swiper-box">
		<div class="slide slide-a">1</div>
		<div class="slide slide-b">2</div>
		<div class="slide slide-c">3</div>
	</div>
</template>
<script>
/*
基于 vue 实现, 需要实现的功能
1. 可以通过列表渲染出来
2. 只要有一种样式
3. 支持自己滚动


原理:
       ---
 ---   ---   ---

首先要让3个子元素这样排列. 

1. 让所有的子元素都绝对定位, 然后通过 translate 来控制位置
2. 让元素动起来, 先让元素增加动画效果.

开始时刻, 3个 slide 的 translate 分别是 0 100% 200%
第一次动的时候, 分别为 -100% 0 200%

所以我们要在某个时刻, 修改这三个元素的值 translate 值

3. 修改的时候, 还要加上 transition, 这个只要让元素拥有transition 属性即可
bug1: slide 可以滑动, 让 swiper-box overflow hidden 即可. 

修改点
1. 现在slide的 init 位置, 是我们自己写死的, 但是应该根据 slide 是第几个元素, 自己计算一下
并且 slide 的个数不定, 所以你要通过父元素来获取 slide

bug2: 如果我们使用百分比, 在设置的时候, 不生效, 暂时不考虑为什么, 直接使用 px
bug3: 如果在最开始已经在样式里面给元素添加了 transition, 那么init translate 的时候
transition 就生效了, 所以要动态加 transition.

4. 在指定时间之后, 修改当前的所有 slides 的 translate 值, how?
a 获取当前 slide 的 translate 值, 
b 减去当前 slide 应该移动的值

但是这里存在一个问题, 获取 translate 的值的时候会发现获取的是这个玩意 translate(375px)
这不傻逼了吗

另外一种方式, 不需要计算, 我们只要记录一下当前是第几次滑动, 然后把滑动次数加到计算中, 即可.
比如对于第一个 slide
次数 translateX
0   0/-375*0
1   -375
2   -375*2
3   -375*3
4   -375*4

第二个呢
次数 translateX
0   375
1   0
2   -375*1
3   -375*2
4   -375*3

我们的公式应该是什么样子的?

375 * slideLocation - 375*times

375 * (slideLocation - times);


5 现在来解决 transition 的问题, 我们需要给 slide 增加 transition
但是又不能立即加

6 重复调用
不用 setInterval() 使用 setTimeout()
类似这样
function run(){
	setTimeout(()=>{
		move();
		times++;
		run();
	}, 2000)
}

问题: 发现一个问题, 我们设置的是, slide 2000ms 动一下, 然后动一下持续 2s
这样就会造成, 动画一直在动, 一直在动, 这样肯定不行. 
我们要的是: 2000ms, 动一下, 持续 1000ms, 停 2000ms, 再来一遍. 
那么怎么操作?

首先, 页面进来, 停 2000ms, 这里需要通过什么方式实现?
或者说你觉得相关的属性有哪些
setTimeout() 的时间
transition-duration
transition-delay

进到页面, 先初始化, 不动, 过了 2000ms, 调用 setTimeout(), 执行动画, 立即执行
执行结束之后, 需要重新开始计时, 所以需要 transition end操作?

嗯, 就是在 transition 里面操作. 

问题2: 希望在 slide 到头的时候, 从头开始, 或者衔接着来, 首先要知道, 什么时候结束了。







第三种方式, 连着来, 3 之后继续往后滚动, 滚动成1, 这个咋搞哦, 
而且还不能让用户感觉到, 也不能让啥啥啥的, 我日了狗哦

 我想到一种
 1. 假设 abc 三个 slide, a 滚出去的时候, 立刻把 a 搬到 c 后面, 形成顺序, bca
 这样不行, 因为此时用户再往回滚就傻逼了

 我记得好像是有一个 a 实际上是被重复掉的, 也不一定, 我看 swiper.js 就不是这样. 

看知乎日报的效果, 得到这个结果即可. how

可以先不考虑用户行为, 我们先实现轮播效果. 








*/

	export default {
		mounted () {

			let swiper = document.querySelector('.swiper-box');
			let swiperWidth = swiper.clientWidth;
			let slides = toArray(swiper.children);

			// 表示一次循环
			let slidesNum = slides.length;
			let times = 0;

			function toArray (value) {
				return Array.prototype.slice.call(value);
			}
			// set element translate x
			function setTranslateX (ele, x) {
				ele.style.transform = 'translateX(' + x + 'px)';
			}
			/*
				设置元素刚开始的位置, 
				能不能分开设置, 也就是说, 元素知道, 在一次滚动之后, 自己的位置应该
				是多少, 而不是由我们统一设置, 元素的位置在哪里. 

			*/
			function move () {
				slides.forEach((ele, index)=>{
					let x = swiperWidth * (index - times);	
					setTranslateX(ele, x);
				})
			}

			// 不能立即加上
			function addTransition() {
				setTimeout(()=>{
					slides.forEach((ele)=>{
						ele.classList.add('transition');
					})
				},1)
			}

			function init () {
				// 
				move();
				addTransition();
				times++;
			}
			slides[0].addEventListener('transitionend', ()=>{

				// 第一种方式
				// var timer;
				// if (times < slidesNum) {
				// 	// console.log('我操')
				// 	timer = setTimeout(()=>{
				// 		// run();
				// 		move();
				// 		times++;
				// 	},1200)
				// } else {
				// 	console.log('清除成功')
				// 	clearTimeout(timer);
				// 	// times=0;
				// }


				// 第二种方式, 从头来

				// if (times ==  slidesNum) {
				// 	// console.log('我操')
				// 	// times = 0;
				// 	// 强制 init
				// 	// init();
				// 	// 让所有的状态恢复到最开始的时候
				// 	times = 0;
				// 	// 回到最初的时候有一个 transition 效果, 我们想要 transition
				// 	// 但是不想要这么慢, 所以设置一下
				// 	let transitionDuration = slides[0].style

				// 	// 这种获取之后的方式, 我日了狗, 是一个很坑爹的问题, 这玩意不好搞.
				// 	// 先不考虑, 
				// 	console.log(transitionDuration)


				// }

				// setTimeout(()=>{
				// 	// run();
				// 	move();
				// 	times++;
				// },1200)

			}, false)
			init();
			setTimeout(()=>{
				move();
				times++;
			},1200)


		}
	}
</script>