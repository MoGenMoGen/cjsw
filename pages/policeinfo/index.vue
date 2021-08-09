<template>
	<view>
		<!-- <view class="window" v-if="isShowWindow==true">
			
		</view>
		<view class="windowList" v-if="isShowWindow==true">
			<view class="delete" @click="windowDelete">
				x
			</view>
			<view class="ListTitle">
				{{title}}
			</view>
			
		</view> -->
		<view class="detail" v-if="isShowWindow==true">
			<image src="../../static/arrowright.png" mode=""></image>
			<view class="title">
				{{title}}
			</view>
			<view class="content">
				{{detail}}
			</view>
		</view>
	<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-if="isShowWindow==false">
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
		<view class="failPoint" @click="showWindow(index)">
			{{item.fail}}
		</view>
	</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isShowWindow:false,
				title:"",
				detail:"",
				swiperList: [
					"../../static/swiperitem.png",
					"../../static/iconnormal.png"

				],
				info:[
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"压差p18-p19报警",
						detail:"振动值-mm/s 已超出上限23,流量-m3/s已超出下限"
						
					},
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"压差p18-p19报警",
						detail:"十多年华为我核对请我喝ID"
					},
					
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"p18-p19报警",
						detail:"缺钱让人太突然好一体化金太阳"
					},
					{
						date:"2021-07-26 03:04:27",
						noon:"下午",
						text:"数据超下限",
						fail:"报警",
						detail:"请问二位他跟他然后又聚义"
						
					},
				]
			}
		},
		methods: {
		showWindow(index){
			this.isShowWindow=true
			this.title=this.info[index].fail
			this.detail=this.info[index].detail
		},
		windowDelete(){
			this.isShowWindow=false
		}
		},
		onLoad() {
			let page={
				current:1,
				size:10
			}
			this.info=this.api.getapiList(page).then(
			console.log(this.info)
			)
		}
	}
</script>
<style lang="scss">
	.window{
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.4);
		z-index: 100;
		width: 100vw;
		height: 100vh;
	}
	.windowList{
		background-color: #FFFFFF;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 199;
		width: 100%;
		.delete{
			position: absolute;
			top: 5upx;
			right: 5upx;
		}
		
	}
	.detail{
		width: 750upx;
		height: 470upx;
		background-color: #163756;
		box-sizing: border-box;
		padding: 36upx 80upx;
		position: relative;
		overflow-y: scroll;
		image{
	 		position: absolute;
			top: 34upx;
			left: 26upx;
			 width:50upx;
			 height: 50upx;
		}
		.title{
			font-size: 32upx; 
		
			font-weight: 600;
			color: #3AFFC9;
			opacity: 1;
		}
		.content{
			font-size: 28upx;
			font-weight: 600;
			color: #FFFFFF;
			opacity: 1;
			margin-top: 40upx;
		}
	}
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
