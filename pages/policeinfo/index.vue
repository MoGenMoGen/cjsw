<template>
	<view class="">
	<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item v-for="(item,index) in swiperList" :key="index">
			<view class="swiper-item">
				<image :src=item mode=""></image>
			</view>
		</swiper-item>
	
	</swiper>
	<view class="Header">
		<view class="item">
			时间/日期
		</view>
		<view class="item">
			消息文本
		</view>
		<view class="item">
			错误点
		</view>
	</view>
		 
	<view class="body" v-for="(item,index) in info" :key="index">
		<view class="date">
			{{item.date}} {{item.noon}}
		</view>
		<view class="text">
			{{item.text}}
		</view>
		<view class="failPoint">
			{{item.fail}}
		</view>
	</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				swiperList: [
					"../../static/swiperitem.png",
					"../../static/iconnormal.png"

				],
				info:[
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"压差p18-p19报警"
						
					},
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"压差p18-p19报警"
						
					},
					
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"p18-p19报警"
						
					},
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"报警"
						
					},
				]
			}
		},
		methods: {

		}
	}
</script>
<style lang="scss">
	.swiper {
		width: 750upx;
		height: 470upx;

		.swiper-item {
			width: 100%;
			height: 470upx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.Header{
		background-color:#E2350A ;
		width: 100%;
		height: 100upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.item{
			font-size: 28upx;
			color: #FFFFFF;
		}
	}
	.body{
		display: flex;
		width: 100%;
		height: 120upx;
		background: #FFFFFF;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
		align-items: center;
		padding-left: 50upx
		;
		box-sizing: border-box;
		color: #E2350A;
		border-bottom:2upx solid rgba(0, 0, 0, 0.08)  ;
		.date{
			width: 216upx;
			box-sizing: border-box;
			font-size: 28upx;
		}
		.text{
			margin-left: 58upx;
			font-size: 28upx;
		}
		.failPoint{
			margin-left: 54upx;
			font-size: 28upx;
			
		}
	}
</style>
