<template>
	<!-- 我的信息详情 -->
	<view class="container">
		<view class="navigation">
			<view class="back" @click="back">
				<image src="../../static/back.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="wrapper">

			<view class="title">
				{{info.title}}
			</view>
			<view class="date">
				{{info.date}}
			</view>
			<image :src="info.img" mode="aspectFill" class="img" />
			<view class="content">
				{{info.content}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					title: '消息标题消息标题消息标题消息标题',
					content: '消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容',
					img: '../../static/banner1.png',
					date: '2020-01-05'
				}
			};
		},
		methods: {
			back() {
				uni.navigateBack({

				})
			}
		},
		onLoad(e) {
			console.log(e);
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #fff;

		.navigation {
			position: fixed;
			top:0;
			z-index: 100;
			box-sizing: border-box;
			width: 100%;
			// background-color: #2957C4;
			background-color: #0984e3;
			padding: 20upx;

			.back {
				width: 24upx;

				image {
					width: 24upx;
				}
			}
		}

		.wrapper {
			margin-top:88upx ;
			padding: 44upx 28upx;
			background-color: #fff;

			.title {
				height: 44upx;
				font-size: 32upx;
				line-height: 44upx;
				color: #000000;
				font-weight: 600;
			}

			.date {
				height: 34upx;
				font-size: 24upx;
				line-height: 24upx;
				color: #000000;
				padding: 10upx 0;
			}

			.img {
				width: 690upx;
				height: 320upx;
				padding: 10upx 2upx;
			}

			.content {
				width: 672upx;
				font-size: 28upx;
				line-height: 40upx;
				color: #606060;
			}
		}
	}
</style>
