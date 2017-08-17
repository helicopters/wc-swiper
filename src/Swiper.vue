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
			<div class=" slide slide-c">3</div>
			<div class=" slide slide-a">1</div>
			<div class=" slide slide-b">2</div>
			<div class=" slide slide-c">3</div>
			<div class=" slide slide-a">1</div>

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
			// function getSlides (swiper) {
			// 	return toArray(swiper.children);
			// }

			// 获取单个slide的宽度
			function getSwiperWidth (swiper) {
				return document.body.clientWidth;
			}

			// 定义变量
			var swiper = getSwiper('.swiper-box');
			// var slides = getSlides(swiper);
			var swiperWidth = getSwiperWidth(swiper);
			// var slideNumber = slides.length; // 对应当前 slide 的索引

			var times = 0;






			// var curSlide = 0;
			// var lock = false;  // 防止 transitionend 事件执行多次加的锁

			// var isTouching = false;

			// var config = {
			// 	duration: 1000,
			// 	interval: 1000,
			// 	max: 100,
				
			// }
			// // 响应用户行为的时候的 transition duration
			// var userDuration = 300;

			// var pos = {
			// 	init: 0,
			// 	start: 0,
			// 	end: 0,
			// 	move: 0,
			// 	distance: 0
			// }

			// var direction = '';
			// // var dirtyTimer = null;
			// var slideTimer = null;
			// // var userTimer = null;
			// var initTimer = null;
			// // var timer = null;

			// var status = 'start';




			// 属性操作函数
			// function left (el, v) {
			// 	el.style.left = v + 'px';
			// }

			// 用 translate3d 来启动硬件加速?
			function translateX (el, v) {
				// el.style.transform = 'translate3d(' + v + 'px, 0px, 0px)';
				el.style.transform = 'translateX(' + v + 'px)';
			}

			function transitionDuration (el, v) {
				el.style.transitionDuration = v + 'ms';
			}


			setInterval(function(){
				times++;
				translateX(swiper, -swiperWidth*times);
				transitionDuration(swiper, 500);
				if (times == 4) {
					times = 0;
					transitionDuration(swiper, 0);
				}

			},1000)








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










		}// end mounted

	} // end export

</script>