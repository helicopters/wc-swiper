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
  transform: translate3d(0px, 0, 0);
}

</style>
<template>
    <div class="wc-swiper-container">
        <div class="wc-swiper-box">
			<slot/>
        </div>
        <wc-pagination :slides="slides" :cur="currentSlide" v-if="pagination"/>
    </div>
</template>
<script>
/*
首先是自动轮播效果
*/



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
			},
			pagination: {
				default: true
			},
			autoplay: {
				default: true
			},
			curSlide: {
				default: 0
			}
		},
		data () {
			return {
				activeID: '',
				currentSlide: 0,
				slides: 0,
				swiperContainer: null,
				swiper: null
			}
		},
		mounted () {

			/*获取 swiperContainer, slide*/


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
				var threshold = 65;

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

				function transitionendHandler() {

					console.log(currentSlide,'end', slidesNumber)



				    // if (that.autoplay) {
				    // 在这里检测, 如果当前已经滑动到最后一个 slide, 那么就要切换位置了. 
			        if (currentSlide == slidesNumber - 1) {
			            currentSlide = 0;
			            transitionDuration(0);
			            currentSlide++;
			            translateX(getLocation());
			        }







				        // 这段只是为了向 pagination 暴露出 currentSlide, 和实际的跳转行为没有关系. 
				        that.currentSlide = currentSlide - 1;
				        // 这句呢, 是一个 hook 函数
				        that.$emit('transitionend', that.currentSlide);

				        timer = setTimeout(function() {
				            clearTimeout(timer);
				            transitionDuration(config.duration);
				            currentSlide++;
				            translateX(getLocation());
				        }, config.interval);
				    // }
				}
				/*touchstart*/
				function s(e) {
				    
				    var cur = e.touches.length - 1;
				    
				    that.activeID = toArray(e.changedTouches)[0].identifier;

				    if (that.activeID === 0) {
				    	that.activeID = 'desktop';
				    }

				    clearTimeout(timer);
				    /*为了防止用户滑动松开触发 transitionend */
				    // swiper.removeEventListener('transitionend', transitionendHandler, false);
				    transitionDuration(0);
				    pos.initX = swiper.getBoundingClientRect().left;
				    pos.clickX = toArray(e.touches)[cur].pageX;
				    translateX(pos.initX);
				}
				/*touchmove*/
				function m(e) {

				    var cur = e.touches.length - 1;

				    if (that.activeID) {
				        pos.moveX = toArray(e.touches)[cur].pageX;
				        translateX(Math.round(pos.initX - (pos.clickX - pos.moveX)));
				    }
				}
				/*touchend*/
				function e(e) {
				    var distance;
				    transitionDuration(0);
				    
				    var cur = e.touches.length - 1;
				    var curId = toArray(e.changedTouches)[0].identifier;

				    if (curId == that.activeID || that.activeID == 'desktop') {
				        that.activeID = undefined;
				        pos.endX = toArray(e.changedTouches)[0].pageX;
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
				        // hook
				        that.$emit('transitionend', that.currentSlide);
				        /*重新启动定时器*/
				        if (that.autoplay) {
				            timer = setTimeout(function() {
				                // swiper.addEventListener('transitionend', transitionendHandler, false);
				                clearTimeout(timer);
				                transitionDuration(config.duration);
				                currentSlide++;
				                translateX(getLocation());
				            }, config.interval);
				        }
				    }
				}
				/*用户滑动到边界的时候的判断*/
				function boundary() {
				    // var start = swiper.getBoundingClientRect().left;
				    // var distance = 0;

				    // function delay() {
				    //     setTimeout(function() {
				    //         transitionDuration(userDuration);
				    //         translateX(getLocation());
				    //     }, 1);
				    // }
				    // if (currentSlide == 0) {
				    //     /*如果滑动到第一个*/
				    //     distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
				    //     var n = Math.floor(Math.abs(start) / swiperWidth);
				    //     if (n === currentSlide) {
				    //         currentSlide = slidesNumber - 2;
				    //         transitionDuration(0);
				    //         translateX(-distance);
				    //         delay();
				    //     } else {
				    //         currentSlide = n;
				    //         translateX(getLocation())
				    //     }
				    // } else if (currentSlide == slidesNumber - 1) {
				    //     /*如果是最后一个*/
				    //     distance = start + (swiperWidth * (slidesNumber - 2))
				    //     var n = Math.ceil(Math.abs(start) / swiperWidth);
				    //     if (n === currentSlide) {
				    //         currentSlide = 1;
				    //         transitionDuration(0);
				    //         translateX(distance);
				    //         delay();
				    //     } else {
				    //         currentSlide = n;
				    //         translateX(getLocation())
				    //     }
				    // } else {
				    	// console.log(currentSlide);
				        translateX(getLocation());
				    // }
				}
				swiper.addEventListener('transitionend', transitionendHandler, false);
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
				currentSlide = this.curSlide + 1;
				this.currentSlide = currentSlide - 1;
				translateX(getLocation());
				// if (this.autoplay) {
				    timer = setTimeout(function() {
				        currentSlide++;
				        clearTimeout(timer);
				        transitionDuration(config.duration);
				        translateX(getLocation());
				    }, config.interval);
				// }
			} /*end init*/
		} /*end methods*/
	} /*end export*/
</script>