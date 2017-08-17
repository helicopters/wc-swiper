<style>

	.swiper-container{
		/*position: relative;*/
		width: 100%;
		height: 100%;
		overflow: hidden;
		/*visibility: visible;*/
	}


	.swiper-box {
		/*height: 300px;*/
		height: 100%;
		/*width: 1125px;*/
		width: 100%;
		display: flex;
		/*width: 100%;*/
		
		/*font-size: 0;*/
		/*overflow: hidden;*/
	}
	.slide {
		/*transition-property: transform;*/
		position: relative;
		/*visibility: visible;*/
		/*top:0;*/
		/*left:0;*/
		/*width: 100%;*/
		font-size: 50px;
		text-align: center;
		/*-webkit-overflow-scrolling: touch;*/
		/*user-select:none;*/

		/*transform-origin: 0px 0px 0px;*/
/*    	opacity: 1;
    	transform: scale(1, 1);
*/
		height: 100%;
		/*display: inline-block;*/
		width: 100%;
		flex-shrink: 0;


/*	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-ms-backface-visibility: hidden;
	backface-visibility: hidden;
	-webkit-perspective: 1000;
	-moz-perspective: 1000;
	-ms-perspective: 1000;
	perspective: 1000;
*/


		
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
		/*transition-duration: 500ms;*/
		/*transform: translateX(100%);*/
		/*-webkit-transition-duration: 500ms;*/
	}
	.slide-c {
		background: blue;
		/*transform: translateX(200%);*/

	}



</style>
<template>


	<div class="swiper-container">
		

		<div class="swiper-box">
			<!-- <div class=" slide slide-c">3</div> -->
			<div class=" slide slide-a">1</div>
			<div class=" slide slide-b">2</div>
			<div class=" slide slide-c">3</div>
			<!-- <div class=" slide slide-a">1</div> -->

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

			// // 获取 slides, 返回一个 array
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
			var slidesNumber = slides.length;
			// var slideNumber = slides.length; // 对应当前 slide 的索引

			var times = 1;

			var config = {
				interval: 500,
				duration: 1000
			}	

			var sliding = false;

			// 用 translate3d 来启动硬件加速?
			function translateX (el, v) {
				// el.style.transform = 'translate3d(' + v + 'px, 0px, 0px)';
				el.style.transform = 'translateX(' + v + 'px)';
			}

			function transitionDuration (el, v) {
				el.style.transitionDuration = v + 'ms';
			}

			function next (v) {
				// var t;
				return (v + 1 == slideNumber) ? 0 : (v + 1);
			}

			function prev (v) {
				return (v - 1 == -1) ? (slideNumber - 1) : (v - 1);
			}



			// 1 先在头尾追加两个元素, 头追加尾, 尾追加头.

			// 1 先获取头尾
			var head = slides[0].cloneNode(true);
			var tail = slides[slides.length - 1].cloneNode(true);

			// 2 追加 头

			swiper.insertBefore(tail, slides[0]);
			// swiper.insertAfter(head, tail);
			swiper.appendChild(head);


			// 再初始化 swiper 的定位

			translateX(swiper, -swiperWidth);
			times++

			// 然后在指定时间之后开始动起来

			// setTimeout(function(){
			// 	translateX(swiper, -swiperWidth * times);
			// 	times++;
			// 	transitionDuration(swiper, config.duration)
			// }, config.interval);

			// 然后绑定事件

			swiper.addEventListener('transitionend', function() {
				sliding = false;
				// 重新开始计时
/*
这里做判断, 如果已经滑动到最后一个元素, 会显示成第一个, 我们之所以加这个是因为我们希望
在第一个和最后一个左右滑动的时候不会出现空白, 而不是因为 无缝滚动的需求. 

slidesNumber 要默认加个 2, 因为追加的两个元素,
times 的起点为 1, 最高只能达到 slidesNumber + 2 -1, 也就是  

*/
				if (slidesNumber + 2 == times) {

					// 先取消动画, 再让元素的值恢复
					transitionDuration(swiper, 0);
					times = 1;
					translateX(swiper, -swiperWidth * times);
					times++;
					setTimeout(function(){
						sliding = true;
						translateX(swiper, -swiperWidth * times);
						times++;	
						transitionDuration(swiper, config.duration)					
					},config.interval)

				} else {


					setTimeout(function(){
						sliding = true;
						translateX(swiper, -swiperWidth * times);
						times++;
						transitionDuration(swiper, config.duration)
					}, config.interval);

				}


			}, false);

/*
 到这里基本上无关用户行为的都ok, 现在加上用户行为. 

1. 滚动的时候不响应用户的滑动行为, ok

滑动行为单独拎出来, 不需要和这个玩意耦合在一起. 先使用这样的方式

*/

		function slide (el, handler) {

			var pos = {
				init: 0, 
				start: 0,
				move: 0,
				end: 0,
				now: 0
			}


			// 自定义 slide 事件
		    var sliding = document.createEvent('event');
		    var slideLeft = document.createEvent('event');
		    var slideRight = document.createEvent('event');

		    sliding.initEvent('sliding', true, true);
		    slideLeft.initEvent('slideLeft', true, true);
		    slideRight.initEvent('slideRight', true, true);

		    // ele.dispatchEvent(ev);


			// 开始触碰的时间戳
			// var startTime = 0;
			// var moveTime = 0;

			function s (e) {
				// 记录元素刚开始的位置, 以及点击开始的位置
				pos.init = el.getBoundingClientRect().left;
				pos.start = e.targetTouches[0].pageX;
				
			}
			function m (e) {
				console.log(e);
				pos.move = e.targetTouches[0].pageX;
				pos.now = pos.init - (pos.start - pos.move);
				console.log(pos.init, pos.now)

				el.slide = pos.now;

				el.dispatchEvent(sliding);

			}
			function e (e) {
				// 直接取消滑动事件
				// el.removeEventListener('touchstart', s, false);
				// el.removeEventListener('touchmove', m, false);
				// el.removeEventListener('touchend', e, false)



				pos.end = e.changedTouches[0].pageX;


				el.distance = Math.abs(pos.start - pos.end);
				// pos.distance = pos.start - pos.end;
				if (pos.start - pos.end > 0) {

					// el.distance = 

					el.dispatchEvent(slideLeft);


				} else if (pos.start - pos.end < 0){
					el.dispatchEvent(slideRight)
				}




			}




			el.addEventListener('touchstart', s, false);
			el.addEventListener('touchmove', m, false);
			el.addEventListener('touchend', e, false);
		}




		slide (swiper)
		swiper.addEventListener('sliding', function(e){
			console.log(e.target.slide);

			translateX(swiper, e.target.slide);


		}, false)


		swiper.addEventListener('slideRight', function(e){
			// console.log('right')

			// translateX(swiper, )
			console.log(e.target.distance);
			var distance = e.target.distance;

			// 向右边滑动一个位置
			if (distance > 120) {
				times = times - 2;
				translateX (swiper, times * (-swiperWidth) )
				transitionDuration(swiper, 400)
			}




		}, false)


		swiper.addEventListener('slideLeft', function(e){
			console.log('left')

			console.log(e.target.distance);
			var distance = e.target.distance;

			if (distance > 120) {
				times ++ ;

				translateX (swiper, times * (-swiperWidth) )
				transitionDuration(swiper, 400)



				
			}








		}, false)




		console.log(swiper.getBoundingClientRect())















		}// end mounted

	} // end export

</script>