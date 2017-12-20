<style lang="less">
.wc-slide {
	// transform: translate3d(0px, 0, 0); 谁加谁傻比
	height: 100%;
    width: 100%;
    flex-shrink: 0;
    z-index: 10;
    /* 遇见过一次图片宽度很宽超过 slide 导致下一个 slide 也会有这个图片 */
    overflow: hidden;
    img {
    	/* pc 端干掉图片的默认拖动效果 */
    	-webkit-user-drag:none;
    }
}
</style>
<template>
	<div class="wc-slide" @click="clickHandler">
		<slot/>
	</div>
</template>
<script>
	export default {
		name: 'wcSlide',
		methods: {
			clickHandler () {
				this.$emit('click');
			}
		}
	}
</script>