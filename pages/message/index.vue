<template>
	<!-- 我的消息主页-->
	<view class="container">
		<view class="navigation">
			<view class="back" @click="back">
				<image src="../../static/back.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="list">
			<view class="item" v-for="item in infoList" :key='item.id' @click="toDetail(item.id)">
				<view class="title">
					{{item.title}}
				</view>
				<view class="content">
					{{item.content}}
				</view>
				<view class="date">
					{{item.date}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoList: [{
					id: 1,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃发动机市领导高房价绿色定功介绍了大概就是勒杜鹃发动机市领导高房价绿色定功介绍了大概就是勒杜鹃发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-01'
				}, {
					id: 2,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-02'
				}, {
					id: 3,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 4,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 5,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 6,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 7,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 8,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 9,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 10,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 11,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}, {
					id: 12,
					title: '标题1',
					content: '发动机市领导高房价绿色定功介绍了大概就是勒杜鹃',
					date: '2020-01-03'
				}]
			};
		},
		methods: {
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/message/detail?id=${id}`
				})
			},
			back() {
				uni.navigateBack({

				})
			}

		}

	}
</script>

<style lang="scss">
	.container {
		background-color: #fafafa;
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

		.list {
			margin-top: 88upx;
			padding: 36upx 22upx;
			.item {
				margin-bottom: 20upx;
				padding: 28upx 60upx;
				width: 710upx;
				box-sizing: border-box;
				height: 232upx;
				background: #FFFFFF;
				border-radius: 12upx;
				box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.12);
				position: relative;

				.title {
					height: 44upx;
					font-size: 32upx;
					line-height: 44upx;
					color: #303030;
					font-weight: 600;
				}

				.content {
					width: 100%;
					height: 98upx;
					font-size: 24upx;
					font-family: PingFangSC-Regular;
					color: #606060;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}

				.date {
					height: 34upx;
					font-size: 24upx;
					line-height: 34upx;
					color: #909090;
					position: absolute;
					bottom: 28upx;
				}
			}
		}
	}
</style>
