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
        <div class="wc-swiper-box" @transitionend="transitionend">
			<slot/>
        </div>
        <!-- <wc-pagination :slides="slides" :cur="currentSlide" v-if="pagination"/> -->
    </div>
</template>
<script>
	function toArray(arraylike) {
	    return Array.prototype.slice.call(arraylike);
	}

	export default {
		name: 'wcSwiper',
		data () {
			return {
				swiper: null,
				swiperContainer: null,
				swiperWidth: 0,
				slides: null,
				slidesNumber: 0,
				reallySlidesNumber: 0,
				/*取值范围:[0, reallySlidesNumber - 1]*/
				currentSlide: 0,
				/*和播放相关的一些属性*/	
				timer: null,
				interval: 1000,
				duration: 400
				
			}
		},
		mounted () {
			/*初始化的时候, 拿到所有的 DOM 元素以及相关属性*/
			this.initElement();

			/*克隆两个节点, 用来实现 loop 效果*/
			this.cloneSlide();

			/*克隆结束之后, 需要设置默认显示的slide*/
			this.setDefaultSlide();

			/*设置默认slide之后, 就需要开始设置定时器, 自动轮播*/
			this.play();

			/*
				除去第一次, 是我们主动轮播, 其他都是 transitionend 触发, 在 swiper 上面绑定 
				transitionend
			*/
		},
		methods: {
			initElement () {
				this.swiperContainer = document.querySelector('.wc-swiper-container');
				this.swiper = document.querySelector('.wc-swiper-box');
				this.swiperWidth = this.swiper.clientWidth;
				this.slides = toArray(this.swiper.children);
				this.slidesNumber = this.slides.length;
			},
			cloneSlide () {
				let head = this.slides[0].cloneNode(this.slides[0], true);
				let tail = this.slides[this.slidesNumber - 1].cloneNode(this.slides[this.slidesNumber-1], true);

				this.swiper.appendChild(head);
				this.swiper.insertBefore(tail, this.slides[0]);
				
				/*克隆节点之后, 需要 reset 一些属性*/
				this.slides = toArray(this.swiper.children);
				this.slidesNumber = this.slides.length;
				/*真正的 slides 数量*/
				this.reallySlidesNumber = this.slidesNumber - 2;

			},
			setDefaultSlide () {
				/*
					如果设置的 currentSlide 值, 大于整个真正的 slides 的值, 那么默认显示第一个
					如果设置的值小于 0, 也默认显示第一个
					如果是一个介于 [0, reallySlidesNumber] 的值, 则是谁就是谁

					控制默认显示第几个, 实际上是通过设置 swiper 的 translateX 值实现的. 

				*/

				if (this.currentSlide < 0) {
					this.currentSlide = 0
				} else if (this.currentSlide > this.reallySlidesNumber) {
					this.currentSlide = 0;
				}

				/* +1 是为了屏蔽掉我们主动追加的两个 slide 的影响 */
				this.currentSlide = this.currentSlide + 1; 

				this.translateX(-this.swiperWidth*this.currentSlide);

			},
			play () {
				
				this.timer = setTimeout(()=>{
					this.currentSlide++;
					this.transitionDuration(this.duration);
					this.translateX(-this.swiperWidth*this.currentSlide);

					/*及时清除定时器*/
					clearTimeout(this.timer);
				}, this.interval);
			},
			transitionend () {

				/*
					此时就存在了一个判断的问题, 当滚动到最后一个 slide 的时候. 
					不能继续往下滑动了, 要不然就超过了. 
					滚动到最后一个的时候, currentSlide = slidesNumber - 1

					最后一个的时候, 需要瞬间替换掉.
				*/

				if (this.currentSlide === this.slidesNumber - 1) {
					this.transitionDuration(0);
					this.currentSlide = 1;
					this.translateX(-this.swiperWidth*this.currentSlide);
					
				}


				this.timer = setTimeout(()=>{
					this.currentSlide++;
					this.transitionDuration(this.duration);
					this.translateX(-this.swiperWidth*this.currentSlide);

					/*及时清除定时器*/
					clearTimeout(this.timer);
				}, this.interval);


			},
			translateX (value) {
				this.swiper.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms) {
				this.swiper.style.transitionDuration = ms + 'ms';
			}
		}
	}
</script>