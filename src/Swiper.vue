<style>
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

			var config = {
				duration: 500,
				interval: 1500
			}

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
					translateX (slide, - swiperWidth);
				});
			}

			// 和上面的分开写
			function initLayout () {
				slides.forEach(function(slide, index) {
					translateX (slide, - swiperWidth);
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
				layout();
				transition(); // 加上动画效果
			}

			// 在 swiper 上面绑定事件, 而不是在 slide 上面绑定 transitionend
			// 因为这样方便, 又不会重复绑定事件
			// 但是会触发多次, 没事, 我加个锁

			function bindTransitionEndToSwiper () {
				swiper.addEventListener('transitionend', function(e) {
					
					if (lock) {
						return;
					}
					lock = true;

					console.log('transition 执行完毕, 当前显示的为: slide', curSlide);
					// 执行操作
					setTimeout(function(){
						relayout();
						lock = false;
					}, config.interval);


				}, false);
			}





			initLeft();
			initLayout();
			layout();
			bindTransitionEndToSwiper();

			setTimeout(function(){
				relayout();
			}, config.interval);

			// setInterval(function(){
			// 	relayout();
			// }, config.interval)













		}// end mounted

	} // end export

</script>