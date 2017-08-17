<style>
	body {
		padding-top: 50px;
	}
	.swiper-box {
		height: 300px;
		width: 1125px;
		/*width: 100%;*/
		position: relative;
		font-size: 0;
		/*overflow: hidden;*/
	}
	.slide {
		position: relative;
		/*top:0;*/
		/*left:0;*/
		/*width: 100%;*/
		font-size: 50px;
		text-align: center;
	

		transform-origin: 0px 0px 0px;
    	opacity: 1;
    	transform: scale(1, 1);

		height: 100%;
		display: inline-block;
		width: 375px;
		
		/*transition: all 3s ease-in 2s;*/
	}
	.transition {
		/*transition: all 2s;*/
		/*transition-duration: 1s;*/
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
	
	.page {
		position: absolute;
		top: 10px;

		
	}
	.item{
		display: inline-block;
		height: 20px;
		width: 20px;
		background: gray;

	}
	.active {
		background: white;
	}
	.container{
		width: 100%;
		overflow: hidden;
	}

</style>
<template>


	<div class="container">
		

		<div class="swiper-box">

			<div class=" slide slide-a">1</div>
			<div class=" slide slide-b">2</div>
			<div class=" slide slide-c">3</div>

		</div>
		<div class="page">
			<div class="item"></div>
			<div class="item"></div>
			<div class="item"></div>
		</div>

	</div>



</template>
<script>


	export default {
		mounted () {

			// array-like -> array
			function toArray(arraylike) {
				return Array.prototype.slice.call(arraylike);
			}

			// 获取 swiper 容器
			function getSwiper(selector) {
				return document.querySelector(selector);
			}

			// 获取 slides, 返回一个 array
			function getSlides (swiper) {
				return toArray(swiper.children);
			}

			// 获取单个slide的宽度
			function getSwiperWidth (swiper) {
				return document.body.clientWidth;
			}

			// 定义变量
			var swiper = getSwiper('.swiper-box');
			var slides = getSlides(swiper);
			var swiperWidth = getSwiperWidth(swiper);
			var slideNumber = slides.length; // 对应当前 slide 的索引
			var curSlide = 0;
			var lock = false;  // 防止 transitionend 事件执行多次加的锁

			var isTouching = false;

			var config = {
				duration: 300,
				interval: 500,
				max: 100,
				
			}
			var userDuration = 300;

			var pos = {
				init: 0,
				start: 0,
				end: 0,
				move: 0,
				distance: 0
			}

			var direction = '';
			// var dirtyTimer = null;
			var slideTimer = null;
			var userTimer = null;




			// 属性操作函数
			function left (el, v) {
				el.style.left = v + 'px';
			}

			function translateX (el, v) {
				el.style.transform = 'translateX(' + v + 'px)';
			}

			function transitionDuration (el, v) {
				el.style.transitionDuration = v + 'ms';
			}


			// 根据 slideNumber 实现的进制运算.
			// 规则: if curSlide + 1 = slideNumber return 0
			// if curSlide - 1 = -1, return slideNumber - 1

			function next (v) {
				// var t;
				return (v + 1 == slideNumber) ? 0 : (v + 1);
			}

			function prev (v) {
				return (v - 1 == -1) ? (slideNumber - 1) : (v - 1);
			}



			// 1 对所有的 slide 设置 left 属性
			function initLeft () {
				// 1 设置 left 属性
				// 公式: - index(slide) * swiperWidth
				// 2 设置 translateX 属性
				slides.forEach(function(slide, index) {
					left (slide, -(index * swiperWidth));
					// translateX (slide, - swiperWidth);
				});
			}

			// 和上面的分开写
			function initLayout () {
				slides.forEach(function(slide, index) {
					translateX (slide, - swiperWidth);
					transitionDuration(slide, 0);
				});
			}

			function initTransition () {
				slides.forEach(function(slide, index) {
					// translateX (slide, - swiperWidth);
					transitionDuration(slide, 0);
				});				
			}

			

			// 对 slide 进行布局
			// 需要的参数有 curSlide

			function layout () {
				// 规则很明确
				// 0 让所有的 slide 先 translate 到一起去.
				// 1 curSlide 对应的 slide translate = 0
				// 2 curSlide 的下一个 slide translate = swiperWidth
				
				translateX(slides[curSlide], 0);
				translateX(slides[next(curSlide)], swiperWidth);
			}


			function transition () {
				// 为 layout 加上transition 效果
				// 规则
				// 1 当前的 仅仅当前的 slide 以及上一个 slide 拥有 transition 效果

				// 为什么是上一个, 因为重新布局的时候, 会先修改 curSlide
				transitionDuration(slides[curSlide], config.duration);
				transitionDuration(slides[prev(curSlide)], config.duration);


			}


			// 重新布局
			function relayout () {
				curSlide = next(curSlide);
				// 必须要先初始化. 
				initLayout();
				initTransition();
				layout();
				transition(); // 加上动画效果
			}

			// 在 swiper 上面绑定事件, 而不是在 slide 上面绑定 transitionend
			// 因为这样方便, 又不会重复绑定事件
			// 但是会触发多次, 没事, 我加个锁

			function bindTransitionEndToSwiper () {
				swiper.addEventListener('transitionend', function(e) {
					// console.log('触发')
					if (lock) {
						return;
					}
					lock = true;

					// console.log('transition 执行完毕, 当前显示的为: slide', curSlide);
					// 执行操作
					clearTimeout(slideTimer);
					slideTimer = setTimeout(function(){
						lock = false;  // 解锁
						if (!isTouching) {
							relayout();
						}
					}, config.interval);


				}, false);
			}





			initLeft();
			initLayout();
			layout();
			bindTransitionEndToSwiper();
			bindTouchToSlides();

			setTimeout(function(){
				// co
				if (!isTouching) {
					relayout();
				}
			}, config.interval);


			// 为 slide 绑定事件, 以支持用户手动滑动.

			/*
			用户滑动行为的考虑
			1. 用户滑动和我们的自动滑动是矛盾的, 我们做到: 
			用户点击的时候, 停止滑动, 假设用户一直按着不放, 就一直不滑动
			用户松开的时候, 重新计时, 重新开始滑动

			那么如何实现停止滑动和触发滑动?
			清除定时器, 还是设置一个变量? 先设置成变量模式吧. 

			2. 同时要做到, 用户左边滑动, 右边滑动, 我们能够让 slide 保持跟着滑动的效果. 

			要做到, 记录用户点击的位置, 当前 slide 的 translate 值, 以及用户移动的位置, 
			从这三者得到最终的 slide 应该 从什么地方开始移动多少距离的问题.

			3. 然后在用户松开之后, 我们要拿到最终移动的距离, 并且和设定的阀值做对比:
			  是否已经达到了需要响应用户行为的情况.

			我们现在使用的是定时器的方式, 然后又加上了一个变量来判断, 我觉得这种方式不好, 
			是否可以有优化空间呢?




			*/	

			function bindTouchToSlides () {
				slides.forEach(function(el) {
					el.addEventListener('touchstart', s, false);
					el.addEventListener('touchmove', m, false);
					el.addEventListener('touchend', e, false);
				});
			}

/*
用户滑动的时机有两种
1. 自动滑动还没有开始的时候
2. 自动滑动已经开始了

当1 的时候, 我们需要让元素直接干掉, 

我希望能集中起来, 不要凌乱的放在各个地方, 有一个地方集中触发, 它可以接受指令
实现暂停, 重置 等功能. 






*/

			function s (e) {
				// 禁止自动滑动
				isTouching = true;
				console.log('user touching, ban auto');

				// 初始化一些值
				pos.init = slides[curSlide].getBoundingClientRect().left;
				pos.start = e.targetTouches[0].pageX;

			}

			function m (e) {

				// 同样初始化一些值
				pos.move = e.targetTouches[0].pageX;
				pos.distance = pos.start - pos.move;

				// 让 slide 跟随
				// 首先去掉 transition 效果
				initTransition();
				// 然后让当前的 slide 跟随
				translateX(slides[curSlide], pos.init - pos.distance);

				// 再根据 distance 的大小, 来确定是左边还是右边的 slide 跟随
				// 上面那句话是错的, 不应该这么做, 因为任意一边的 slide 都可能存在遇见
				// distance 大于, 小于 0 的情况, 你想啊, 用户左右滑动.

				translateX(slides[next(curSlide)], pos.init + swiperWidth - pos.distance);
				translateX(slides[prev(curSlide)], pos.init - swiperWidth - pos.distance);

			}

			function e (e) {
				// console.log('释放')
				isTouching = false;

				pos.end = e.changedTouches[0].pageX;

				pos.distance = pos.start - pos.end;

				if (pos.distance > 0) {
					direction = 'to-left';
				} else if (pos.distance == 0) {
					direction = 'to'
				}

				// 如果移动距离最终大于了 150px, 那么就要响应用户的行为, 向左或者右边滑动一个距离
				if (Math.abs(pos.distance) > config.max) {

					initLayout();
					initTransition();

					if (direction == 'to-left') {
						// 这里不能使用和默认 slide 相同的时间, 而是我们自己定义一个 transition 
						// duration, 不能用户自定义的, 要不然效果会很尴尬

						curSlide = next(curSlide);
						// 必须要先初始化. 


						translateX(slides[curSlide], 0);
						translateX(slides[prev(curSlide)], -swiperWidth);
						translateX(slides[next(curSlide)], swiperWidth);

						transitionDuration(slides[curSlide], userDuration);
						transitionDuration(slides[prev(curSlide)], userDuration)


					} else {
						curSlide = prev(curSlide);


						translateX(slides[curSlide], 0);
						// translateX(slides[prev(curSlide)], -swiperWidth);
						translateX(slides[next(curSlide)], swiperWidth);

						transitionDuration(slides[curSlide], userDuration);
						transitionDuration(slides[next(curSlide)], userDuration)

					}


				} else {
					// 如果移动距离比较小, 要恢复原状. 
					console.log('恢复原状', pos.distance)
					translateX(slides[curSlide], 0);
					transitionDuration(slides[curSlide], userDuration)

					if (direction == 'to-left') {
						translateX(slides[next(curSlide)], swiperWidth);
						transitionDuration(slides[next(curSlide)], userDuration)
					} else if (direction == 'to'){
						// console.log(123)
						// 此时移动距离为0, 也没有触发 transition效果, 所以我们
						// 单独拎出来, 然后手动触发
						clearTimeout(userTimer);
						userTimer = setTimeout(function(){
							// co
							if (!isTouching) {
								relayout();
							}
						}, config.interval);




					} else {
						console.log('right')
						translateX(slides[prev(curSlide)], -swiperWidth);
						transitionDuration(slides[prev(curSlide)], userDuration);
					}
				}

				// clearTimeout(dirtyTimer);
				// dirtyTimer = setTimeout(function() {
				// 	isTouching = false;
				// }, userDuration);

			}


			// 阻止默认事件, fix bug: 滑动的时候, 整个页面也会跟着动. 
			swiper.addEventListener('touchstart', function(e) {
				e.preventDefault();
			}, false);







		}// end mounted

	} // end export

</script>