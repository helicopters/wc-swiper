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
				default: 500 // 默认一次滑动的事件. 
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
				// 获取 swiper 容器, 主要是为了在它上面绑定事件. 
				var swiperContainer = document.querySelector('.wc-swiper-container');

				var swiper = document.querySelector('.wc-swiper-box');
				var swiperWidth = swiper.clientWidth;

				var slides = toArray(swiper.children);
				var slidesNumber = slides.length;

				var currentSlide = 0;

				// 为了渲染 pagination 而存在的一句话
				this.slides = slidesNumber;

				// 用户配置选项. 
				var config = {
				    interval: this.interval,
				    duration: this.duration
				}
				var timer = null;
				var pos = {};


				var moving = false;
				// 用户触发的滑动, 松开之后以什么 transtion-duration 进行改变. 
				var userDuration = 360;

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
					if (slides.length) {
					    var head = slides[0].cloneNode(slides[0], true);
					    var tail = slides[slidesNumber - 1].cloneNode(slides[slidesNumber - 1], true);

					    swiper.appendChild(head);
					    swiper.insertBefore(tail, slides[0]);						
					}
				}

				// transitionend 的 handler
				function handler() {
					// 如果当前滑动到最后一个
				    if (currentSlide == slidesNumber - 1) {
				        currentSlide = 0;
				        transitionDuration(0);
				        currentSlide++;
				        translateX(getLocation());
				    }

					// for pagination
					that.currentSlide = currentSlide - 1;

				    // 继续重新定时
				    timer = setTimeout(function() {
				        clearTimeout(timer);
				        transitionDuration(config.duration);
				        currentSlide++;
				        translateX(getLocation());
				    }, config.interval);
				}

				// touchstart handler
				function s(e) {
				    if (!moving) {
				        moving = true;
				        // 先清除定时器
				        clearTimeout(timer);
				        // 再解绑 transitionend 事件
				        swiper.removeEventListener('transitionend', handler, false);
				        // 然后设置 transition-duration = 0
				        transitionDuration(0);
				        // 最后重新定位一下.
				        pos.clickX = e.changedTouches[0].pageX;
				        pos.initX = swiper.getBoundingClientRect().left;
				        translateX(pos.initX);
				    }
				}

				// touchmove handler
				function m(e) {
				    if (moving) {
				    	// 让 swiper 跟随手指移动
				        pos.moveX = e.changedTouches[0].pageX;
				        translateX(pos.initX - (pos.clickX - pos.moveX));
				    }
				}

				// touchend handler
				function e(e) {
				    var distance;
				    if (moving) {
				        moving = false;

				        // 计算出用户最终移动的位移
				        pos.endX = e.changedTouches[0].pageX;
				        distance = pos.clickX - pos.endX;
				        // 反正先设置好 transition-duration.
				        transitionDuration(userDuration);
				        if (distance == 0) {
				        	// 如果 distance=0, 说明用户仅仅是连续点击了两次, 我们不做任何
				        	// 处理, 恢复原状即可.
				            translateX(getLocation());
				        } else {
				        	// 如果位移小于我们设定的值, 可以直接让它恢复原状即可
				            if (Math.abs(distance) < threshold) {
				                translateX(getLocation());
				            } else {
				            	// 如果位移大于我们设定的值, 我们就要看下了
				                if (distance > 0) {
				                    currentSlide++;
				                } else {
				                    currentSlide--;
				                }
				                // boundary 是精华部分. 
				                boundary();
				            }
				        }
				        // for pagination
				        that.currentSlide = currentSlide - 1;
				        // 用户行为之后, 我们是要重新开启定时器的.
				        timer = setTimeout(function() {
				        	// 重新绑定 transitionend 事件.
				            swiper.addEventListener('transitionend', handler, false);
				            clearTimeout(timer);
				            transitionDuration(config.duration);
				            currentSlide++;
				            translateX(getLocation());
				        }, config.interval);
				    }
				}

				// 对于边界情况的判断. 
				function boundary() {
				    var start = swiper.getBoundingClientRect().left;
				    var distance = 0;

				    // 如果当前是第 0 个
				    if (currentSlide == 0) {
				        distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
				        
				        currentSlide = slidesNumber - 2;

				        transitionDuration(0);
				        translateX(-distance);

				        // ...
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

				// 为 swiper-container 绑定 touchmove 事件
				// 注意这里不要绑定在 touchstart 上面, 因为这样会直接阻止掉 click 事件的触发
				// 也就是说页面上的 a 标签不会跳转了以后. 
				swiperContainer.addEventListener('touchmove', function(e) {
				    e.preventDefault();  // 防止在滑动的时候, 页面跟着滑动
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

				// for pagination
				this.currentSlide = currentSlide - 1;

			}, // end init

		} // end methods


	}
</script>