<style scoped lang="less">
.wc-swiper-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.wc-swiper-box {
	position: relative;
    height: 100%;
    width: 100%;
    display: flex;
}

</style>
<template>
    <div class="wc-swiper-container">
        <div class="wc-swiper-box">
			<slot/>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'wcSwiper',
		mounted () {
			this.init();
		},
		methods: {
			init () {
				// 获取 swiper 容器, 主要是为了在它上面绑定事件. 
				var swiperContainer = document.querySelector('.wc-swiper-container');
				var swiper = document.querySelector('.wc-swiper-box');
				var swiperWidth = swiper.clientWidth;
				var slides = toArray(swiper.children);
				var slidesNumber = slides.length;
				var currentSlide = 0;

				// 用户配置选项. 
				var config = {
				    interval: 2000,
				    duration: 500
				}
				var timer = null;
				var pos = {};


				var moving = false;
				var userDuration = 260;
				var threshold = 100;
				function toArray(arraylike) {
				    return Array.prototype.slice.call(arraylike);
				}
				function translateX(v) {
				    swiper.style.transform = 'translateX(' + v + 'px)';
				}
				function transitionDuration(v) {
				    swiper.style.transitionDuration = v + 'ms';
				}
				function getLocation() {
				    return -(swiperWidth * currentSlide);
				}

				function append () {
				    var head = slides[0].cloneNode(slides[0], true);
				    var tail = slides[slidesNumber - 1].cloneNode(slides[slidesNumber - 1], true);

				    swiper.appendChild(head);
				    swiper.insertBefore(tail, slides[0]);

				}

				function handler() {
				    if (currentSlide == slidesNumber - 1) {
				        currentSlide = 0;
				        transitionDuration(0);
				        currentSlide++;
				        translateX(getLocation());
				    }
				    timer = setTimeout(function() {
				        clearTimeout(timer);
				        transitionDuration(config.duration);
				        currentSlide++;
				        translateX(getLocation());
				    }, config.interval);
				}
				function s(e) {
				    if (!moving) {
				        moving = true;
				        clearTimeout(timer);
				        swiper.removeEventListener('transitionend', handler, false);
				        transitionDuration(0);
				        pos.clickX = e.changedTouches[0].pageX;
				        pos.initX = swiper.getBoundingClientRect().left;
				        translateX(pos.initX);
				    }
				}
				function m(e) {
				    if (moving) {
				        pos.moveX = e.changedTouches[0].pageX;
				        translateX(pos.initX - (pos.clickX - pos.moveX));
				    }
				}
				function e(e) {
				    var distance = 0;
				    if (moving) {
				        moving = false;
				        pos.endX = e.changedTouches[0].pageX;
				        distance = pos.clickX - pos.endX;
				        transitionDuration(userDuration);
				        if (distance == 0) {
				            translateX(getLocation());
				        } else {
				            if (Math.abs(distance) < threshold) {
				                translateX(getLocation());
				            } else {
				                if (distance > 0) {
				                    currentSlide++;
				                } else {
				                    currentSlide--;
				                }
				                boundary();
				            }
				        }
				        timer = setTimeout(function() {
				            swiper.addEventListener('transitionend', handler, false);
				            clearTimeout(timer);
				            transitionDuration(config.duration);
				            currentSlide++;
				            translateX(getLocation());
				        }, config.interval);
				    }
				}
				function boundary() {
				    var start = swiper.getBoundingClientRect().left;
				    var distance = 0;
				    if (currentSlide == 0) {
				        distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
				        
				        currentSlide = slidesNumber - 2;

				        transitionDuration(0);
				        translateX(-distance);
				        setTimeout(function() {
				            transitionDuration(userDuration);
				            translateX(getLocation());
				        }, 20);
				    } else if (currentSlide == slidesNumber - 1) {
				        distance = start + (swiperWidth * (slidesNumber - 2))
				        
				        currentSlide = 1;

				        transitionDuration(0);
				        translateX(distance);
				        setTimeout(function() {
				            transitionDuration(userDuration);
				            translateX(getLocation());
				        }, 20);
				    } else {
				        translateX(getLocation());
				    }
				}
				swiper.addEventListener('transitionend', handler, false);
				swiper.addEventListener('touchstart', s, false);
				swiper.addEventListener('touchmove', m, false);
				swiper.addEventListener('touchend', e, false);
				swiperContainer.addEventListener('touchstart', function(e) {
				    e.preventDefault();
				    e.stopPropagation();
				}, false);

				append();
				slides = toArray(swiper.children);
				slidesNumber = slides.length;

				currentSlide = 1;
				translateX(getLocation());
				timer = setTimeout(function() {
				    currentSlide++;
				    clearTimeout(timer);
				    transitionDuration(config.duration);
				    translateX(getLocation());
				}, config.interval);

			} // end init
		} // end methods


	}
</script>