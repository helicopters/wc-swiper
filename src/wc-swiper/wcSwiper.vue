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
/*
	如果 therehold 设置的比较短, duration 又比较长, 会有一个问题:
	每一次 touchstart, 都会导致 currentSlide 加1, 加到最后, 就挂掉了. 
	可能就是说, 实际的位移一点点, 但是 currentSlide 却会很多. 这不是我希望的. 
	所以我可以这样操作
	在自动滑动的时候, 不响应用户的行为, 这样不好, 
	或者设置每一次滑动的间隔, 也就是说比如  50ms 响应一次, 这样也不是解决了根本的问题. 

	按照我们的代码逻辑, 现在这样的方式是正确的. 什么叫做正确的呢???
	或者这样啊, 我们手动滑动, 就手动滑动, 如果是快速滑动的话, 不改变?

	什么是快速滑动, 两次滑动的间隔在 30ms 之内, 或者 50ms 之内, 都算是快速滑动
	如果是快速滑动, 就不再更新 slide 的值, 而是在滑动结束之后, 根据位移, 记录一下最终滑动的值
	最多滚动一个屏幕? 也不一定是滚动一个屏幕, 可能是根据值, 即可. 


	现在的逻辑是, 只要 touch 一次, 移动距离 > threhold, currentSlide + 1
	这样的情况存在一个问题: 如果连续多次 touch, 并且每次移动距离都大于 therehold, 
	但是每次 touch 的起点之间的距离, 这么说

	对于 swiper, 你第一次touch 的点是 a, 第二次touch的点是 b, a,b 之间的距离很小, 
	但是从a,b 都 touch 了 大于 threhold, 的距离, 然后呢, 此时就会造成, 虽然 swiper 的移动
	距离很短, 但是 currentSlide 已经到了一个很大的值了. 

	控制方式是, 一次 touch 结束, swiper 必须移动到指定位置, 才能继续进行下一次移动. 

	touchend 的时候, 给一个 moving.
	
*/
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
				userDuration: 260,
				// slideStatus: 'pause',
				pos: {
					startX: 0,
					moveX: 0,
					endX: 0, 
					local: 0,
					distance: 0,
					direction: ''
				},
				therehold: 110,
				moving: false
				// lock: false,
				// quickTouchList: []
				
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

					// this.slideStatus = 'moving';

					this.currentSlide++;
					this.transitionDuration(this.duration);
					this.translateX(-this.swiperWidth*this.currentSlide);

					/*及时清除定时器*/
					clearTimeout(this.timer);
				}, this.interval);
			},
			transitionend () {
				/*
					不能在这里解锁, 这里有一个问题, 比如 1 向左滑动到 0, 在还没有到 0 的时候
					就触发 touch 事件, 然后 transitionend 解锁了, touchmove 会被触发
					导致位置被修改. 
					我们该怎么操作, 以控制这样的情况发生. 
				*/
				// this.lock = false;
				// this.moveing = true;
				
				// console.log('transitionend', this.currentSlide)
				// this.moving = false;
				/*
					此时就存在了一个判断的问题, 当滚动到最后一个 slide 的时候. 
					不能继续往下滑动了, 要不然就超过了. 
					滚动到最后一个的时候, currentSlide = slidesNumber - 1

					最后一个的时候, 需要瞬间替换掉.
				*/

				// this.slideStatus = 'pause';

				if (this.currentSlide === this.slidesNumber - 1) {
					// console.log('yes i adfads ')
					this.currentSlide = 1;
					this.transitionDuration(0);
					
					this.translateX(-this.swiperWidth*this.currentSlide);
					
				}

				if (this.currentSlide === 0) {
					this.currentSlide = this.slidesNumber - 2;
					this.transitionDuration(0);
					
					this.translateX(-this.swiperWidth*this.currentSlide);


				}




				this.timer = setTimeout(()=>{
					// this.lock = false;

					// this.slideStatus = 'moving';

					this.currentSlide++;
					this.transitionDuration(this.duration);
					this.translateX(-this.swiperWidth*this.currentSlide);

					/*及时清除定时器*/
					clearTimeout(this.timer);
				}, this.interval);


			},

			/*====================用户手动播放======================*/

			/*首先要禁止掉上下的滑动*/
			// this.preventSwiper();

			/*
				用户手动滑动, 和自动滑动, 二者之间存在很多矛盾的点. 需要一个一个解决. 
				在自动播放的情况下
					用户任意时刻点击
						日报:  未播放的时候, 不响应点击
							  播放中, 响应点击, 停止播放, 保持当时的状态.
				这种情况, 就要设置一下当前的滑动状态

				第一种情况: 用户只是点击了 moving 状态的 swiper.
				第二种情况: 用户点击了, 然后开始左右滑动, 
					需要 swiper 跟着滑动.


				## bug
				1. 如果在 s 中判断, 只有 moving 状态响应滑动, 那么在 pause 的时候, 用户左右滑动
				不会响应, 所以要把 s 里面的状态判断去掉.

				2. 当 transition duration 比较长的时候, 一次 transition durtaion 没有结束
				手动又开始滑动, 这样就一直不会触发 transiton end 事件, 然后 currentSlide 的边界
				检测, 就始终不会生效. 所以我们要在 touchend 里面做边界判断. 

				处理方式, 如果在 touch 的时候, 发现当前的 slide, 是最后一个, 那么不响应滑动, 
				这个也可以放在 touchend 里面设置一个变量

				3. 当处于 1 的时候, 向 左边滑动, 然后触摸, 

				想着能不能把 touchmove 给取消掉, 在解锁之后再绑定起来. 
			*/

			/*
				touchstart 的时候, 记录一个 startTime
				touchend 的时候, 不需要, 
				每一次, 都往一个 list, 里面push 一个新的 startTime, 如果

				但是一次 touch 之后, 还需要判断, 下次的 touch 的问题, 这个不用管, 

				如果两次滑动之间, 小于 duration 是 300ms, 我们就不要让它响应了. 
				这个要求我们的滑动之后的间隔比较短是不是. 

			*/

			/*
				然后设置两次 touch 触发的时间点, 
			*/




			/*touchstart handler*/
			s (e) {
				// this.moveing = true;
				// console.log(this.currentSlide)
				// if (this.currentSlide === this.slidesNumber - 1) {
				// 	console.log('老子最后一个')
				// }
				// if (this.slideStatus == 'moving') {

					/*1 
						要先停止当前的滚动
						这也是一个问题, 如何在 moving 状态下, 瞬间将滚动停止

					   的确, 通过 clearTimeout() 不能停止滑动, 但是可以让 计时器不再影响我们.
					*/

					// if (this.lock) {
					// 	return false;
					// }

					// if (!this.lock) {

						// this.quickTouchList.push(+new Date());
						
					// this.touching = true;

					clearTimeout(this.timer);

					this.pause();

					// console.log(this.slideStatus)
					/*
						记录当前的位置信息

					*/
					this.pos.startX = Math.abs(e.targetTouches[0].clientX);

					this.pos.local = this.swiper.getBoundingClientRect().left;

					// console.log(this.pos.startX)

					// }

					// clearTimeout(this.timer);

				// }
			},
			m (e) {
					// if (this.lock) {
					// 	return false;
					// }

					// if (!this.lock && this.touching) {
						// return;
						// clearTimeout(this.timer);

				// if (this.slideStatus == 'pause') {
					/*
						记录当前移动端位置
						计算出来移动的距离, 以及方向

						如果 distance < 0, 方向是向右, >0, 方向是向左

						将位移, 加到当前的位置上面.
					*/

					// if (!this.moving && !this.lock) {
					this.pos.moveX = Math.abs(e.targetTouches[0].clientX);

					this.pos.distance = this.pos.startX - this.pos.moveX;

					this.transitionDuration(0);
					this.translateX(this.pos.local - this.pos.distance);
					// console.log(distance);
					// if (distance)
					// }

					// console.log(this.pos.moveX);
				// }				
			},
			e (e) {
				// this.touching = false;
				/*
					因为 touchstart 必定会将 status 设置为 pause, 所以这里的判断
					条件也没有什么用. 
				*/
				// if (!this.lock) {

					/*先计算出来两次 touch 的时间间隔*/
// let interval = 401;
					// if (this.quickTouchList.length > 1) {
						
					// 	let len = this.quickTouchList.length;
					// 	interval = this.quickTouchList[len-1] - this.quickTouchList[len-2];
					// 	console.log(interval,'两次滑动的间隔')
					// }


					// if (!this.moving && !this.lock) {

				// this.pos.distance = this.
				this.pos.endX = Math.abs(e.changedTouches[0].clientX);
				this.pos.distance = this.pos.startX - this.pos.endX;

				// if ()
				/*
					在这里要判断, distance 的大小. 
					如果 distance 大于 100, 需要进行一下我们的操作
					如果小于, 不做操作.
	
	

				*/

				// console.log(Math.abs(this.pos.distance))



				if (Math.abs(this.pos.distance) > this.therehold) {
					// 需要响应滑动, 分屏

					if (this.pos.distance < 0) {
						this.currentSlide--;
						console.log(this.currentSlide)

						if (this.currentSlide == 0) {
							// this.lock = true;
							// this

							// this.removeTouch();
							// console.log('我是第一个了')
						}


					} else {
						this.currentSlide++;
						if (this.currentSlide == this.slidesNumber - 1) {
							// this.lock = true;
							// this.removeTouch();
							// this
							// console.log('最后一个一个')
							// alert('lcok')
						}
						/*
							边界检查
							在这里检测, 是可以滑动, 但是我们不愿意这样让它滑动
							可以让它不滑动, 在 touchstart 里面设置
						*/
						// console.log(this.currentSlide,'dddddd')
						// if (this.currentSlide <= this.slidesNumber - 2) {
						// 	// 不能再加了, 
							
						// }

						
					}

					this.transitionDuration(this.userDuration);
					this.replay();

				} else {
					/*不响应滑动*/
					/*durtaion 应该需要动态设置一下*/
					// alert(1)
					/*
						这里没有动, 是因为在 s 的时候, 已经将 timer 给清除掉了.

					*/
					this.transitionDuration(this.userDuration);
					this.replay();

				}


				// console.log(this.slideStatus)

				// if (this.slideStatus == 'pause') {
					
				// this.transitionDuration(this.duration);
				// this.replay();
				// }

				// if (this.slideStatus == 'moving') {
					
				// }				
			},
			fn () {},

			// preventSwiper () {
			// 	this.swiperContainer.addEventListener('touchmove', function(e) {
			// 	    e.preventDefault();
			// 	}, false);
			// },

			translateX (value) {
				this.swiper.style.transform = 'translate3d(' + value + 'px, 0, 0)';
			},
			transitionDuration (ms) {
				this.swiper.style.transitionDuration = ms + 'ms';
			},
			pause () {
				// this.slideStatus = 'pause';

				let x = this.swiper.getBoundingClientRect().left;
				// console.log(x)
				this.translateX(x);				
			},
			replay () {
				// this.lock = false;
				this.translateX(-this.swiperWidth * this.currentSlide);
			},
			// removeTouch () {
			// 	this.swiper.removeEventListener('touchmove', this.m, false);
			// }
		}
	}
</script>