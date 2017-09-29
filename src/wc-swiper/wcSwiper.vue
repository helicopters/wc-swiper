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
  // transform: translate3d(0px, 0, 0);
  -webkit-transform: translate3d(0px, 0, 0);
  -moz-transform: translate3d(0px, 0, 0);
  -o-transform: translate(0px, 0px);
  -ms-transform: translate3d(0px, 0, 0);
  transform: translate3d(0px, 0, 0);



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
				reallySlidesNumber: 0,
				/*取值范围:[0, slidesNumber - 1]*/
				currentSlide: 0,
				/*和播放相关的一些属性*/	
				timer: null,
				interval: 1000,
				duration: 1000,
				/*用户滑动的时候, 松开, 会有一个 duration*/
				userDuration: 1260,
				
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
				lock: false,
				activeId: '',
				// userTimer: null
				// prevent: false


				
				
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
			// this.play();

			/*
				除去第一次, 是我们主动轮播, 其他都是 transitionend 触发, 在 swiper 上面绑定 
				transitionend
			*/
				// swiperContainer.addEventListener('touchmove', function(e) {
				//     e.preventDefault();
				// }, false);

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
					clearTimeout(this.timer);
					// this.swiperStatus = 'moving';
					this.moving = true;

					this.currentSlide++;
					this.transitionDuration(this.duration);

					// setTimeout(()=>{
						this.translateX(-this.swiperWidth*this.currentSlide);
					// },1)
					
					

					/*及时清除定时器*/
					
				}, this.interval);
			},
			transitionend () {


				// if (this.currentSlide === this.slidesNumber - 1) {
				// 	this.currentSlide = 1;
				// 	this.transitionDuration(0);
				// 	this.translateX(-this.swiperWidth* this.currentSlide);
				// }



				this.moving = false;
				// this.prevent = false;
				// this.play();
				

				let left = Math.abs(this.left());
				// let swiperWidth = translateX

				let y = left/this.swiperWidth;

				console.log(y);
				this.currentSlide = y;

				if (y === this.slidesNumber - 1) {
					console.log('此时这个是最后一个 slide, 我要进行瞬间的替换, 替换到第1个 slide, slide 从 0 开始计数的');

					this.transitionDuration(0);
					this.translateX(-this.swiperWidth*1);

					this.currentSlide = 1;
				}

				if (y === 0) {
					console.log('这个世第一个 slide, 啊我要跳转到哪一个呢, 跳到倒数第二个')
					this.transitionDuration(0);
					this.translateX(-this.swiperWidth * (this.slidesNumber - 2))
					this.currentSlide = this.slidesNumber - 1;
				}
				

				// this.play();
				

				
				
				
/*
新的问题, 是两根手指一个up 一个 down, 就这样一直下去的话, 会导致一些问题. 
transtionend 始终不会触发. 

现在的问题在于, 

*/
				
				
				


			},
			s (e) {

				
				console.log('start 事件触发了')

				// let left = this.left();

				// let xx = left/this.swiperWidth;

				// console.log(Math.ceil(xx))

				// console.log(this.slidesNumber - 1, Math.abs(Math.floor(xx)));

				// if (Math.abs(Math.floor(xx)) >= this.slidesNumber - 1) {
				// 	console.log('我日, 这是最后一个了')
				// 	// this.lock = false;
				// 	// this.moving = true;
				// 	this.lock = false;
				// } else {
				// 	// this.lock = true;
				// }
				// if ()



				// console.log()
				console.log(this.currentSlide,'fdsafafasdfdas')

				// that.activeID = toArray(e.changedTouches)[0].identifier;

				this.activeId = toArray(e.changedTouches)[0].identifier;

				let active = e.touches.length - 1;

				if (!this.moving) {

					


					// this.userTimer = setTimeout(()=>{},)
					




					this.transitionDuration(0);
					// clearTimeout(this.timer);
					// this.play();


					this.lock = true;
					

					this.pos.startX = e.touches[active].clientX;
					/* 一次 touch 的 起始local 点, 是固定的 */
					this.pos.local = this.left();

/*
init 状态, 此时 swiper 静止, touchstart, 如果不动, 则希望 swiper 不响应
如果动, 则响应. 所以需要在 touchstart 的时候, 先清除定时器. 



*/




				}
			},
			m (e) {

				console.log('touchmove 事件触发了')
				if (!this.moving && this.lock) {
					// clearTimeout(this.timer);
					
					let active = e.touches.length - 1;
				
					this.pos.moveX = e.touches[active].clientX;

					this.pos.distance = this.pos.moveX - this.pos.startX;


					this.translateX(this.pos.local + this.pos.distance);
				}
			},
			e (e) {

				// var cur = e.touches.length - 1;
				let curId = toArray(e.changedTouches)[0].identifier;

				if (!this.moving && this.lock && (curId == this.activeId)) {
					this.lock = false;
					// this.prevent = false;
					this.pos.endX = e.changedTouches[0].clientX;

					this.pos.distance = this.pos.endX - this.pos.startX;

					this.recover();
				}

			},

			fn () {},


/*
	同时要加上一个限制, 假设 swiper 从 -w 开始, 那么 -w 到 0, 以及 x, x+1 w 不响应
	touch 事件, 这个可以通过 

	不是, 是先加上一个替换, 也就是说, 在什么时候. 比如说当 transitonend 的时候, 并且此时拿到
	哦, 当前的 slide 是最后一个. 
*/


			recover () {

				let left = Math.abs(this.left());

				// console.log(left% this.swiperWidth);
				// console.log(this.swiperWidth - 1)
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

				// alert(1)

				// let point = [this.swiperWidth - distance, distance];

				// console.log(point);

				let direction = ''
				if (this.pos.distance > 0) {
					direction = 'to-right';
				} else{
					direction = 'to-left';
				} 

				// else {
				// 	// direction = 'none'
				// 	// this.play();
				// }



				this.transitionDuration(260);



				// if (direction == 'none') {
				// 	this.play();
				// }



				if (direction === 'to-right') {
					/*说明需要向右边移动*/
					if (point[0] > this.therehold) {
						// console.log('ria')

						console.log('当前的距离', this.left())
						console.log('需要向右移动的距离', point[1]);
						console.log('理论上移动结束的距离', this.left() + point[1]);

						this.translateX(this.left() + point[1]);

						/*
							也就是在这里加一个判断
						*/
						let next = (this.left() + point[1]) / this.swiperWidth;
						console.log(next,'岁月静好');

						// this.currentSlide = Math.abs(next);

						if (Math.abs(next) === 0) {
							console.log('这次 touch 结束到第0 ge ')

							this.moving = true;
						}






					} else {
						console.log('移动的距离不太够, 所以要恢复之前的状态');
						console.log('当前的距离', this.left())
						console.log('需要向左边移动的距离', point[0]);
						console.log('理论上移动结束的距离', this.left() - point[0]);

						this.translateX(this.left() - point[0]);

					}
				} 


				if (direction === 'to-left') {
					/*此时就说明需要往左边补全移动距离*/
					if (point[1] > this.therehold) {
						console.log('当前的距离', this.left())
						console.log('需要向左边移动的距离', point[0]);
						console.log('理论上移动结束的距离', this.left() - point[0]);

						this.translateX(this.left() - point[0]);

						let next = (this.left() - point[0]) / this.swiperWidth;
						console.log(next,'岁月静好');

						if (Math.abs(next) === this.slidesNumber - 1) {
							console.log('这次 touch 结束会到达最后一个')

							this.moving = true;
						}





					} else {

						console.log('移动的距离不太够')
						console.log('当前的距离', this.left())
						console.log('需要向左边移动的距离', point[0]);
						console.log('理论上移动结束的距离', this.left() + point[1]);

						this.translateX(this.left() + point[1]);

					}
				}




				// console.log(direction)

			},

			
			
			
			
			

			translateX (value) {
				this.swiper.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms) {
				this.swiper.style.transitionDuration = ms + 'ms';
			},
			// pause () {
				

			// 	let x = this.swiper.getBoundingClientRect().left;
				
			// 	this.translateX(x);				
			// },
			left () {
				return this.swiper.getBoundingClientRect().left;
			}
			// replay () {
				
			// 	this.translateX(-this.swiperWidth * this.currentSlide);
			// },
			
			
			
		}
	}
</script>