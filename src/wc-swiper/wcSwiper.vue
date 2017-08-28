<style lang="less">
.wc-swiper-container {
	position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.wc-swiper-box {
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
        <wc-pagination :slides="slides" :cur="currentSlide"/>
    </div>
</template>
<script>
	import wcPagination from './wcPagination'
	export default {
		name: 'wcSwiper',
		components: {
			wcPagination
		},
		props: {
			duration: {
				default: 500 
			},
			interval: {
				default: 2500
			}
		},
		data () {
			return {
				slides: 0,
				currentSlide: 0
			}
		},
		mounted () {
			this.init();
		},
		methods: {
			init () {
				var that = this;
				var swiperContainer = document.querySelector('.wc-swiper-container');
				var swiper = document.querySelector('.wc-swiper-box');
				var swiperWidth = swiper.clientWidth;
				var slides = toArray(swiper.children);
				var slidesNumber = slides.length;
				var currentSlide = 0;
				this.slides = slidesNumber;
				var config = {
				    interval: this.interval,
				    duration: this.duration
				}
				var timer = null;
				var pos = {};
				var userDuration = this.duration / 2;
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
				function append() {
				    if (slides.length) {
				        var head = slides[0].cloneNode(slides[0], true);
				        var tail = slides[slidesNumber - 1].cloneNode(slides[slidesNumber - 1], true);
				        swiper.appendChild(head);
				        swiper.insertBefore(tail, slides[0]);
				    }
				}
				// transition end 
				function handler() {
				    if (currentSlide == slidesNumber - 1) {
				        currentSlide = 0;
				        transitionDuration(0);
				        currentSlide++;
				        translateX(getLocation());
				    }
				    that.currentSlide = currentSlide - 1;
				    timer = setTimeout(function() {
				        clearTimeout(timer);
				        transitionDuration(config.duration);
				        currentSlide++;
				        translateX(getLocation());
				    }, config.interval);
				}
				var id;
				function s(e) {
				    if (currentSlide == slidesNumber - 1) {
				        return;
				    }
				    let curId = e.changedTouches[0].identifier;
				    if (id) {
				        if (curId !== id) {
				            return;
				        }
				    } else {
				        id = e.changedTouches[0].identifier;
				    }
				    clearTimeout(timer);
				    swiper.removeEventListener('transitionend', handler, false);
				    transitionDuration(0);
				    pos.clickX = e.changedTouches[0].pageX;
				    pos.initX = swiper.getBoundingClientRect().left;
				    translateX(pos.initX);
				}
				function m(e) {
				    if (currentSlide == slidesNumber - 1) {
				        return;
				    }
				    let curId = e.changedTouches[0].identifier;
				    if (id == curId) {
				        pos.moveX = e.targetTouches[0].pageX;
				        translateX(pos.initX - (pos.clickX - pos.moveX));
				    }
				}
				function e(e) {
				    if (currentSlide == slidesNumber - 1) {
				        return;
				    }
				    let curId = e.changedTouches[0].identifier;
				    if (id == curId) {
				        id = undefined;
				        var distance;
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
				        that.currentSlide = currentSlide - 1;
				        timer = setTimeout(function() {
				            swiper.addEventListener('transitionend', handler, false);
				            clearTimeout(timer);
				            transitionDuration(config.duration);
				            currentSlide++;
				            translateX(getLocation());
				        }, config.interval);
				    }
				}

				// 边界条件的处理。
				function boundary() {
				    var start = swiper.getBoundingClientRect().left;
				    var distance = 0;
				    if (currentSlide == 0) {
				        distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
				        currentSlide = slidesNumber - 2;
				        transitionDuration(0);
				        translateX(-distance);
				    } else if (currentSlide == slidesNumber - 1) {
				        distance = start + (swiperWidth * (slidesNumber - 2))
				        currentSlide = 1;
				        transitionDuration(0);
				        translateX(distance);
				    }

				    setTimeout(function() {
				        transitionDuration(userDuration);
				        translateX(getLocation());
				    }, 1);
				}
				swiper.addEventListener('transitionend', handler, false);
				swiper.addEventListener('touchstart', s, false);
				swiper.addEventListener('touchmove', m, false);
				swiper.addEventListener('touchend', e, false);

				// 这个主要是为了防止滚动 swiper-container 的时候会让父元素跟着滚动.
				swiperContainer.addEventListener('touchmove', function(e) {
				    e.preventDefault();
				}, false);
				append();
				// 因为重新追加了 slide, 所以要重置 slides 和 slidesNumber.
				slides = toArray(swiper.children);
				slidesNumber = slides.length;
				currentSlide = 1;
				// 这个主要是为了 pagination的显示
				this.currentSlide = currentSlide - 1;

				translateX(getLocation());
				// 启动定时器
				timer = setTimeout(function() {
				    currentSlide++;
				    clearTimeout(timer);
				    transitionDuration(config.duration);
				    translateX(getLocation());
				}, config.interval);

				

			}, 

		} 


	}
</script>