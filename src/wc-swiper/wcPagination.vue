<style scoped lang="less">
.wc-pagination {
	position: absolute;
	bottom: 10px;
	height: 18px;
	width: 100%;
	background: transparent;
	display: flex;
	align-items:center;
	justify-content: center;
	.wc-pagination-wrapper {
		display: flex;
		.wc-dot {
			height: 8px;
			width: 8px;
			background: #000;
			opacity: 0.2;
			margin: 0 5px;
			border-radius: 50%;
		}
		.active {
			opacity: 1;
			background: #3498db;
		}
	}

}	
</style>
<template>
	<div class="wc-pagination">
		<div class="wc-pagination-wrapper">
			<div class="wc-dot" v-for="v in slides" :class="{'active': cur==v-1}">
			</div>			
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