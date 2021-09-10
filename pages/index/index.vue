<template>
	<view class="pages_index">
		<view class="container">
			<!-- 头部切换栏 开始 -->
			<!-- 隐藏滚动条 -->

			<view class="hidden">
				<view class="head_switch">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(index,item)" :class="{activeheader:index==currentheaderIndex}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<!-- 头部切换栏 结束 -->
			<!-- 首页背景开始 -->
			<view class="indexbg" :style="{backgroundImage:'url('+homebg+')'}">
			</view>
			<!-- 首页背景开始 -->
			<!-- 轮播图 开始 -->
			<!-- <swiper class="swiper" :indicator-dots="false" autoplay="true" interval="4000" duration="500"
				indicator-color="white" indicator-active-color="red">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<image :src="item" mode="aspectFill" />
				</swiper-item>
			</swiper> -->
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
			<view class="wrapper_list" v-if='!ismonitor'>
				<!-- 子列表 开始 -->
				<view class="child_hidden" v-if='isChild'>
					<view class="child_switch">
						<text class="child_switch_item" v-for="(item,index) in ChildListTitle" :key="index"
							@click="switchChildList(index)" :class="{active_child:index == currentChildIndex}">
							{{item}}
						</text>
					</view>
				</view>
				<!-- 子列表 结束 -->
					<view class="wrapper_item"  v-for="(item1,index1) in wrapperList1" :key="index1"
						:style="{'border-radius':showIdList.length!=0?'40upx':'62upx'}">
						<view class="wrapper_item_title" @click='toogle(index1)'>
							<view class="" style="display: flex;align-items: center;">
								<image src="../../static/titletip.png" mode="widthFix"
									style="width: 32upx;margin-right: 10upx;"></image>
								<view class="title_text">
									{{item1.dictValue}}
								</view>
							</view>
							<view style="display: flex;align-items: center;">
								<image src="../../static/showmore.png" mode="widthFix"
									style="width:64upx;height: 64upx; ;margin-right:20upx ;" v-show="item1.isshow==true"
									@click="showless(item1)"></image>
								<image src="../../static/showless.png" mode="widthFix"
									style="width:64upx;height: 64upx; ;margin-right:20upx ;" @click="showmore(item1)"
									v-show="item1.isshow==false"></image>

								<image src="../../static/todetail.png" mode="widthFix" style="width:64upx ;"
									@click="toDetail(item1.id,item1.img,item1.dictValue)"></image>
							</view>
							<!-- <view class="arrow">详情
							<image src="../../static/arrow1.png" mode="widthFix"></image>
						</view> -->
							<!-- <image :src="item1.arrow" mode="widthFix" class="arrow"></image> -->
						</view>
						<transition name="fade" class="fade">
							<view class="wrapper_item_container" v-show='item1.isshow' transiton="fade">
								<view class="th">
									<view class="line1 line" style="color:#5481EA">
										项目
									</view>
									<view class="line2 line" style="color:#5481EA">
										浮点数
									</view>
									<view class="line3 line" style="color:#5481EA">
										要求范围
									</view>
									<view class="line4 line" style="color:#5481EA">
										单位
									</view>
								</view>
								<view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2">
									<view class="line1 line">
										{{item2.name}}
									</view>
									<view class="line2 line" :style="{color:item2.color}">
										{{item2.val}}

									</view>
									<view class="line3 line" v-if='item2.lowVal&&item2.faultVal'>
										{{item2.lowVal}}~{{item2.faultVal}}
									</view>
									<view class="line3 line" v-else>

									</view>
									<view class="line4 line">
										{{item2.unit}}
									</view>
								</view>
							</view>
						</transition>
					</view>
			</view>

			<!-- 内容列表 结束 -->
			<!-- 视频监控开始 -->
			<view class="monitor_list" v-else>
				<view class="monitor_item" v-for="(item,index) in monitorList" :key='index'>
					<view class="pic">
						<image class="monitor_cover" :src="item.src" mode="aspectFill"></image>
						<image class="btn_play" src="../../static/btn_play.png" mode="widthFix"></image>
					</view>
					<view class="monitor_title">{{item.title}}</view>
					<view class="monitor_date">{{item.date}}</view>

				</view>
			</view>
			<!-- 视频监控结束 -->

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
				// 显示卡片id
				showIdList: [],
				// 背景图
				homebg: '',
				workshopName: '',
				// 头部车间列表
				switchList: [],
				// 监控项
				ismonitor: false,
				// 是否有子列表
				isChild: 0, //负责子列表的显示与隐藏
				// 子列表标题
				ChildListTitle: [],
				// 当前head状态栏下标
				currentheaderIndex: 0,
				// 当前子列表下标
				currentChildIndex: 0,
				// 子列表内容
				ChildList: [],
				// 计时器
				timer: null,
				banner1,
				banner2,
				banner3,
				swiperList: [],
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
				wrapperList1: [],
				monitorList: [{
						src: '../../static/banner1.png',
						title: '监控视频监控视频监控视频监控视频监控视频监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner2.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner1.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner1.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner2.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner1.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner1.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner2.png',
						title: '监控视频',
						date: '2020-01-02'
					},
					{
						src: '../../static/banner1.png',
						title: '监控视频',
						date: '2020-01-02'
					},
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
			// 显示卡片
			showmore(item) {
				console.log('showmore');
				this.$nextTick(() => {
					item.isshow = true;
					this.wrapperList1.push()
				})
				this.showIdList.push(item.id)
				console.log(this.showIdList);
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild)
			},
			// 隐藏卡片
			showless(item) {
				item.isshow = true;
				console.log('showless', item.id);
				this.showIdList = this.showIdList.filter(item1 => item1 != item.id);
				console.log(this.showIdList);
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild)
			},
			switchHead(index, item) {
				//console.log(item.dictValue)
				this.workshopName = item.dictValue
				this.currentheaderIndex = index
				this.isChild = item.isChild
				// 内容列表
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild)
				// 轮播图
				this.swiperList = this.switchList[this.currentheaderIndex].img.split(',')


			},
			switchChildList(index) {
				this.currentChildIndex = index;
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, 1)

			},
			toogle(index) {
				// this.wrapperList1[index].toogleflag = !this.wrapperList1[index].toogleflag;
				// this.wrapperList1[index].arrow = this.wrapperList1[index].toogleflag ? '../../static/uparrow.png' :
				// 	'../../static/downarrow.png'
			},
			// 获取内容列表
			getwrapperList(id, child) {
				if (this.timer) {
					console.log(this.timer)
					clearInterval(this.timer);
				}
				this.api.getwrapperList({
					id: id
				}).then(res => {
					if (child) {
						console.log('child', this.currentChildIndex);
						this.ChildListTitle = res.map(item => item.dictValue)
						this.wrapperList1 = res[this.currentChildIndex].children;
						// 为每个卡片添加一个isshow字段用于显示隐藏卡片
						for (let item of this.wrapperList1) {
							item.isshow = false;
						}
						for (let item of this.wrapperList1) {

							if (this.showIdList.indexOf(item.id) > -1) {

								item.isshow = true;

							}

						}
					} else {
						this.wrapperList1 = res;
						// 为每个卡片添加一个isshow字段用于显示隐藏卡片
						for (let item of this.wrapperList1) {
							item.isshow = false;
						}
						for (let item of this.wrapperList1) {
							if (this.showIdList.indexOf(item.id) > -1) {
								item.isshow = true;
							}
						}
						this.wrapperList1.push();
						// console.log(this.wrapperList1);
					}

				})
				// 10s轮询
				this.timer = setInterval(() => {
					this.api.getwrapperList({
						id: id
					}).then(res => {
						if (child) {
							this.ChildListTitle = res.map(item => item.dictValue)
							this.wrapperList1 = res[this.currentChildIndex].children;
							// 为每个卡片添加一个isshow字段用于显示隐藏卡片
							for (let item of this.wrapperList1) {
								item.isshow = false;
							}
							for (let item of this.wrapperList1) {
								if (this.showIdList.indexOf(item.id) > -1) {
									item.isshow = true;
								}
							}
						} else {
							this.wrapperList1 = res;
							// 为每个卡片添加一个isshow字段用于显示隐藏卡片
							for (let item of this.wrapperList1) {
								item.isshow = false;
							}
							for (let item of this.wrapperList1) {
								if (this.showIdList.indexOf(item.id) > -1) {
									item.isshow = true;
								}
							}
							this.wrapperList1.push();
							// console.log(this.wrapperList1);
						}

					})

				}, 10000)


			},
			toDetail(id, banner, title) {
				console.log(title)
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}&banner=${banner}&title=${this.workshopName+'>'+ title}`
				})
			},



		},
		components: {},
		async onLoad() {

			// 轮播图
			// this.api.getbanner()
			// 	.then(banners => {
			// 		this.swiperList = banners.records.map(item => item.img)
			// 	})
			let data = await this.api.gethomebg()
			this.homebg = data[0].img;
			console.log(134, this.homebg);

		},
		async onShow() {
			// 头部切换栏列表
			this.switchList = await this.api.getheadswitchList()
			// isChild赋值
			this.isChild = this.switchList[0].isChild
			this.switchHead(0, this.switchList[0])
		},
		onHide() {
			if (this.timer) {
				clearInterval(this.timer);
			}

		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages_index {
		width: 100%;
		min-height: 100vh;
		background-color: #ecf0f1;
		// padding-top: calc(var(--status-bar-height) + 10upx);

		.container {
			width: 100%;

			// padding-top: calc(var(--status-bar-height) + 92upx);
			.fade-enter-active,
			.fade-leave-active {
				transition: opacity .5s ease-out;
			}

			.fade-enter,
			.fade-leave-active {
				opacity: 0
			}

			.hidden {
				top: 0;
				position: fixed;
				z-index: 100;
				// background-color: #2957C4;
				background-color: #0984e3;
				height: calc(var(--status-bar-height) +86upx);
				// overflow: hidden;
				width: 100%;

				.head_switch {
					// position: fixed;
					// margin-top: calc(var(--status-bar-height) + 10upx);
					// z-index: 100;
					background-color: #0984e3;
					width: 100%;
					padding: 20upx 0;
					// height: 76upx;
					// padding-bottom: 12upx;
					overflow-x: scroll;
					overflow-y: hidden; // display: flex;
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

				.head_switch::-webkit-scrollbar {
					display: none;
				}
			}

			.indexbg {
				width: 750upx;
				height: 592upx;
				// background: url('~@/static/homebg.png') no-repeat;
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}

			.swiper {
				margin: 0 auto;
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
				margin-top: -60upx;
				width: 750upx;
				box-sizing: border-box;
				// margin:30upx 0;
				padding: 60upx 30upx;
				// padding: 30upx 20upx;
				border-radius: 60upx;

				background: #FAFAFA;

				.child_hidden {
					top: calc(var(--status-bar-height) + 86upx);
					position: sticky;
					// z-index: 100;
					background: #F9F9F9;
					height: 100upx;
					// overflow: hidden;
					width: 100%;

					.child_switch {
						// position: fixed;
						// margin-top: 10upx;
						// z-index: 100;
						background: #F9F9F9;
						width: 100%;
						height: 100upx;
						// padding-bottom: 12upx;
						overflow-x: scroll;
						overflow-y: hidden;
						// display: flex;
						// align-items: center;
						white-space: nowrap;

						.child_switch_item {
							display: inline-block;
							padding: 0 23upx;
							height: 100upx;
							line-height: 100upx;
							font-size: 28upx;
							font-weight: 400;
							// color: #ecf0f1;
							color: #999999;
							opacity: 0.64;
						}

						.active_child {
							position: relative;
							font-size: 28upx;
							height: 100upx;
							font-weight: 600;
							color: #2957C4;
							opacity: 1;
							transition: 0.3s;
						}

						.active_child::after {
							position: absolute;
							bottom: 18upx;
							left: 50%;
							transform: translateX(-50%);
							content: "";
							width: 50upx;
							height: 6upx;
							background: #2957C4;
							opacity: 1;
							border-radius: 6upx;
						}
					}

					.child_switch::-webkit-scrollbar {
						display: none;
					}
				}



				.wrapper_item {
					box-sizing: border-box;
					width: 690upx;
					margin-bottom: 40upx;
					padding: 30upx;
					//border-radius: 100upx;
					background-color: #fff;
					// box-shadow: 0 0 30upx rgba(0,0,0,.2);

					.wrapper_item_title {
						width: 100%;
						// padding:0 20upx;
						// box-sizing: border-box;
						// border-left: 8upx solid #5481EA;
						color: #5481EA;
						// padding: 20upx;
						// margin-bottom: 40upx;
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;
						// height: 34upx;
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





					.wrapper_item_container {
						background: #fff;
						width: 100%;
						box-sizing: border-box;


						// padding: 0 20upx;
						.th {
							display: flex;
							padding: 16upx 20upx;
							// background: #C7E3FF;
							color: #5481EA;
							border-bottom: 1px solid #E4EAEE;
						}

						.wrapper_item_item:nth-child(odd) {
							// background-color: #F1F1F1;
						}

						.wrapper_item_item:nth-child(even) {
							// background-color: #F9F9F9;
						}

						.wrapper_item_item {
							display: flex;
							align-items: center;
							padding: 16upx 20upx;


						}

						.line {
							color: #333333;
							font-size: 30upx;

						}

						.line1 {
							flex: 20;
						}

						.line2 {
							flex: 8;
							text-align: center;
						}

						.line3 {
							flex: 14;
							text-align: center;
						}

						.line4 {
							flex: 8;
							text-align: center;
						}
					}



				}
			}

			.monitor_list {
				padding: 20upx;
				box-sizing: border-box;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				align-content: center;

				.monitor_item {
					width: 316upx;
					height: 360upx;
					margin: 19upx;
					box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);

					.pic {
						position: relative;

						.monitor_cover {
							width: 316upx;
							height: 228upx;
							border-radius: 20upx 20upx 0upx 0upx;
						}

						.btn_play {
							width: 116upx;
							position: absolute;
							left: 0;
							bottom: 0;
							transform: translateY(50%);
						}
					}

					.monitor_title {
						width: 100%;
						box-sizing: border-box;
						font-size: 28upx;
						font-weight: 500;
						// line-height: 16upx;
						color: #606060;
						height: 40upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-top: 38upx;
						padding-left: 20upx;

					}

					.monitor_date {
						font-size: 24upx;
						font-weight: 400;
						// line-height: 16upx;
						color: #999999;
						padding-left: 20upx;
					}
				}
			}


		}
	}
</style>
