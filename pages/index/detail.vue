<template>
	<!-- 内容列表详情 -->
	<view class="container">
		<image src="../../static/banner2.png" mode="aspectFill"></image>
		<view class="wrapper_item_container">
			<view class="th">
				<view class="line1 line">
					项目
				</view>
				<view class="line2 line">
					浮点数
				</view>
				<view class="line3 line">
					要求范围
				</view>
				<view class="line4 line">
					单位
				</view>
			</view>
			<view class="wrapper_item_item" v-for="(item2,index2) in sites" :key="index2">
				<view class="line1 line">
					{{item2.name}}
				</view>
				<view class="line2 line" :style="{color:item2.color}">
					{{item2.val}}
				</view>
				<view class="line3 line">
					(XX~XX)
				</view>
				<view class="line4 line">
					{{item2.unit}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sites: [{
						name: '1.喷淋管道压力',
						val: '浮点数',
						unit: 'Bar',
						color: '#ccc'
					},
					{
						name: '2.频率',
						val: '浮点数',
						unit: 'Hz',
						color: 'rgba(211, 0, 100, .3)'
					},
					{
						name: '3.电机温度',
						val: '浮点数',
						unit: 'A',
						color: 'rgb(100, 200, 100)'
					},
				]
			};
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		image {
			width: 750upx;
			height: 470upx;
		}

		.wrapper_item_container {
			margin-top:60upx;
			background: #fff;
			width: 100%;
			box-sizing: border-box;
			padding:0 40upx;

			// padding: 0 20upx;
			.th {
				display: flex;
				padding: 10upx 20upx;
				background: #C7E3FF;
				color: #5481EA;
			}

			.wrapper_item_item:nth-child(odd) {
				background-color: #F1F1F1;
			}

			.wrapper_item_item:nth-child(even) {
				background-color: #F9F9F9;
			}

			.wrapper_item_item {
				display: flex;
				padding: 10upx 20upx;

			}

			.line {
				color: #333333;
				font-size: 30upx;
			}

			.line1 {
				flex: 2;
			}

			.line2 {
				flex: 1;
				text-align: center;
			}

			.line3 {
				flex: 1;
				text-align: center;
			}

			.line4 {
				flex: 1;
				text-align: center;
			}
		}

	}
</style>
