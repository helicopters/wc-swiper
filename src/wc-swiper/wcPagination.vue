<style scoped lang="less">
.wc-pagination {
	position: absolute;
	bottom: 10px;
	height: 20px;
	width: 100%;
	background: red;
	display: flex;
	.wc-dot {
		height: 10px;
		width: 10px;
		background: green;
		margin: 0 10px;
		
	}
	.active {
		background: yellow;

	}
}	
</style>
<template>
	<div class="wc-pagination">
	
		<div class="wc-dot" v-for="v in slides" :class="{'active': cur==v-1}">
			{{v}}{{cur}}

		</div>
	
	</div>
</template>
<script>
	export default {
		name: 'wcPagination',
		props: {
			slides: {
				default: 0
			},
			cur: {
				default: 0
			}
		}
	}
</script>