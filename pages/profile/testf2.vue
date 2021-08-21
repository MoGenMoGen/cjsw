<template>
	<view class="">

		<view class="" @click='show=true'>
			显示图表
		</view>
		<view class="wrapper" v-if="show">

			<iframe style="z-index: 100;" src="http://10086.jinkworld.com/h5/f2" frameborder="0" ref='iframe'
				width='100%' height='100%'></iframe>
			<view class="close" @click='show=false'>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		width: 100%;
		height: calc(100vh - 88upx);
		min-height: 100vh;
		position: relative;

		.close {
			position: absolute;
			right: 10px;
			bottom: 50px;
			width: 24px;
			height: 24px;
			background-color: rgba(0, 0, 0, 0.2);
			border-radius: 50%;
			z-index: 101;
		}

		.close::after,
		.close::before {
			content: '';
			height: 10px;
			width: 2px;
			background-color: #ffffff;
			transform: rotate(45deg);
			position: absolute;
			top: 7px;
			left: 11px;
		}

		.close::before {
			transform: rotate(-45deg);
		}
	}
</style>
