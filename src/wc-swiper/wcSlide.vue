<style scoped lang="less">
.wc-slide {
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