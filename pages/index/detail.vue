<template>
	<!-- 内容列表详情 -->
	<view class="container">

	<u-navbar @custom-back="back" :title="title" title-color="#ffffff" back-icon-color="#ffffff" :background="background"></u-navbar>

		<!-- 轮播图 开始 -->
		<swiper class="swiper" :indicator-dots="false" autoplay="true" interval="4000" duration="500"
			indicator-color="white" indicator-active-color="red">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<!-- 轮播图 结束 -->
		<view class="wrapper_item_container">

			<view class="wrapper_item_title" >
				<view class="title_text">
				{{title}}
				</view>
				<!-- <image :src="item1.arrow" mode="widthFix" class="arrow"></image> -->
			</view>

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
					{{item2.lowVal}}~{{item2.faultVal}}
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
				background: {
					backgroundColor: '#0984e3',
				},
				title: '',
				sites: [],
				swiperList: []
			};
		},
		methods: {
			back() {
				uni.navigateBack({})


			}
		},
		async onLoad(e) {
			console.log(e);
			this.title = e.title;
			this.swiperList = e.banner.split(',')
			this.sites = await this.api.getsiteDetail({
				id: e.id
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		position: relative;
		background-color: #ecf0f1;
		padding-bottom: 160upx;
		padding-top: 5px;
		min-height: 100vh;
		// .navigation {
		// 	position: fixed;
		// 	z-index: 100;
		// 	top: 0;
		// 	width: 100%;
		// 	background-color: #0984e3;
		// 	padding-right: 84upx;
		// 	box-sizing: border-box;
		// 	display: flex;
		// 	align-items: center;

			// .back {
			// 	padding: 20upx 30upx;
			// 	width: 24upx;

			// 	image {
			// 		width: 24upx;
			// 	}
			// }

			// .title {
			// 	flex: 1;
			// 	text-align: center;
			// 	height: 92upx;
			// 	line-height: 92upx;
			// 	color: #fff;

			// }
		// }

		.swiper {
			margin: 0upx auto 20upx;
			// margin-top: calc(var(--status-bar-height) + 86upx);
			width: 710upx;
			height: 300upx;
			border-radius: 24upx;
			overflow: hidden;

			// padding:0 4upx;
			swiper-item {
				width: 100%;
				height: 400upx;

				image {
					box-sizing: border-box;
					width: 100%;
					height: 100%;
					// border-radius: 12upx;
				}
			}
		}


		// .back{
		// 	background-color: red;
		// 	position: absolute;
		// 	top:calc(var(--status-bar-height) + 10upx);
		// 	left:20upx;
		// 	image{
		// 		width: 13upx;
		// 	}
		// }
		.banner {
			width: 710upx;
			height: 300upx;
			margin: 10upx 20upx;
			border-radius: 24upx;
		}

		.wrapper_item_container {
			width: 710upx;
			border-radius: 30upx;
			padding: 30upx 20upx;
			// margin-top:60upx;
			background: #fff;
			// width: 100%;
			box-sizing: border-box;
			// padding:60upx 40upx 160upx;
			margin: 20upx 20upx 0upx;

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
			.wrapper_item_title {
				width: 100%;
				// padding:0 20upx;
				box-sizing: border-box;
				border-left: 8upx solid #5481EA;
				color: #5481EA;
				padding-left: 20upx;
				margin-bottom: 40upx;
				// position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 34upx;
				font-size: 32upx;

				.title_text {
					color: #5481EA;
					font-size: 32upx;
				}

				.arrow {
					// padding-right: 20upx;
					width: 100upx;
					color: #5481EA;
					font-size: 32upx;
					position: relative;

					image {
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						display: inline-block;
						width: 13upx;
						margin-left: 16upx
					}
				}
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
