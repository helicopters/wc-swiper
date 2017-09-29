<style lang="less">
.wc-slide {
	// transform: translate3d(0px, 0, 0);
	height: 100%;
    width: 100%;
    flex-shrink: 0;

}
</style>
<template>
	<div class="wc-slide" @click="fn" @touchstart="start">
		<slot/>
	</div>
</template>
<script>
	export default {
		name: 'wcSlide',
		methods: {
			fn () {
				this.$emit('click');
			},
			start () {
				this.$emit('touchstart');
			}
		}
	}
</script>