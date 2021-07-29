<template>
	<view class="pages_index">
		<view class="container">
			<!-- 头部切换栏 开始 -->
			<!-- 隐藏滚动条 -->

			<view class="hidden">
				<view class="head_switch">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(item.id)" :class="{activeheader:item.id==currentheaderID}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<!-- 头部切换栏 结束 -->
			<!-- 轮播图 开始 -->
			<swiper class="swiper" :indicator-dots="true" autoplay="true" interval="4000" duration="500"
				indicator-color="white" indicator-active-color="red">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<image :src="item" mode="aspectFill" />
				</swiper-item>
			</swiper>
			<!-- 轮播图 结束 -->
			<!-- 机器运行状态 开始 -->
			<!-- <view class="flexspace">
				<view class="flex_item" v-for="(item,index) in statusList" :key="index"
					:style="{color:'#000',fontSize:28 + 'upx',backgroundColor:'#fff'}">
					<image :src="item.icon" mode="widthFix"></image>
					{{item.title}}
				</view>
			</view> -->
			<!-- 机器运行状态 结束 -->
			<!-- 产线 开始 -->
			<!-- 	<view class="flexspace">
				<view class="flex_item" v-for="(item,index) in prolineList" :key="index">
					{{item}}
				</view>
			</view> -->
			<!-- 产线 结束 -->
			<!-- 内容列表 开始 -->
			<view class="wrapper_list">
				<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
					<view class="wrapper_item_title" @click='toogle(index1)'>
						{{item1.dictValue}}
					<view class="arrow">详情
					<image src="../../static/arrow2.png" mode="widthFix"></image>
					</view>	
						<!-- <image :src="item1.arrow" mode="widthFix" class="arrow"></image> -->
					</view>
					<view class="wrapper_item_container">
						<view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2">
							<view class="line1 line">
								{{item2.name}}
							</view>
						<view class="line2 line" :style="{color:item2.color}">
								{{item2.val}}
							</view>
							<view class="line3 line">
								{{item2.unit}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 内容列表 结束 -->
		</view>
	</view>

</template>

<script>
	import banner1 from "static/banner1.png"
	import banner2 from "static/banner2.png"
	import banner3 from "static/banner3.png"
	export default {
		data() {
			return {

				switchList: [{
						dictValue: '涂装线',
						id: '1'
					},
					{
						dictValue: '供漆',
						id: '2'
					}, {
						dictValue: '机器人',
						id: '3'
					},
					{
						dictValue: '废弃处理',
						id: '4'
					},
					{
						dictValue: '冰水机房',
						id: '5'
					},
					{
						dictValue: '空压机',
						id: '6'
					},
					{
						dictValue: '安全环保',
						id: '7'
					}
				],
				// 当前head状态栏下标
				currentheaderID: '1',
				banner1,
				banner2,
				banner3,
				swiperList: [banner1, banner2, banner3],
				prolineList: ['产线1', '产线2', '产线3', '产线4'],
				statusList: [{
						icon: "../../static/iconnormal.png",
						title: "正常",

					},
					{
						icon: "../../static/icondormant.png",
						title: "休眠",

					},
					{
						icon: "../../static/iconrun.png",
						title: "运行",

					},
					{
						icon: "../../static/iconprompt.png",
						title: "提示",

					},
					{
						icon: "../../static/iconwarn.png",
						title: "警告",

					}
				],
				wrapperList1: [{
						dictValue: "前处理预脱",
						// toogleflag: false,
						arrow: '../../static/downarrow.png',
						sites: [{
								name: '1.喷淋管道压力',
								val: '浮点数',
								unit: 'Bar'
							},
							{
								name: '2.频率',
								val: '浮点数',
								unit: 'Hz'
							},
							{
								name: '3.电机温度',
								val: '浮点数',
								unit: 'A'
							},
						]
					}

				]

			}
		},

		computed: {
			// arrow(){
			// 	return function(index){
			// 		if(this.wrapperList1[index].toogleflag){
			// 			return '../../static/uparrow.png'
			// 		}
			// 		return '../../static/downarrow.png'
			// 	}
			// }
		},
		methods: {
			switchHead(id) {
				if (this.currentheaderID != id) {
					this.currentheaderID = id
					uni.setStorageSync("currentheaderID", this.currentheaderID)
					this.getwrapperList(this.currentheaderID)
				}


			},
			toogle(index) {
				// this.wrapperList1[index].toogleflag = !this.wrapperList1[index].toogleflag;
				// this.wrapperList1[index].arrow = this.wrapperList1[index].toogleflag ? '../../static/uparrow.png' :
				// 	'../../static/downarrow.png'
			},
			// 获取内容列表
			getwrapperList(id) {
					this.api.getwrapperList({
						id
					})
					.then(wraplist => {
						// 为每项添加一个折叠状态和图标
						// for (let item of wraplist) {
						// 	item.toogleflag = false;
						// 	item.arrow = '../../static/downarrow.png';
						// }
						// wraplist.push()
						this.wrapperList1 = wraplist
						console.log({
							wraplist: this.wrapperList1
						});
						})


			}

		},
		components: {},
		async onLoad() {
			

			// 轮播图
			let banners = await this.api.getbanner()
			this.swiperList = banners.records.map(item => item.img)
			// 头部切换栏列表
			this.switchList = await this.api.getheadswitchList()
// 缓存头部切换栏选中id,在趋势中共享
			uni.setStorageSync("currentheaderID", this.switchList[0].id)
			this.getwrapperList(this.switchList[0].id)

		}

	}
</script>

<style lang="scss" scoped>
	.pages_index {
		width: 100%;
		// background-color: #2957C4;
		// padding-top: calc(var(--status-bar-height) + 10upx);

		.container {
			width: 100%;

			.hidden {
				top: 0;
				position: fixed;
				z-index: 100;
				background-color: #2957C4;
				height: calc(var(--status-bar-height) +86upx);
				// overflow: hidden;
				width: 100%;

				.head_switch {
					// position: fixed;
					margin-top: calc(var(--status-bar-height) + 10upx);
					// z-index: 100;
					background-color: #2957C4;
					width: 100%;
					height: 76upx;
					// padding-bottom: 12upx;
					overflow-x: scroll;
					// display: flex;
					// align-items: center;
					white-space: nowrap;

					.switch_item {
						padding: 18upx 23upx;
						font-size: 28upx;
						font-weight: 600;
						// color: #ecf0f1;
						color: #fff;
						opacity: 0.64;
					}

					.activeheader {
						position: relative;
						font-size: 28upx;
						font-weight: 600;
						color: #fff;
						opacity: 1;
						transition: 0.3s;
					}

					.activeheader::after {
						position: absolute;
						bottom: 8upx;
						left: 50%;
						transform: translateX(-50%);
						content: "";
						width: 50upx;
						height: 6upx;
						background: #fff;
						opacity: 1;
						border-radius: 6upx;
					}
				}
			}

			.swiper {
				margin-top: calc(var(--status-bar-height) + 84upx);
				width: 750upx;
				height: 400upx;

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

			.flexspace {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				padding: 20upx 30upx;
				justify-content: space-between;

				.flex_item {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 1;
					margin: 0 8upx;
					background-color: #2957C4;
					color: #FFF;
					font-size: 36upx;
					padding: 14upx 0upx;
					text-align: center;

					image {
						width: 28upx;
						margin-right: 10upx;
					}
				}
			}

			.wrapper_list {
				width: 690upx;
				box-sizing: border-box;
				margin: 30upx;

				.wrapper_item {
					width: 690upx;
					margin-bottom: 40upx;

					.wrapper_item_title {
						width: 100%;
						// box-sizing: border-box;
						border-left: 8upx solid #5481EA;
						color: #5481EA;
						padding-left: 20upx;
						margin-bottom: 40upx;
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 50upx;
						font-size: 32upx;
						.arrow {
							padding-right:20upx;
							width: 100upx;
							color: #5481EA;
							font-size: 32upx;
							position: relative;
							
							image{
								position: absolute;
								top:50%;
								transform: translateY(-50%);
								display: inline-block;
								width: 28upx;
							}
						}
					}



					.wrapper_item_container {
						background: #fff;
						width: 100%;
						box-sizing: border-box;
						// padding: 0 20upx;

						.wrapper_item_item:nth-child(odd) {
							background-color: #F1F1F1;
						}

						.wrapper_item_item:nth-child(even) {
							background-color: #F9F9F9;
						}

						.wrapper_item_item {
							display: flex;
							padding: 10upx 20upx;

							.line {
								color: #333333;
								font-size: 32upx;
							}

							.line1 {
								flex: 3;
							}

							.line2 {
								flex: 1;
							}

							.line3 {
								flex: 1;
							}
						}
					}



				}
			}


		}
	}
</style>
