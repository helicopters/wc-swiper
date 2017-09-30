<style lang="less">
.wc-slide {
	// transform: translate3d(0px, 0, 0); 谁加谁傻比
	height: 100%;
    width: 100%;
    flex-shrink: 0;
    z-index: 10;
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