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
				// 用户触发的滑动, 松开之后以什么 transtion-duration 进行改变. 
				var userDuration = 260;

				// 用户需要滑动多少距离, 我们才认定需要换新的 slide
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

				// transitionend 的 handler
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
				// 绑定 transitionend 事件.
				swiper.addEventListener('transitionend', handler, false);

				swiper.addEventListener('touchstart', s, false);
				swiper.addEventListener('touchmove', m, false);
				swiper.addEventListener('touchend', e, false);

				// 为 container 绑定 touchstart 事件
				// 主要是为了防止在滑动的时候, 页面跟着滑动
				swiperContainer.addEventListener('touchstart', function(e) {
				    e.preventDefault();
				    e.stopPropagation();
				}, false);

				// 追加头尾元素
				append();

				// 重置 slides, slidesNumber -> 因为新增了 头尾
				slides = toArray(swiper.children);
				slidesNumber = slides.length;

				// 初始化, currentSlide = 1, 因为要忽略掉我们追加的 head
				currentSlide = 1;
				// 定位, 注意此时 transition-duration:0, 所以是瞬间定位过去, 没有 transition 效果
				translateX(getLocation());

				// 启动定时器, 在指定时间之后, 滑动一下
				timer = setTimeout(function() {
				    currentSlide++;

				    // 清除定时器
				    clearTimeout(timer);

				    // 设置 transition-duration
				    transitionDuration(config.duration);
				    // 定位
				    translateX(getLocation());
				}, config.interval);

			} // end init
		} // end methods


	}
</script>