<style lang="less">
.wc-slide {
	-webkit-transform: translate3d(0px, 0, 0);
	-moz-transform: translate3d(0px, 0, 0);
	-o-transform: translate(0px, 0px);
	-ms-transform: translate3d(0px, 0, 0);
	transform: translate3d(0px, 0, 0);
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