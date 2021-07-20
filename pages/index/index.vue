<template>
	<view class="pages_index">
		<view class="container">
			<!-- 头部切换栏 开始 -->
			<!-- 隐藏滚动条 -->
			<view class="nav">

				<view class="hidden">
					<view class="head_switch">
						<text class="switch_item" v-for="(item,index) in switchList" :key="index"
							@click="switchHead(index)" :class="{activeheader:index==currentheaderindex}">
							{{item}}
						</text>
					</view>
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
			<view class="flexspace">
				<view class="flex_item" v-for="(item,index) in statusList" :key="index"
					:style="{color:'#000',fontSize:28 + 'upx',backgroundColor:'#fff'}">
					<image :src="item.icon" mode="widthFix"></image>
					{{item.title}}
				</view>
			</view>
			<!-- 机器运行状态 结束 -->
			<!-- 产线 开始 -->
			<view class="flexspace">
				<view class="flex_item" v-for="(item,index) in prolineList" :key="index">
					{{item}}
				</view>
			</view>
			<!-- 产线 结束 -->
			<!-- 内容列表 开始 -->
			<view class="wrapper_list">
				<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
					<view class="wrapper_item_title">
						{{item1.title}}
						<image :src="item1.arrow" mode="widthFix" class="arrow" @click='toogle(index1)'></image>
					</view>
					<view class="wrapper_item_container" v-show="item1.toogleflag">
						<view class="wrapper_item_item" v-for="(item2,index2) in item1.innerList" :key="index2">
							<view class="line1 line">
								{{item2.line1}}
							</view>
							<view class="line2 line">
								{{item2.line2}}
							</view>
							<view class="line3 line">
								{{item2.line3}}
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
	import pagecom from 'components/pagecom.vue'
	import banner1 from "static/banner1.png"
	import banner2 from "static/banner2.png"
	import banner3 from "static/banner3.png"
	export default {
		data() {
			return {

				switchList: ['涂装线', '供漆', '机器人', '废弃处理', '冰水机房', '空压机', '安全环保'],
				// 当前head状态栏下标
				currentheaderindex: 0,
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
						title: "前处理预脱",
						toogleflag: false,
						arrow: '../../static/downarrow.png',
						innerList: [{
								line1: '1.喷淋管道压力',
								line2: '浮点数',
								line3: 'Bar'
							},
							{
								line1: '2.频率',
								line2: '浮点数',
								line3: 'Hz'
							},
							{
								line1: '3.电机温度',
								line2: '浮点数',
								line3: 'A'
							},
						]
					},
					{
						title: "前处理主脱",
						toogleflag: false,
						arrow: '../../static/downarrow.png',
						innerList: [{
								line1: '1.喷淋管道压力',
								line2: '浮点数',
								line3: 'Bar'
							},
							{
								line1: '2.喷淋管道压力',
								line2: '浮点数',
								line3: 'Hz'
							},
							{
								line1: '3.喷淋管道压力',
								line2: '浮点数',
								line3: 'A'
							},
						]
					},
					{
						title: "前处理主脱",
						toogleflag: false,
						arrow: '../../static/downarrow.png',
						innerList: [{
								line1: '1.喷淋管道压力',
								line2: '浮点数',
								line3: 'Bar'
							},
							{
								line1: '2.喷淋管道压力',
								line2: '浮点数',
								line3: 'Hz'
							},
							{
								line1: '3.喷淋管道压力',
								line2: '浮点数',
								line3: 'A'
							},
						]
					},
					{
						title: "前处理主脱",
						toogleflag: false,
						arrow: '../../static/downarrow.png',
						innerList: [{
								line1: '1.喷淋管道压力',
								line2: '浮点数',
								line3: 'Bar'
							},
							{
								line1: '2.喷淋管道压力',
								line2: '浮点数',
								line3: 'Hz'
							},
							{
								line1: '3.喷淋管道压力',
								line2: '浮点数',
								line3: 'A'
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
			switchHead(index) {
				if (this.currentheaderindex != index)
					this.currentheaderindex = index
			},
			toogle(index) {
				this.wrapperList1[index].toogleflag = !this.wrapperList1[index].toogleflag;
				this.wrapperList1[index].arrow = this.wrapperList1[index].toogleflag ? '../../static/uparrow.png' :
					'../../static/downarrow.png'
			}
		},
		components: {
			pagecom
		},

	}
</script>

<style lang="scss" scoped>
	.pages_index {
		width: 100%;
		// background-color: #2957C4;
		// padding-top: calc(var(--status-bar-height) + 10upx);

		.container {
			width: 100%;

			.nav {
				background-color: #2957C4;
				// padding-bottom: calc(var(--status-bar-height) + 10upx);
				position: fixed;   
				z-index: 100;
				top:var(--status-bar-height);

				.hidden {
					background-color: #2957C4;
					height: 76upx;
					overflow: hidden;


					.head_switch {
						// position: fixed;
						// top:calc(var(--status-bar-height) + 10upx);
						// z-index: 100;
						// background-color: #2957C4;
						width: 100%;
						height: 76upx;
						padding-bottom: 12upx;
						overflow-x: scroll;
						display: flex;
						align-items: center;
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
			}

			.swiper {
				margin-top: calc(var(--status-bar-height) + 10upx);
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
						box-sizing: border-box;
						border-left: 8upx solid #5481EA;
						color: #5481EA;
						padding-left: 20upx;
						margin-bottom: 40upx;
						position: relative;

						.arrow {
							position: absolute;
							right: 26upx;
							top: 50%;
							transform: translateY(-50%);
							width: 34upx;
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
								font-size: 28upx;
							}

							.line1 {
								flex: 2;
							}

							.line2 {
								flex: 2;
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
