<style scoped lang="less">
.wc-slide {
	height: 100%;
    width: 100%;
    flex-shrink: 0;
    /*如果存在 a 标签, 需要处理一下 a 标签的样式*/
    a {
    	display: block;
    	height: 100%;
    }
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