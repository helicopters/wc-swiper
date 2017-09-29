<style lang="less">
.wc-swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
.wc-swiper-box {
  height: 100%;
  width: 100%;
  display: flex;
  // transform: translate3d(0px, 0, 0);

}
</style>
<template>
    <div class="wc-swiper-container" @touchmove.prevent="fn">
        <div class="wc-swiper-box" @transitionend="transitionend" @touchstart="s" @touchmove="m" @touchend="e">
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
				currentSlide: 0,	
				timer: null,
				interval: 2000,
				duration: 300,
				userDuration: 200,
				pos: {
					startX: 0,
					moveX: 0,
					endX: 0, 
					local: 0,
					distance: 0,
					direction: ''
				},
				therehold: 110,
				moving: false,
				unlock: false,
				activeId: '',
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
		},
		methods: {
			/*阻止容器的上下滚动*/
			fn () {},
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
			},
			setDefaultSlide () {
				if (this.currentSlide < 0) {
					this.currentSlide = 0
				} else if (this.currentSlide > this.slidesNumber - 2) {
					this.currentSlide = 0;
				}
				/* +1 是为了屏蔽掉我们主动追加的两个 slide 的影响 */
				this.currentSlide = this.currentSlide + 1; 
				this.translateX(-this.swiperWidth*this.currentSlide);
			},
			play () {
				this.timer = setTimeout(()=>{
					clearTimeout(this.timer);
					this.moving = true;
					this.unlock = false;
					this.currentSlide++;
					this.transitionDuration(this.duration);
						this.translateX(-this.swiperWidth*this.currentSlide);
					/*及时清除定时器*/
				}, this.interval);
			},
			transitionend () {
				this.moving = false;
				let left = Math.abs(this.left());
				let y = left/this.swiperWidth;
				this.currentSlide = y;
				if (y === this.slidesNumber - 1) {
					this.transitionDuration(0);
					this.translateX(-this.swiperWidth*1);
					this.currentSlide = 1;
				}
				if (y === 0) {
					console.log('slide 怎么会是 0, 我要瞬间跳转过去')
					this.transitionDuration(0);
					this.translateX(-this.swiperWidth * (this.slidesNumber - 2))
					this.currentSlide = this.slidesNumber - 2;
					console.log('现在跳转完毕了, ', this.currentSlide)
					console.log(this.left())
				}
				this.play();
			},
			s (e) {
				this.activeId = toArray(e.changedTouches)[0].identifier;
				if (!this.moving) {
					let active = e.touches.length - 1;
					this.transitionDuration(0);
					clearTimeout(this.timer);
					this.unlock = true;
					this.pos.startX = e.touches[active].clientX;
					/* 一次 touch 的 起始local 点, 是固定的 */
					this.pos.local = this.left();
				}
			},
			m (e) {
				if (!this.moving && this.unlock) {
					let active = e.touches.length - 1;
					this.pos.moveX = e.touches[active].clientX;
					this.pos.distance = this.pos.moveX - this.pos.startX;
					this.translateX(this.pos.local + this.pos.distance);
				}
			},
			e (e) {
				let curId = toArray(e.changedTouches)[0].identifier;
				if (!this.moving && this.unlock && (curId == this.activeId)) {
					this.unlock = false;
					this.pos.endX = e.changedTouches[0].clientX;
					this.pos.distance = this.pos.endX - this.pos.startX;
					this.recover();
				}
			},
			recover () {
				this.transitionDuration(this.userDuration);
				let left = Math.abs(this.left());
				let distance = left % this.swiperWidth;
				let point = [];
				/*
					主要是为了拿到当前状态下面, swiper 距离正常状态的, 左右移动的距离分别是多少. 
				*/
				if (this.left() > 0) {
					point = [distance, this.swiperWidth - distance];
				} else {
					point = [this.swiperWidth - distance, distance];
				}
				let direction = ''
				if (this.pos.distance > 0) {
					direction = 'to-right';
				} else if (this.pos.distance < 0){
					direction = 'to-left';
				} else {
					direction = 'none';
				}
				if (direction == 'none') {
					this.play();
				}
				if (direction === 'to-right') {
					this.moving = true;
					/*说明需要向右边移动*/
					if (point[0] > this.therehold) {
						this.translateX(this.left() + point[1]);
						let next = (this.left() + point[1]) / this.swiperWidth;
						if (Math.abs(next) === 0) {
							this.unlock = false;
						}
					} else {
						this.translateX(this.left() - point[0]);
					}
				} 
				if (direction === 'to-left') {
					this.moving = true;
					if (point[1] > this.therehold) {
						this.translateX(this.left() - point[0]);
						let next = (this.left() - point[0]) / this.swiperWidth;
						if (Math.abs(next) === this.slidesNumber - 1) {
							this.unlock = false;
						}
					} else {
						this.translateX(this.left() + point[1]);
					}
				}
			},
			translateX (value) {
				this.swiper.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms) {
				this.swiper.style.transitionDuration = ms + 'ms';
			},
			left () {
				return this.swiper.getBoundingClientRect().left;
			}
		}
	}
</script>