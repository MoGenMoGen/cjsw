<template>

	<view class="pages_trend">
		<view class="fixed">
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
			<!-- 下拉开始 -->
			<view class="selectbox">
				<!-- 控制折线图的下拉框 -->
				<!-- <view class="pickers"> -->
				<picker mode="selector" :range="categories" @change="handleChangeCategory" range-key='dictValue'>
					<view class="select">
						<text v-if="index1<0" style="color:#C0C4CC">按类别</text>
						<text v-else>{{categories[index1].dictValue}}</text>
						<image src="../../static/downarrow.png" mode="widthFix" style="width:24upx;">
						</image>
					</view>
				</picker>

				<picker mode="selector" :range="crafts" @change="handleChangecraft" range-key='dictValue'>
					<view class="select">
						<text v-if="index2<0" style="color:#C0C4CC">按工艺</text>
						<text v-else>{{crafts[index2].dictValue}}</text>
						<image src="../../static/downarrow.png" mode="widthFix" style="width:24upx;">
						</image>
					</view>

				</picker>
				<view class="timebox">
					<u-picker v-model="show1" mode="time" :params="params" @confirm="confirm1" title="选择开始时间" ></u-picker>
					<view class="time" @click='show1=true'>
						{{starttime}}
					</view>
					~
					<u-picker v-model="show2" mode="time" :params="params" @confirm="confirm2" title="选择结束时间"></u-picker>
					<view class="time" @click='show2=true'>
						{{endtime}}
					</view>
				</view>
			</view>
			<!-- 下拉结束-->
			<view class="chartBox">
				<iframe :src="url" width="100%" v-if="subsectionShow" height="160" frameborder="no" border="0">
				</iframe>
				<u-subsection bg-color="#ecf0f1" height="50" @change="sectionChange" v-if="subsectionShow" :list="list" :current="current">
				</u-subsection>

			</view>
			<!-- <view class="total" v-show="isTotal">
				<l-echart ref="chartAll" class="echarts"></l-echart>
				<view class="del" @click.stop="closeTotal">
					关闭
				</view>
			</view> -->
		</view>

		<!-- 与首页相同的内容区域 -->
		<view class="wrapper_list" :style="{'margin-top': (isChild?'calc(256upx  + 300upx)':'calc(156upx + 300upx)')}">
			<checkbox-group @change="checkboxChange">
				<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
					<view class="wrapper_item_title" @click="toDetail(item1.id,item1.img,item1.dictValue)">
						<view class="title_text">
							{{item1.dictValue}}
						</view>
						<view class="arrow">详情
							<image src="../../static/arrow1.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="wrapper_item_container">
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
						<!-- <view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2"
						@click="active(item2.addr)" :style="{'background-color':(item2.checked?item2.color:'')}"> -->
						<view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2">
							<view class="checkBox">
								<checkbox :value="item2.addr" :checked="item2.checked" />
							</view>
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
			</checkbox-group>
		</view>
		<!-- 内容列表 结束 -->


	</view>
</template>





<script>
	import choosedate from "../../components/choosedate.vue"
	import moment from "moment";
	export default {
		data() {
			return {
				subsectionShow: false,
				map: new Map(),
				list: [],
				current: 0,
				url: '',
				workshopName:'',
				// 页面显示的开始结束时间
				starttime: 'ff',
				endtime: 'ff',
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				show1: false,
				show2: false,
				isTotal: false,
				categories: [],
				index1: -1,
				index2: -5,
				crafts: [],
				// 传给后台的开始结束时间
				st: '',
				et: '',
				sites: null,
				timer: null,
				// 类别id
				categoryID: '',
				// 工艺id
				craftID: '',
				// 选中编号数组
				AddrCheckedArray: [],
				// 头部车间列表
				switchList: [],
				// 是否有子列表
				isChild: 0, //负责子列表的显示与隐藏
				// 子列表标题
				ChildListTitle: [],
				// 当前head状态栏下标
				currentheaderIndex: 0,
				// 当前子列表下标
				currentChildIndex: 0,
				wrapperList1: [],

			}
		},

		methods: {
			setUrlVal(sites, st, et) {
				//this.url = 'http://192.168.38.254/demo/fund/trend-no-deal-landscape.html?sites=' + sites + '&st=' +	st + '&et=' + et
				this.url = 'http://10086.jinkworld.com/demo/fund/trend-no-deal-landscape.html?sites=' + sites + '&st=' +	st + '&et=' + et
				
			},
			sectionChange(index) {
				this.current = index;
				this.setUrlVal(this.list[index].sites, this.st, this.et)
				
			},
			confirm1(e) {
				this.st = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
				this.starttime = `${e.month}-${e.day} ${e.hour}:${e.minute}`
				this.show2 =true
			},
			confirm2(e) {
				if (moment(`${this.st}`).valueOf() > moment(
						`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`).valueOf()) {
					uni.showToast({
						title: '开始时间需小于结束时间',
						icon: "none",
						duration: 2000
					})
					return false;
				} 
				// else if ((moment(`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`).valueOf() - moment(
				// 			`${this.st}`)
				// 		.valueOf()) * len > 129600000) {
				// 	uni.showToast({
				// 		title: '总时间需小于36h',
				// 		icon: "none",
				// 		duration: 2000
				// 	})
				// 	return false;
				// }
				this.et = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
				this.endtime = `${e.month}-${e.day} ${e.hour}:${e.minute}`
				if(this.list.length > 0){
					this.setUrlVal(this.list[this.current].sites, this.st, this.et)
				}
			},
			showTotal() {
				this.isTotal = true
				uni.hideTabBar({})

			
			},
			closeTotal() {
				this.isTotal = false;
				uni.showTabBar({

				})
			},
			switchHead(index, item) {
				this.workshopName = item.dictValue
				this.currentheaderIndex = index
				this.isChild = item.isChild
				// 内容列表
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild)
			},
			switchChildList(index) {
				// 清空选中编号
				this.AddrCheckedArray = [];
				this.currentChildIndex = index;
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, 1)

			},
			// 按类别下拉框修改下标
			handleChangeCategory(e) {
				this.index1 = e.target.value;
				this.categoryID = this.categories[this.index1].id
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild, this.categoryID, this
					.craftID)
			},
			handleChangecraft(e) {
				this.index2 = e.target.value;
				this.craftID = this.crafts[this.index2].id
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild, this.categoryID, this
					.craftID)
			},
			getdateA(a) {
				this.st = a.startDate;
				this.et = a.endDate;
				this.getsiteValList()
			},
			toDetail(id, banner, title) {
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}&banner=${banner}&title=${this.workshopName+'>'+ title}`
				})
			},
			//选中参数
			checkboxChange: function(e) {
				let len = e.detail.value.length;
				// if (len > 5) {
				// 	uni.showToast({
				// 		title: '最多不超过5条',
				// 		icon: "none",
				// 		duration: 2000
				// 	})
				// 	return false;
				// }
				// else if ((moment(`${this.et}`).valueOf() - moment(`${this.st}`)
				// 		.valueOf()) * len > 129600000) {
				// 	uni.showToast({
				// 		title: '总时间需小于36h',
				// 		icon: "none",
				// 		duration: 2000
				// 	})
				// 	return false;
				// }
				if (len !== 0) {
					//所有选中的编号
					this.AddrCheckedArray = e.detail.value;
					// 请求中的sites重新赋值为数组的','分割字符串
					//this.sites = this.AddrCheckedArray.join(',')
					this.siteGrouping(e.detail.value)
				} else {
					this.subsectionShow = false
				}

			},
			//相同单位分组显示
			siteGrouping(arr) {
				this.subsectionShow = false
				let mp = new Map()
				arr.map(addr => {
					let unit = this.map.get(addr)
					if (mp.has(unit)) {
						//追加
						let addrArrOld = mp.get(unit)
						addrArrOld.push(addr)
						mp.set(unit, addrArrOld)
					} else {
						//首次添加
						let addrArr = []
						addrArr.push(addr)
						mp.set(unit, addrArr)
					}
				})
				let group = []
				mp.forEach(function(value, key) {
					let item = {
						name: key,
						sites: value.join(',')
					}
					group.push(item)
				});
				this.list = group
				this.$nextTick(() => {
					this.subsectionShow = true
				});
				this.setUrlVal(this.list[this.current].sites, this.st, this.et)
			},



			// 获取内容列表
			getwrapperList(id, child, categoryID, craftID) {
				this.subsectionShow = false
				if (this.timer) {
					clearInterval(this.timer);
				}
				this.setAddrMap(id)
				this.api.getwrapperList({
					id: id,
					siteType: categoryID,
					siteName: craftID
				}).then(res => {

					// if (this.AddrCheckedArray.length > 0) {
					// 	// 用选中数组中的编号中的checked去替换响应数据中的checked
					// 	for (let itemCk of this.AddrCheckedArray) {
					// 		for (let itemtask of res) {
					// 			itemtask.sites = itemtask.sites.map(itemaddr => {
					// 				if (itemCk == itemaddr.addr) {
					// 					itemaddr.checked = true;
					// 				}
					// 				return itemaddr;
					// 			})
					// 		}
					// 	}
					// }
					if (child) {
						this.ChildListTitle = res.map(item => item.dictValue)
						this.wrapperList1 = res[this.currentChildIndex].children
						// console.table(this.ChildListTitle);
						// console.log({
						// 	childindex: this.currentChildIndex
						// });
					} else
						this.wrapperList1 = res
				})
				// 10s轮询
				this.timer = setInterval(() => {
					this.api.getwrapperList({
						id: id,
						siteType: categoryID,
						siteName: craftID
					}).then(res => {
						if (this.AddrCheckedArray.length > 0) {
							// 用选中数组中的编号中的checked去替换响应数据中的checked
							for (let itemCk of this.AddrCheckedArray) {
								for (let itemtask of res) {
									itemtask.sites = itemtask.sites.map(itemaddr => {
										if (itemCk == itemaddr.addr) {
											itemaddr.checked = true;
										}
										return itemaddr;
									})
								}
							}
						}
						if (child) {
							this.ChildListTitle = res.map(item => item.dictValue)
							this.wrapperList1 = res[this.currentChildIndex].children
						} else
							this.wrapperList1 = res
					})

				}, 10000)

			},
			setAddrMap(id) {
				this.map = new Map()
				this.api.getAllSiteByWid({
					wid: id,
				}).then(res => {
					if(res.length > 0){
						res.map(item => {
							if (item.unit != null && item.addr != null) {
								this.map.set(item.addr, item.unit)
							}
						})
					}
				})
			}


		},

		components: {
			choosedate
		},
		onReady() {
			this.starttime = moment().format("MM-DD 00:00");
			this.endtime = moment().format("MM-DD HH:mm");
		},
		async onLoad() {
			// console.log('onload');
			this.st = `${moment().format("YYYY-MM-DD")} 00:00:00`
			this.et = moment().format("YYYY-MM-DD HH:mm:ss")
		},
		async onShow() {
			// console.log('trend onshow');
			this.categories = await this.api.getdictionary({
				code: 'site_type'
			})
			this.categories.unshift({
				dictValue: '全部'
			})

			// 头部切换栏列表
			this.switchList = await this.api.getheadswitchList()
			// console.log(this.switchList);
			// isChild赋值
			this.isChild = this.switchList[0].isChild
			this.crafts = await this.api.getcraftList({
				pid: this.switchList[this.currentheaderIndex].id
			})
			this.crafts.unshift({
				dictValue: '全部'
			})
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
		},
		mounted() {

			// this.$refs.chart.init(config => {
			// 	const {
			// 		canvas
			// 	} = config;
			// 	const chart = echarts.init(canvas, null, config);
			// 	chart.setOption(this.option);
			// 	window.onresize = () => {
			// 		chart.resize()
			// 	}
			// 	return chart;
			// });

			// setTimeout(() => {
			// 	this.$refs.chartAll.init(config => {
			// 		const {
			// 			canvas
			// 		} = config;
			// 		const chart = echarts.init(canvas, null, config);
			// 		chart.setOption(this.option);
			// 		window.onresize = () => {
			// 			chart.resize()
			// 		}
			// 		return chart;
			// 	});
			// }, 1000)



		}
	}
</script>
<style lang="scss" scoped>
	.pages_trend {
		width: 100%;
		background-color: #ecf0f1;
		min-height: 100vh;

		.fixed {
			border-bottom: 1px solid rgba(0, 0, 0, .1);
			background-color: #FFF;
			width: 100%;
			position: fixed;
			top: var(--window-top);
			// padding-bottom:30upx;
			// height: 600upx;
			z-index: 100;

			.hidden {
				// background-color: #2957C4;
				background-color: #0984e3;
				height: calc(var(--status-bar-height) +86upx);
				// overflow: hidden;
				width: 100%;

				.head_switch {
					// position: fixed;
					// margin-top: calc(var(--status-bar-height) + 10upx);
					// z-index: 100;
					// background-color: #2957C4;
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

			.child_hidden {
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

			.selectbox {
				padding: 10upx;
				margin: 10upx;
				width: 710upx;
				height: 60upx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				// .pickers {
				// 	display: flex;
				// 	justify-content: center;

				.select {
					width: 150upx;
					overflow: hidden;
					height: 60upx;
					margin-right: 10upx;
					// padding: 10upx;
					// display: inline-block;
					// margin: 10upx;
					// width: 212upx;
					// height: 60upx;
					border: 2upx solid #1989FA;
					opacity: 1;
					border-radius: 16upx;
					display: flex;
					align-items: center;

					// justify-content: space-around;
					text {
						// box-sizing: border-box;
						width: 130upx;
						padding-left: 10upx;
						overflow: hidden;
						white-space: nowrap;
						font-size: 28upx;
						// text-overflow: ellipsis;
					}

					image {

						// padding: 2upx;
					}
				}

				.timebox {
					width: 350upx;
					border-radius: 16upx;
					border: 2upx solid #1989FA;
					display: flex;
					align-items: center;
					justify-content: center;

					.time {
						height: 60upx;
						line-height: 60upx;
						// font-size: 32upx;
						font-size: 28upx;
					}
				}

				// }
			}



			.chartBox {
				// width: 600upx;
				height: 330upx;


			}

			.total {

				position: absolute;
				top: -100vw;
				// top: -300px;
				transform-origin: bottom left;
				width: 100vh !important;
				height: 100vw !important;
				// width: 300px;
				// height:300px;
				transform: rotate(90deg);
				transition: 0.5s;
				background: #fff;
				z-index: 100;

				.del {
					position: absolute;
					top: 10upx;
					right: 10upx;
					border: 1px solid #fff;
					z-index: 199;
				}

				.echarts {
					// transform: rotate(90deg);
					// width: 100vh !important;
					// height: 100vw !important;

					z-index: 150;
				}
			}

			// .content {
			// 	display: flex;
			// 	flex-direction: column; 




			// 	align-items: center;
			// 	justify-content: center;
			// 	width: 100%;

			// 	.echarts {
			// 		margin-top: 20upx;
			// 		width: 100%;
			// 		height: 470upx;
			// 	}
			// }
		}


		.wrapper_list {
			width: 710upx;
			box-sizing: border-box;
			margin: 30upx 20upx;
			padding-top: 80upx;

			.wrapper_item {
				box-sizing: border-box;
				width: 710upx;
				margin-bottom: 40upx;
				padding: 20upx;
				border-radius: 30upx;
				background-color: #fff;

				.wrapper_item_title {
					// box-shadow: 0 0 3px rgba(0,0,0,.1);
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
					height: 34upx;
					font-size: 32upx;

					.title_text {
						color: #5481EA;
						font-size: 32upx;
					}


					.arrow {
						padding-right: 20upx;
						width: 100upx;
						color: #5481EA;
						font-size: 32upx;
						position: relative;

						image {
							position: absolute !important;
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
						padding: 10upx 20upx;
						// padding-left:50upx;
						// padding-left: 70upx;

						background: #C7E3FF;
						color: #5481EA;

						.line {
							text-align: center;
							// padding-left: 40upx;
							// box-sizing: border-box;
							// color: #333333;
							// font-size: 30upx;
						}
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

					.active {
						box-shadow: 0 0 10upx rgba(0, 0, 0, .5);
					}
				}



			}
		}
	}
</style>
