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
			<image src="../../static/arrowright.png" mode="" @click="showSwiper"></image>
			<view class="title">
				{{title}}
			</view>
			<view class="content">
				{{detail}}
			</view>
		</view>
		<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000"
			v-if="isShowWindow==false" style="position: sticky; top: 0;">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<view class="swiper-item" @click="enlarge(index)">
					<image :src=item mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="body">



			<view class="bodyList" v-for="(item,index) in info" :key="index">
				<view class="head">
					<view class="date">
						<text class="day">{{item.day}}</text>
						<text class="month">{{item.month}}月</text>
					</view>
					<view class="false">
						<view class="icon">
							!
						</view>
						<view class="falsePoint">错误点</view>
					</view>
				</view>


				<view 
					class="contentLong" 
					v-for="(item1,index1) in item.detail" 
					:key="index1"
					@click="change(index,index1)" 
					:class="{active:currentIndex==index&&currentIndexTwo==index1,activedown:currentIndex!=index||currentIndexTwo!=index1}"
				>
					<view class="content" @click="change(index,index1)">

						<view class="contentTitle">
							<view class="titleTop" :style="{color:item1.type==false?'#E2350A':' #5481EA'}">
								{{item1.text}}
							</view>
							<view class="titleBottom">
								{{item1.time}}{{" "}}{{item1.noon}}
							</view>
						</view>
						<view class="contentFalse" :style="{color:item1.type==false?'#E2350A':' #5481EA'}">
							{{item1.fail}}
						</view>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>
<script>
	export default {
		data() {
			return {
				currentIndex: -1,
				currentIndexTwo: -1,
				isShowWindow: false,
				rotate: false,
				currentId: -1,
				title: "",
				detail: [],
				total: 0,
				page: {
					current: 1,
					size: 10
				},
				swiperList: [
					"../../static/yujingbcg.png"

				],
				info: [{
						month: 7,
						day: 26,

						detail: [{
								type: false,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限21,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: false,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: true,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							}
						]


					},
					{
						month: 7,
						day: 25,

						detail: [{
								type: true,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: false,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: true,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							}
						]


					},
					{
						month: 7,
						day: 24,

						detail: [{
								type: false,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: false,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							},
							{
								type: true,
								title:"前处理纯水上下限",
								noon: "下午",
								text: "数据超下限",
								fail: "压差p18-p19报警",
								detail: "振动值-mm/s 已超出上限23,流量-m3/s已超出下限",
								time: "03:04:27",
							}
						]


					},
				]
			}
		},
		methods: {
			showWindow(index) {
				this.currentId = index;
				this.isShowWindow = true
				this.title = this.info[index].addr
				this.detail = this.info[index].details
				console.log(this.currentId == index);
			},
			showSwiper() {
				this.isShowWindow = false
				this.currentId = -1

			},
			windowDelete() {
				this.isShowWindow = false

			},
			enlarge(index) {
				console.log(4456564);

				uni.previewImage({
					current: this.swiperList[index],

					urls: this.swiperList,
					indicator: "default"

				})

			},
			change(index, index1) {
				this.currentIndex = index
				this.currentIndexTwo = index1
					this.isShowWindow = true
					this.title=this.info[index].detail[index1].title
					this.detail=this.info[index].detail[index1].detail
			},

		},
		onLoad() {
			let page = {
				current: 1,
				size: 10
			}

		},

		//下拉页面刷新
		onPullDownRefresh() {
			this.info = []
			this.page.current = 1
			let page = {
				current: 1,
				size: 10
			}

			this.api.getapiList(page).then(res => {
				for (let i = 0; i < res.records.length; i++) {
					res.records[i].details = res.records[i].details.split(",")
				}
				this.info = [...this.info, ...res.records]
				this.total = res.total
			})
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 1000)


		},
		//上拉触底加载更多数据
		onReachBottom() {
			console.log("触底");
			if (this.total > this.info.length) {

				this.page.current += 1
				console.log(5555, this.page);
				this.api.getapiList(this.page).then(res => {
					for (let i = 0; i < res.records.length; i++) {
						res.records[i].details = res.records[i].details.split(",")
					}
					this.info = [...this.info, ...res.records]
					console.log("111", this.info);

				})


			}

		}
	}
</script>
<style lang="scss" scoped>
	.window {
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 100;
		width: 100vw;
		height: 100vh;
	}

	.windowList {
		background-color: #FFFFFF;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 199;
		width: 100%;

		.delete {
			position: absolute;
			top: 5upx;
			right: 5upx;
		}

	}

	.detail {
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

		image {
			position: absolute;
			top: 34upx;
			left: 26upx;
			width: 50upx;
			height: 50upx;
		}

		.title {
			font-size: 32upx;

			font-weight: 600;
			color: #3AFFC9;
			opacity: 1;
		}

		.content {
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

		.zhuan {
			transform: rotate(-90deg);
		}
	}

	.body {
		background-color: #EEEEEE;
		padding-top: 10upx;
		box-sizing: border-box;

		.bodyList {
			background-color: #ffffff;
			margin-top: 20upx;

			.head {
				display: flex;
				box-sizing: border-box;
				padding: 40upx 50upx;
				justify-content: space-between;

				.date {
					display: flex;

					align-items: flex-end;

					.day {
						// text-align: end;
						line-height: 36upx;
						font-size: 36upx;
						font-weight: bold;
						color: #434343;
					}

					.month {
						font-size: 20upx;
						font-weight: 400;
						color: #A2A4A7;
						
					}
				}

				.false {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 32upx;

					.icon {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 32upx;
						height: 32upx;
						background-color: red;
						border-radius: 16upx;
						color: #ffffff;
					}

					.falsePoint {
						font-size: 28upx;
						font-weight: 400;
						color: #303030;
						margin-left: 10upx;
						line-height: 32upx;
					}
				}
			}

			.contentLong {
				transition: all 1s;
				width:0;
				
				.content {
					display: flex;
					padding: 38upx 40upx;
					justify-content: space-between;
					margin-left: 50upx !important;
					width: 620upx;
					margin: 0 auto;
					border-bottom: 2upx solid #E5E2EF;

					.contentTitle {
						.titleTop {
							font-size: 28upx;
							font-weight: 400;

						}

						.titleBottom {
							font-size: 24upx;
							color: #A8A5B4
						}
					}
				}
			}
		
			.active {
				// background: linear-gradient(0deg, #F31313 0%, #EF0D0D 33%, #FF0606 100%);
				width:100%;
				background-color: red;
		
			
				color: #FFFFFF !important;
				.contentFalse{
					color: #FFFFFF !important;
				}
				.titleTop{
					color: #FFFFFF !important;
				}
				.titleBottom{
					color: #FFFFFF !important ;
				}
			}
		
			.activedown{
				animation-name: exampletwo;
				animation-duration: 1s;
				animation-fill-mode: forwards;
			}
			// @keyframes exampletwo{
			// 	 from {width:100%;background-color:#F31313}
			// 	  to {width: 0; background-color:#F31313;}
			// }
			
		}

	}
</style>
