<style lang="less">
.wc-swiper-container {
  position: relative;
  width: 100%;
  // height: 100%;
  overflow: hidden;
  z-index: 1;
}
.wc-swiper-box {
  height: 100%;
  width: 100%;
  display: flex;
  
}
</style>
<template>
    <div class="wc-swiper-container" @touchmove.prevent="fn">
        <div class="wc-swiper-box" @transitionend="transitionend" @touchstart="s" @touchmove="m" @touchend="e">
			<slot/>
        </div>
        <slot name="pagination"/>
        <slot name="arrowLeft"/>
        <slot name="arrowRight"/>
    </div>
</template>
<script>
	function toArray(arraylike) {
	    return Array.prototype.slice.call(arraylike);
	}
	export default {
		name: 'wcSwiper',
		props: {
			/*一次滑动的默认时间*/
			duration: {
				default: 500
			},
			/*两次滑动的间隔时间*/
			interval: {
				default: 2500
			},
			/*是否自动播放*/
			autoplay: {
				default: true
			},
			/*用户滑动多少距离, 翻页*/
			therehold: {
				default: 110
			},
			curSlide: {
				default: 0
			}
		},
		data () {
			return {
				swiper: null,
				swiperContainer: null,
				swiperWidth: 0,
				slides: null,
				slidesNumber: 0,
				/*currentSlide 的值也就真正在 play 函数里面使用到了*/
				currentSlide: 0,	
				timer: null,
				userDuration: 200,
				pos: {
					startX: 0,
					moveX: 0,
					endX: 0, 
					local: 0,
					distance: 0
				},
				
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
			if (this.autoplay) {
				this.play();
			}
			
		},
		/*		
		这种方式并不好, 用户不友好, 实现方式也不可以. 
		关键用户点击, 我们唯一要做的, 就是让他改变 slide 的值. 但是 slide 的值, 只能改变一次. 
		后续就不算了. 
		*/
		// watch: {
		// 	currentSlide () {

		// 	}
		// 	// curSlide (nSlide) {
		// 	// 	clearTimeout(this.timer);
		// 	// 	this.transitionDuration(200*(Math.abs(this.curSlide - nSlide) + 1));
		// 	// 	this.translateX(-this.swiperWidth * (nSlide + 1));
		// 	// } 
		// },
		methods: {
			/*阻止容器的上下滚动*/
			fn () {},
			// xxx () {
			// 	console.log('收到同志了')
			// },
			/*由外界传递出来的行为*/

			/*滑动到指定的页面*/
			slideTo (index) {


				if (!this.moving) {
					this.moving = true;
					clearTimeout(this.timer)
				// console.log(index)
				/*
					算法
					先拿到当前的 slide

					src: index
					target: this.currentSlide - 1;
				*/
				// let dest = index;
				// console.log(this.currentSlide);
				// let dest = this.cur
				let cur = this.currentSlide - 1;
				/*
					如果给定的 index 大于 slides 的个数 - 2 是真正显示的个数, -1 是从0 开始算
				*/
				if (index > this.slidesNumber - 3) {
					return;
				} 
				if (index < 0) {
					return;
				}

				// let dest = this.
				if (cur == index) {
					return;
				} else {
					/*说明要往右边滑动*/
					// console.log('要往右边滑动了')
					console.log(index - cur);

					this.transitionDuration(Math.min(100* (index - cur), 500))

					this.currentSlide = index;
					this.translateX(-this.swiperWidth * (this.currentSlide + 1));



				}

				// if (cur < index) {



				// }

				// if (cur > index) {
				// 	console.log(index - cur);

				// 	this.transitionDuration(Math.min(100* Math.abs(index - cur), 600))

				// 	this.currentSlide = index;
				// 	this.translateX(-this.swiperWidth * (this.currentSlide + 1));


				}

				// alert(1)
			},

			next () {

				if (!this.moving) {
					clearTimeout(this.timer)
					this.moving = true;
					// this.tra
					// this.translateX(-this.swiperWidth * (this.currentSlide + 1));
					this.transitionDuration(this.userDuration)
					this.translateX(this.left() - this.swiperWidth);

				}

			},
			previous () {

				if (!this.moving) {
					clearTimeout(this.timer)
					this.moving = true;
					// this.tra
					this.transitionDuration(this.userDuration)
					// this.translateX(-this.swiperWidth * (this.currentSlide + 1));
					this.translateX(this.left() + this.swiperWidth);

				}				
			},
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

			},
			setDefaultSlide () {
				if (this.curSlide < 0) {
					this.currentSlide = 0;
				} else if (this.curSlide >= this.slidesNumber - 1) {
					this.currentSlide = this.slidesNumber - 3;
				} else {
					this.currentSlide = this.curSlide;
				}
				this.translateX(-this.swiperWidth * (this.currentSlide + 1));
			},
			play () {
				this.timer = setTimeout(()=>{
					clearTimeout(this.timer);
					this.moving = true;
					this.unlock = false;
					
					this.transitionDuration(this.duration);
					
					this.translateX(- (this.swiperWidth + Math.abs(this.left())));

				}, this.interval);
			},
			transitionend () {
				this.moving = false;
				/*
					通过当前的位置, 来设置 currentSlide 的值
				*/	
				this.currentSlide = Math.abs(this.left())/this.swiperWidth;
				if (this.currentSlide === this.slidesNumber - 1) {
					this.transitionDuration(0);
					this.translateX(-this.swiperWidth*1);
					this.currentSlide = 1;
				}
				if (this.currentSlide === 0) {
					this.transitionDuration(0);
					this.translateX(-this.swiperWidth * (this.slidesNumber - 2))
					this.currentSlide = this.slidesNumber - 2;
				}
				this.$emit('transitionend', this.currentSlide - 1);

				if (this.autoplay) {
					this.play();
				}
			},
			/*toushstart handler*/
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
			/*toushmove handler*/
			m (e) {
				if (!this.moving && this.unlock) {
					let active = e.touches.length - 1;
					this.pos.moveX = e.touches[active].clientX;
					this.pos.distance = this.pos.moveX - this.pos.startX;
					this.translateX(this.pos.local + this.pos.distance);
				}
			},
			/*toushend handler*/
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
				
				let distance = Math.abs(this.left()) % this.swiperWidth;
				let point = [];
				let direction = ''
				/*
					主要是为了拿到当前状态下面, swiper 距离正常状态的, 左右移动的距离分别是多少. 
				*/
				if (this.left() > 0) {
					point = [distance, this.swiperWidth - distance];
				} else {
					point = [this.swiperWidth - distance, distance];
				}
				
				if (this.pos.distance > 0) {
					direction = 'to-right';
				} else if (this.pos.distance < 0){
					direction = 'to-left';
				} else {
					direction = 'none';
				}

				if (direction == 'none') {
					if (this.autoplay) {
						this.play();
					}
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