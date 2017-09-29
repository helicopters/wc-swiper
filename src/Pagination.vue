<style lang="less">
.wc-pagination {
	position: absolute;
	bottom: 10px;
	// top:10px;
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	align-items:center;
	justify-content: center;
	.wc-dot {
		height: 8px;
		width: 8px;
		background: #000;
		opacity: 0.2;
		margin: 0 5px;
		border-radius: 50%;
	}
	.wc-dot-active {
		opacity: 1;
		background: #3498db;
	}
}	
</style>
<template>
	<div class="wc-pagination">
		<div class="wc-dot" v-for="v in dots" :class="{'wc-dot-active': active== v-1}">

		</div>	
	</div>
</template>
<script>
	export default {
		name: 'wcPagination',
		props: {
			dots: {
				default: 0
			},
			active: {
				default: 0
			}
		}
	}
</script>