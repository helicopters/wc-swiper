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
  /*防止滑动闪烁的*/
  -webkit-transform: translate3d(0px, 0, 0);
  -moz-transform: translate3d(0px, 0, 0);
  -o-transform: translate(0px, 0px);
  -ms-transform: translate3d(0px, 0, 0);
  transform: translate3d(0px, 0, 0);
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
	import T from './lib/touch'
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
				/*为了 pagination 显示设置的变量*/
				this.slides = slidesNumber;
				var currentSlide = 0;
				
				var config = {
				    interval: this.interval,
				    duration: this.duration
				}
				var timer = null;
				var pos = {};
				/*用户手动滑动时, 松手恢复原状的时间*/
				var userDuration = 270;
				/*用户移动多少距离才变换 slide*/
				var threshold = 100;
				var id;

				function toArray(arraylike) {
				    return Array.prototype.slice.call(arraylike);
				}


				function translateX(v) {
				    swiper.style.transform = 'translate3d(' + v + 'px, 0,0)';
				}

				function transitionDuration(v) {
				    swiper.style.transitionDuration = v + 'ms';
				}

				function getLocation() {
				    return -(swiperWidth * currentSlide);
				}

				/* 添加 head, tail slide */
				function append() {
				    var head = slides[0].cloneNode(slides[0], true);
				    var tail = slides[slidesNumber - 1].cloneNode(slides[slidesNumber - 1], true);
				    swiper.appendChild(head);
				    swiper.insertBefore(tail, slides[0]);
				}

				/* transitionend event handler */
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

				/*touchstart*/
				function s(e) {
				    var curId = T.id(T.changedTouches(e)[0]);
				    if (id) {
				        if (curId !== id) {
				            return;
				        }
				    } else {
				        id = curId;
				    }
				    clearTimeout(timer);
				    /*为了防止用户滑动松开触发 transitionend */
				    swiper.removeEventListener('transitionend', handler, false);
				    transitionDuration(0);
				    pos.initX = swiper.getBoundingClientRect().left;
				    pos.clickX = T.x(T.changedTouches(e, 0));
				    translateX(pos.initX);
				}

				/*touchmove*/
				function m(e) {
				    var curId = T.id(T.changedTouches(e)[0]);
				    if (id == curId) {
				        pos.moveX = T.x(T.changedTouches(e, 0))
				        translateX(pos.initX - (pos.clickX - pos.moveX));
				    }
				}

				/*touchend*/
				function e(e) {
				    var distance;
				    var curId = T.id(T.changedTouches(e, 0));
				    if (id == curId) {
				        id = undefined;
				        pos.endX = T.x(T.changedTouches(e, 0));
				        distance = pos.clickX - pos.endX;
				        transitionDuration(userDuration);
				        /*如果用户仅仅在同一个地方点击两次*/
				        if (distance == 0) {
				            translateX(getLocation());
				        } else {
				        	/*如果用户移动距离小于变更距离*/
				            if (Math.abs(distance) < threshold) {
				                translateX(getLocation());
				            } else {
				            	/*先判断方向*/
				                if (distance > 0) {
				                    currentSlide++;
				                } else {
				                    currentSlide--;
				                }
				                boundary();
				            }
				        }
				        that.currentSlide = currentSlide - 1;
				        /*重新启动定时器*/
				        timer = setTimeout(function() {
				            swiper.addEventListener('transitionend', handler, false);
				            clearTimeout(timer);
				            transitionDuration(config.duration);
				            currentSlide++;
				            translateX(getLocation());
				        }, config.interval);
				    }
				}

				/*用户滑动到边界的时候的判断*/
				function boundary() {
				    var start = swiper.getBoundingClientRect().left;
				    var distance = 0;

				    function delay() {
				        setTimeout(function() {
				            transitionDuration(userDuration);
				            translateX(getLocation());
				        }, 10);
				    }

				    if (currentSlide == 0) {
				    	/*如果滑动到第一个*/
				        distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
				        
				        var n = Math.floor(Math.abs(start) / swiperWidth);
				        if (n === currentSlide) {
				            currentSlide = slidesNumber - 2;
				            transitionDuration(0);
				            translateX(-distance);
				            delay();
				        } else {
				            currentSlide = n;
				            
				            translateX(getLocation())
				        }
				    } else if (currentSlide == slidesNumber - 1) {
				    	/*如果是最后一个*/
				        distance = start + (swiperWidth * (slidesNumber - 2))
				        
				        var n = Math.ceil(Math.abs(start) / swiperWidth);
				        if (n === currentSlide) {
				            currentSlide = 1;
				            transitionDuration(0);
				            translateX(distance);
				            delay();
				        } else {
				            currentSlide = n;
				            
				            translateX(getLocation())
				        }
				    } else {
				        translateX(getLocation());
				    }
				}
				swiper.addEventListener('transitionend', handler, false);
				swiper.addEventListener('touchstart', s, false);
				swiper.addEventListener('touchmove', m, false);
				swiper.addEventListener('touchend', e, false);
				/* 这个主要是为了防止滚动 swiper-container 的时候会让父元素跟着滚动.*/
				swiperContainer.addEventListener('touchmove', function(e) {
				    e.preventDefault();
				}, false);
				append();
				/* 因为重新追加了 slide, 所以要重置 slides 和 slidesNumber. */
				slides = toArray(swiper.children);
				slidesNumber = slides.length;
				currentSlide = 1;
				this.currentSlide = currentSlide - 1;
				translateX(getLocation());
				timer = setTimeout(function() {
				    currentSlide++;
				    clearTimeout(timer);
				    transitionDuration(config.duration);
				    translateX(getLocation());
				}, config.interval);
			} /*end init*/
		} /*end methods*/
	} /*end export*/
</script>