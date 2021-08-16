<!-- 报警信息 -->
<template>
	<view>
		<!-- <view class="window" v-if="isShowWindow==true">
			
		</view>
		<view class="windowList" v-if="isShowWindow==true">
			<view class="delete" @click="windowDelete">
				x
			</view>
			<view class="ListTitle">
				{{ti2123tle}}
			</view>1
			
		</view> -->
		<view class="detail" v-if="isShowWindow==true">
			<image src="../../static/arrowright.png" mode=""@click="showSwiper"></image>
			<view class="title">
				{{title}}
			</view>
			<view class="content" v-for="(item,index) in detail" :key="index">
				{{item}}
			</view>
		</view>
	<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-if="isShowWindow==false" style="position: sticky; top: 0;">
		<swiper-item v-for="(item,index) in swiperList" :key="index">
			<view class="swiper-item">
				<image :src=item mode=""></image>
			</view>
		</swiper-item>
	</swiper>
	<view class="Header" style="position: sticky;top:470upx ; z-index: 100;">
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
		 
	<view class="body" v-for="(item,index) in info" :key="index"  @click="showWindow(index)" :class="{'active':currentId==index}">
		<view class="date">
			{{item.time}} 
		</view>
		<view class="text">
			{{item.msg}}
		</view>
		<view class="failPoint">
			{{item.addr}}
		</view>
	</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isShowWindow:false,
				currentId:-1,
				title:"",
				detail:[],
				total:"",
				page:{
					current:1,
					size:10
				},
				swiperList: [
					"../../static/yujingbcg.png"

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
			this.currentId=index;
			this.isShowWindow=true
			this.title=this.info[index].addr
			this.detail=this.info[index].details
			console.log(this.currentId==index);
		},
		showSwiper(){
			this.isShowWindow=false
			this.currentId=-1
			
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
			this.api.getapiList(page).then(res=>{
				for(let i=0;i<res.records.length;i++){
			        res.records[i].details=res.records[i].details.split(",")
				}
				this.info=res.records
				
				this.total=res.total
				console.log("111",this.total);
				
			})
		},
		//下拉页面刷新
		onPullDownRefresh() {
			this.info=[]
			let page={
				current:1,
				size:10
			}
			this.api.getapiList(page).then(res=>{
				for(let i=0;i<res.records.length;i++){
				    res.records[i].details=res.records[i].details.split(",")
				}
				this.info=res.records
				this.total=res.total
			})
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)
			
			
		},
		//上拉触底加载更多数据
		onReachBottom() {
			console.log("触底");
			if(this.total>this.info.length){
			
				this.page.current+=1
				console.log(5555,this.page);
				this.api.getapiList(this.page).then(res=>{
					for(let i=0;i<res.records.length;i++){
					    res.records[i].details=res.records[i].details.split(",")
					}
					this.info=[...this.info,...res.records]
					console.log("111",this.info);
					
				})
			
				
			}
				
		}
	}
</script>
<style lang="scss" scoped>
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
		position: sticky;
		top: 0;
		width: 750upx;
		height: 470upx;
		background: #163756;
		box-sizing: border-box;
		padding: 36upx 80upx;
		overflow-y: scroll;
		transition: 0.5s;
	z-index: 100;
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
	    transition: 0.5s;
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
	
		align-items: center;
		.item{
			width: 30%;
			margin-left: 3%;
			font-size: 28upx;
			color: #FFFFFF;
			text-align: center;
		}
		.item:first-child {
			text-align: left;
		}
	}
	
	
	.body{
		display: flex;
		transition: 0.3s;
		width: 100%;
		height: 120upx;
		background: #FFFFFF;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
		align-items: center;
		box-sizing: border-box;
		color: #E2350A;
		border-bottom:2upx solid rgba(0, 0, 0, 0.08)  ;
	
		.date{
			width: 30%;
			margin-left: 3%;
			box-sizing: border-box;
			font-size: 28upx;
		}
		.text{
			width: 30%;
			margin-left: 3%;
			font-size: 28upx;
		}
		.failPoint{
			width: 30%;
			margin-left: 4%;
			font-size: 28upx;
			
		}
	}
	.active{
		background:#E2350A;
		color:#FFFFFF ;
		transition: 0.3s;
		opacity: 0.5;
		
	}
</style>
