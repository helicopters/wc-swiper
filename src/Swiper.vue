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
		height: 50%;
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


			var swiper = getSwiper('.swiper-box');
			var slides = getSlides(swiper);
			var swiperWidth = getSwiperWidth(swiper);
			var slidesNumber;
			var activeSlide = 0;
			var config = {
			    interval: 300,
			    duration: 1000
			}
			var sliding = false;
			var pos = {
			    init: 0,
			    start: 0,
			    move: 0,
			    end: 0,
			    now: 0
			}
			var timer = null;
			var userDuration = 250;
			var allowUser = true;

			function toArray(arraylike) {
			    return Array.prototype.slice.call(arraylike);
			}

			function getSwiper(selector) {
			    return document.querySelector(selector);
			}

			function getSlides(swiper) {
			    return toArray(swiper.children);
			}

			function getSwiperWidth(swiper) {
			    return document.body.clientWidth;
			}

			function translateX(el, v) {
			    el.style.transform = 'translateX(' + v + 'px)';
			}

			function transitionDuration(el, v) {
			    el.style.transitionDuration = v + 'ms';
			}

			function append() {
			    var head = slides[0].cloneNode(true);
			    var tail = slides[slides.length - 1].cloneNode(true);
			    swiper.insertBefore(tail, slides[0]);
			    swiper.appendChild(head);
			}

			function x() {
			    return -(swiperWidth * activeSlide);
			}
			append();
			slidesNumber = getSlides(swiper).length;
			activeSlide = 1;
			translateX(swiper, x());
			// allowUser = true;
			timer = setTimeout(function() {
			    clearTimeout(timer);
			    transitionDuration(swiper, config.duration);
			    activeSlide++;
			    // allowUser = true;
			    translateX(swiper, x());
			}, config.interval);










			function handler() {
			    if (activeSlide == slidesNumber - 1) {
			        activeSlide = 0;
			        transitionDuration(swiper, 0);
			        activeSlide++;
			        translateX(swiper, x());
			    }
			    timer = setTimeout(function() {
			        clearTimeout(timer);
			        transitionDuration(swiper, config.duration);
			        activeSlide++;
			        translateX(swiper, x());
			    }, config.interval);
			}
			swiper.addEventListener('transitionend', handler, false);









			document.querySelector('.swiper-container').addEventListener('touchstart', function(e) {
			    e.preventDefault();
			    e.stopPropagation();
			}, false)


		}// end mounted

	} // end export

</script>