<template>
	<!-- 内容列表详情 -->
	<view class="container">
		<view class="navigation">
			<view class="back" @click="back">
				<image src="../../static/back.png" mode="widthFix"></image>
			</view>
		</view>
		
		<!-- 轮播图 开始 -->
		<swiper class="swiper" :indicator-dots="true" autoplay="true" interval="4000" duration="500"
			indicator-color="white" indicator-active-color="red">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item" mode="aspectFill" />
			</swiper-item>
		</swiper>
		<!-- 轮播图 结束 -->
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
				sites: [
				],
				swiperList:[]
			};
		},
		methods:{
			back(){
			uni.navigateBack({
				
			})
			}
		},
		async onLoad(e){
			this.swiperList = e.banner.split(',')
			this.sites=await this.api.getsiteDetail({id:e.id})
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		position: relative;
		background-color: #ecf0f1;
		padding-bottom: 160upx;
		.navigation{
			width: 100%;
			background-color: #0984e3;
			padding:20upx;
			.back{
				width:24upx ;
				image{
					width:24upx ;
				}
			}
		}
		.swiper {
			margin:20upx auto;
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
			margin:10upx 20upx;
			border-radius: 24upx;
		}

		.wrapper_item_container {
			width: 710upx;
			border-radius: 30upx;
			padding:30upx 20upx;
			// margin-top:60upx;
			background: #fff;
			// width: 100%;
			box-sizing: border-box;
			// padding:60upx 40upx 160upx;
			margin:20upx 20upx 0upx;
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
