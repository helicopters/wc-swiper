<style lang="less">
.wc-slide {
	// transform: translate3d(0px, 0, 0); 谁加谁傻比
	height: 100%;
    width: 100%;
    flex-shrink: 0;
}
</style>
<template>
	<div class="wc-slide">
		<slot/>
	</div>
</template>
<script>
	export default {
		name: 'wcSlide'
	}
</script>