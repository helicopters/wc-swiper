<style>
	.swiper-box {
		height: 300px;
		width: 1125px;
		/*width: 100%;*/
		position: relative;
		font-size: 0;
		/*overflow: hidden;*/
	}
	.slide {
		position: relative;
		/*top:0;*/
		/*left:0;*/
		/*width: 100%;*/
		font-size: 50px;
		text-align: center;
	


		height: 100%;
		display: inline-block;
		width: 375px;
		
		/*transition: all 3s ease-in 2s;*/
	}
	.transition {
		/*transition: all 2s;*/
		/*transition-duration: 1s;*/
		/*transition-delay: 1.2s;*/
	}
	.slide-a {
		background: red;
	}
	.slide-b {
		background: yellow;
		/*transform: translateX(100%);*/
	}
	.slide-c {
		background: blue;
		/*transform: translateX(200%);*/
	}
	
	.page {
		position: absolute;
		top: 10px;

		
	}
	.item{
		display: inline-block;
		height: 20px;
		width: 20px;
		background: gray;

	}
	.active {
		background: white;
	}
	.container{
		width: 100%;
		overflow: hidden;
	}

</style>
<template>


	<div class="container">
		

		<div class="swiper-box">

			<div class=" slide slide-a">1</div>
			<div class=" slide slide-b">2</div>
			<div class=" slide slide-c">3</div>

		</div>
		<div class="page">
			<div class="item"></div>
			<div class="item"></div>
			<div class="item"></div>
		</div>

	</div>



</template>
<script>


	export default {
		mounted () {


			let swiper = document.querySelector('.swiper-box');
			let slides = toArray(swiper.children);

			function toArray(value) {
				return Array.prototype.slice.call(value);
			}

			let times = 0;

			let lock = false;


			function change () {




				// console.log(times)
				// 初始化之后的结果就是这样
				slides.forEach((ele, index) => {
					ele.style.left = -375*index + 'px';
					ele.style.transform = 'translateX(-375px)'
					ele.style.transitionDuration = '0ms'
					ele.transitionend = null;




					// 当前要动的元素
					if (index == times) {
						ele.style.transform = 'translateX(0)'
						ele.style.transitionDuration = '1000ms'
						
					}
					if ((index == times + 1)) {
						ele.style.transform = 'translateX(375px)'

						// ele.style.transitionDuration = '300ms'
					}
					if ((times + 1) == 3) {
						// console.log('我再低三个')
						slides[0].style.transform = 'translateX(375px)'
						// ele.style.transitionDuration = '1000ms'
					}



					if (times == 0) {
						slides[2].style.transitionDuration = '1000ms'
					}

					if (times >=1) {
						slides[times-1].style.transitionDuration = '1000ms'
					}
					


					// }
				});	
				


				times++;
				if (times == 3) {
					times = 0;
				}	



				lock=false;



			}


			swiper.addEventListener('transitionend', (e)=>{
				if (!lock) {

					let v = times - 1;
					if (v < 0) {
						v = 2;
					}
					toArray(document.querySelectorAll('.item')).forEach((el)=>{
						el.classList.remove('active')
					})
					document.querySelectorAll('.item')[v].classList.add('active')


					console.log('一次', e.target.getAttribute('class'), v)
					lock = true;
					setTimeout(()=>{
						change();
					}, 2000)					
				}



			}, false)



		
			change();



			// setTimeout(()=>{
			// 	change();
			// },2000)


			slides.forEach((el, index) =>{



				let startX = 0;
				let distance;

				el.addEventListener('touchstart', (e) =>{
					let touch = e.targetTouches[0];
					console.log(touch.pageX)

					startX = touch.pageX; // 当前滑动的距离


					// 需要让所有的元素的 


					slides.forEach((ele) =>{
						el.style.transitionDuration = '0ms'
					})





				}, false)





/*
相对于当前的 translateX 值得到的, 所以还是要考虑元素当前的 translate X 值, 
这个 translate 值怎么拿到呢, 

或者不需要考虑这个问题, 我们只要判断当前用户是在往左边滑动, 并且滑动的距离超过一定的值
就直接触发滑动效果, 

直接在 touchstart 的时候, 准备好左右的两个点, 

*/




				el.addEventListener('touchmove', (e) =>{
					let touch = e.targetTouches[0];
					// console.log(touch.pageX)

					let x = touch.pageX; // 当前滑动的距离

					distance = x - startX;
					// 设置当前的 slide 的位置, 需要在 touchstart 开始就进行. 
					console.log(distance)

					el.style.transform = 'translateX(' + distance + 'px)';


					slides[index + 1].style.transform = 'translateX(' + (375+distance) + 'px)'



					// if (Math.abs(distance) > 100) {
					// 	change();
					// }








				}, false)




			el.addEventListener('touchend', (e) =>{


				if (Math.abs(distance) > 100) {
					console.log('我应该移动的');



					if (distance > 0) {
						// 向右边滑动的
						times--;
						change();

					} else {
						// 是向左边滑动的
						times++;
						change();
					}








				}











			}, false)


















			})











		}

	}

</script>