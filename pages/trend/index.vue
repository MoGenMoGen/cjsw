<template>

	<view class="pages_trend">
		<view class="fixed">
			<!-- 头部切换栏 开始 -->
			<!-- 隐藏滚动条 -->

			<view class="hidden">
				<view class="head_switch">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(index,item.isChild)" :class="{activeheader:index==currentheaderIndex}">
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
			<!-- 控制折线图的下拉框 -->
			<view class="pickers">
				<picker mode="selector" :range="categories" @change="handleChangeCategory" range-key='dictValue'>
					<view class="select">
						<view v-if="index1<0" style="color:#C0C4CC">按类别</view>
						<view v-else>{{categories[index1].dictValue}}</view>
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
			</view>
			<view style="width:750upx">
				<choosedate @func="getdateA" :CheckedCount='AddrCheckedArray.length'></choosedate>
			</view>
			<view class="chartBox" @click="showTotal" :class="{'total': isTotal}">
				<l-echart ref="chart" class="ehcarts"></l-echart>
				<view class="del" v-if='isTotal' @click.stop="closeTotal">
					关闭
				</view>
			</view>
		</view>

		<!-- 与首页相同的内容区域 -->
		<view class="wrapper_list" :style="{'padding-top': (isChild?'calc(352upx  + 500upx)':'calc(252upx + 500upx)')}">
			<checkbox-group @change="checkboxChange">
			<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
				<view class="wrapper_item_title" @click="toDetail(item1.id)">
					{{item1.dictValue}}
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
							<view class="line2 line">
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
	import * as echarts from '@/uni_modules/lime-echart_0.3.4/components/l-echart/echarts.min';
	import moment from "moment";
	export default {
		data() {
			return {
				isTotal: false,
				categories: ['温度类', '压力类', '温度类', '压力类', '温度类', '压力类'],
				index1: -1,
				index2: -5,
				crafts: ['前处理预脱', '前处理主脱', '前处理水洗'],
				st: '',
				et: '',
				sites: "",
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
				wrapperList1: [{
						dictValue: "前处理预脱",
						sites: [{
								name: '1.喷淋管道压力',
								val: '浮点数',
								unit: 'Bar',
								addr: 'dfdfaf'
							},
							{
								name: '2.频率',
								val: '浮点数',
								unit: 'Hz',
								addr: 'dfdfafdff'
							},
							{
								name: '3.电机温度',
								val: '浮点数',
								unit: 'A',
								addr: 'dfdfafedftwe'
							},
						]
					}

				],

				option: {
					title: {
						left: 'center',
						// text: '趋势分析图',
						// subtext: '"tootip" and "dataZoom" on mobile device',
					},
					legend: {
						top: 'bottom',
						data: ['意向']
					},
					tooltip: {
						triggerOn: 'none',
						position: ['10%', '20%']
						// position: function(pt) {
						// 	return [pt[0], 10];
						// }
					},
					// toolbox: {
					//     left: 'center',
					//     itemSize: 25,
					//     top: 55,
					//     feature: {
					//         dataZoom: {
					//             yAxisIndex: 'none'
					//         },
					//         restore: {}
					//     }
					// },
					xAxis: {
						type: 'time',
						show: true,
						// boundaryGap: [0, 0],+
						axisLabel: {
							interval: 0, // 坐标轴刻度标签的显示间隔
							rotate: 40, // 标签倾斜的角度
							show: false,
						},

						axisPointer: {
							value: '2020-01-03',
							snap: true,
							lineStyle: {
								color: '#7581BD',
								width: 2
							},
							label: {
								show: false,
								formatter: function(params) {
									return echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', params.value);
								},
								backgroundColor: '#7581BD'
							},
							handle: {
								show: true,
								color: '#7581BD',
								margin: 20,
								size: [30, 30]
							}
						},
						splitLine: {
							show: false
						}
					},
					yAxis: {
						type: 'value',
						axisTick: {
							inside: true
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							inside: true,
							formatter: '{value}\n'
						},
						z: 10
					},
					grid: {
						// show:true,
						top: 50,
						left: 15,
						right: 15,
						height: 160
					},
					dataZoom: [{
						type: 'inside',
						start: 0,
						end: 10,
					}, {
						start: 0,
						end: 10,
						top: '3%'
					}],
					// dataZoom: [{
					// 	type: 'inside',
					// 	throttle: 50
					// }],
					series: [
						// {
						// 	name: '模拟数据',
						// 	type: 'line',
						// 	smooth: true,
						// 	symbol: 'circle',
						// 	symbolSize: 5,
						// 	sampling: 'average',
						// 	itemStyle: {
						// 		color: '#0770FF'
						// 	},
						// 	stack: 'a',
						// 	areaStyle: {
						// 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						// 			offset: 0,
						// 			color: 'rgba(58,77,233,0.8)'
						// 		}, {
						// 			offset: 1,
						// 			color: 'rgba(58,77,233,0.3)'
						// 		}])
						// 	},
						// 	data: [
						// 		['2020-01-01 10:00', 95],
						// 		['2020-01-02 10:00', 45],
						// 		['2020-01-03 10:00', 30],
						// 		['2020-01-04 10:00', 60],
						// 		['2020-01-05 10:00', 100],
						// 		['2020-01-06 10:00', 195],
						// 		['2020-01-07 10:00', 425],
						// 		['2020-01-08 10:00', 320],
						// 		['2020-01-09 10:00', 330],
						// 		['2020-01-10 10:00', 430]
						// 	]
						// },
						// {
						// 	name: '模拟数据',
						// 	type: 'line',
						// 	smooth: true,
						// 	stack: 'a',
						// 	symbol: 'circle',
						// 	symbolSize: 5,
						// 	sampling: 'average',
						// 	itemStyle: {
						// 		color: '#F2597F'
						// 	},
						// 	areaStyle: {
						// 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						// 			offset: 0,
						// 			color: 'rgba(213,72,120,0.8)'
						// 		}, {
						// 			offset: 1,
						// 			color: 'rgba(213,72,120,0.3)'
						// 		}])
						// 	},
						// 	data: [
						// 		['2020-01-01 10:00', 55],
						// 		['2020-01-02 10:00', 75],
						// 		['2020-01-03 10:00', 10],
						// 		['2020-01-04 10:00', 90],
						// 		['2020-01-05 10:00', 60],
						// 		['2020-01-06 10:00', 155],
						// 		['2020-01-07 10:00', 175],
						// 		['2020-01-08 10:00', 110],
						// 		['2020-01-09 10:00', 190],
						// 		['2020-01-10 10:00', 160],
						// 	]
						// }
					]
				}



			}
		},

		methods: {

			showTotal() {
				console.log(11);
				this.isTotal = true
				uni.hideTabBar({

				})
				this.$refs.chart.setOption(this.option, true)
			},
			closeTotal() {
				console.log(22);
				this.isTotal = false;
				uni.showTabBar({

				})
			},
			switchHead(index, child) {
				console.log('switchhead');
				this.currentheaderIndex = index
				this.isChild = child;
				// 内容列表
				this.getwrapperList(this.switchList[this.currentheaderIndex].id, child)
				// 轮播图
				this.swiperList = this.switchList[this.currentheaderIndex].img.split(',')


			},
			switchChildList(index) {
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
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}`
				})
			},
			checkboxChange: function(e) {
				// console.log(e.detail.value);
				//    var items = this.items,
				//        values = e.detail.value;
				//    for (var i = 0, lenI = items.length; i < lenI; ++i) {
				//        const item = items[i]
				//        if(values.includes(item.value)){
				//            this.$set(item,'checked',true)
				//        }else{
				//            this.$set(item,'checked',false)
				//        }
				//    }


				if (e.detail.value.length >= 10) {
					uni.showToast({
						title: '最多不超过10条',
						icon: "none",
						duration: 2000
					})
					return false;
				}
				//所有选中的编号 
				this.AddrCheckedArray = e.detail.value;
				// 请求中的sites重新赋值为数组的','分割字符串
				this.sites = this.AddrCheckedArray.join(',')
				console.log(11111111,this.sites);
				this.getsiteValList(true)
			},



			// // 选中编号
			// active(addr) {

			// 	// 判断数组中是否有该编号
			// 	let flag = false;
			// 	for (let item of this.AddrCheckedArray) {
			// 		if (item == addr) {
			// 			flag = true;
			// 			break;
			// 		}
			// 	}
			// 	// 取消选中
			// 	if (flag) {
			// 		// 1.删除选中数组中该编号
			// 		this.AddrCheckedArray = this.AddrCheckedArray.filter(item => item != addr)

			// 		// 重新请求内容接口修改选中状态，不用循环内容数组修改选中状态
			// 		// 先清空定时器
			// 		this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild,this.categoryID,this.craftID)
			// 		// 请求中的sites重新赋值为数组的','分割字符串
			// 		this.sites = this.AddrCheckedArray.join(',')
			// 		this.getsiteValList(true)
			// 	} else {
			// 		// 最多不能超过十条
			// 		if (this.AddrCheckedArray.length == 10) {
			// 			uni.showToast({
			// 				title: '最多不超过10条',
			// 				icon: "none",
			// 				duration: 2000
			// 			})
			// 			return false;
			// 		}
			// 		// 选中且不差过10条，向选中编号的数组中添加该编号
			// 		this.AddrCheckedArray.push(addr)

			// 		// 重新请求内容接口修改选中状态，不用循环内容数组修改选中状态
			// 		// 先清空定时器
			// 		this.getwrapperList(this.switchList[this.currentheaderIndex].id, this.isChild,this.categoryID,this.craftID)
			// 		// 请求中的sites重新赋值为数组的','分割字符串
			// 		this.sites = this.AddrCheckedArray.join(',')
			// 		this.getsiteValList()
			// 	}


			// },
			// 获取内容列表
			getwrapperList(id, child, categoryID, craftID) {
				if (this.timer) {
					clearInterval(this.timer);
				}
				console.log('获取内容列表');
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
			// 获取折线图数据
			getsiteValList(flag) {
				// this.api.getsiteValList({sites:'CCF_FAN_VT,CCF_FILTER_DPT1',st:'2021-07-20 18:00:00',et:'2021-07-20 19:00:00'}).then(res=>{
				this.api.getsiteValList({
					sites: this.sites,
					st: this.st,
					et: this.et
				}).then(res => {
					// console.log({res});
					this.option.series = res;
					this.option.series.push()
					// console.log({option:this.option});
					// 是否不跟之前设置的 option 进行合并。默认为 false。即表示合并
					if (flag)
						this.$refs.chart.setOption(this.option, true)
					else
						this.$refs.chart.setOption(this.option)

				})

				// let siteValList = await this.api.getsiteValList({
				// 	sites: this.currentaddr,
				// 	st: this.st,
				// 	et: this.et
				// })

				// console.log(siteValList.date)
				// console.log(siteValList.data)

				// this.option.series[0].data = siteValList.data;
				// this.option.xAxis.data = siteValList.date;
			}


		},
		components: {
			choosedate
		},

		async onLoad() {
			console.log('onload');
			this.st = `${moment().format("YYYY-MM-DD")} 00:00:00`
			this.et = moment().format("YYYY-MM-DD HH:mm:ss")
		},
		async onShow() {
			console.log('trend onshow');
			this.categories = await this.api.getdictionary({
				code: 'site_type'
			})
			this.categories.unshift({
				dictValue: '全部'
			})

			// 头部切换栏列表
			this.switchList = await this.api.getheadswitchList()
			console.log(this.switchList);
			// isChild赋值
			this.isChild = this.switchList[0].isChild
			this.crafts = await this.api.getcraftList({
				pid: this.switchList[this.currentheaderIndex].id
			})
			this.crafts.unshift({
				dictValue: '全部'
			})
			this.switchHead(0, this.isChild)
		},
		onHide() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			console.log('trend onhide');
		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			console.log('trend onunload');
		},
		mounted() {
			console.log('mounted');
			this.$refs.chart.init(config => {
				const {
					canvas
				} = config;
				const chart = echarts.init(canvas, null, config);
				chart.setOption(this.option);
				window.onresize = () => {
					chart.resize()
				}
				return chart;
			});

		}
	}
</script>
<style lang="scss" scoped>
	.pages_trend {
		width: 100%;

		.fixed {

			background-color: #FFF;
			width: 100%;
			position: fixed;
			top: var(--window-top);
			// padding-bottom:30upx;
			// height: 600upx;
			z-index: 100;

			.hidden {
				background-color: #2957C4;
				height: calc(var(--status-bar-height) +86upx);
				// overflow: hidden;
				width: 100%;

				.head_switch {
					// position: fixed;
					// margin-top: calc(var(--status-bar-height) + 10upx);
					// z-index: 100;
					background-color: #2957C4;
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

			.pickers {
				display: flex;
				justify-content: center;

				.select {
					padding: 10upx;
					// display: inline-block;
					margin: 10upx;
					// width: 212upx;
					// height: 60upx;
					border: 2upx solid #1989FA;
					opacity: 1;
					border-radius: 20upx;
					display: flex;
					align-items: center;
					// justify-content: space-around;

					image {

						// padding: 2upx;
					}
				}
			}

			.chartBox {
				// width: 600upx;
				height: 500upx;

				.del {
					position: absolute;
					top: 10upx;
					right: 10upx;
					border: 1px solid #fff;
					z-index: 199;
				}
			}

			.total {

				position: absolute;
				top: -100vw;
				transform-origin: bottom left;
				width: 100vh !important;
				height: 100vw !important;
				transform: rotate(90deg);
				transition: 0.5s;
				background: #fff;
				z-index: 100;

				.ehcarts {
					// transform: rotate(90deg);
					// width: 100vh !important;
					// height: 100vw !important;
					z-index: 150;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 100%;

				.echarts {
					margin-top: 20upx;
					width: 100%;
					height: 470upx;
				}
			}
		}


		.wrapper_list {
			// padding-top: calc(362upx + var(--status-bar-height) + 250px);
			margin-top: var(--status-bar-height);
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
						padding-left: 70upx;

						background: #C7E3FF;
						color: #5481EA;

						.line {
							color: #333333;
							font-size: 30upx;
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
<template>
	<view class="pages_trend">
		<view class="fixed"> 
			<view class="" style="width:750upx">
				<choosedate @func="getdateA"></choosedate>
			</view>
			<view class="content">
				<!-- #ifdef APP-PLUS || H5 -->
				<view @click="echarts.onClick" :prop="option" :change:prop="echarts.updateEcharts" id="echarts"
					class="echarts"></view>
				<!-- <button @click="changeOption">更新数据</button> -->
				<!-- #endif -->
				<!-- #ifndef APP-PLUS || H5 -->
				<view>非 APP、H5 环境不支持</view>
				<!-- #endif -->
			</view>
		</view>

		<view class="wrapper_list">
			<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
				<view class="wrapper_item_title" @click='toogle(index1)'>
					{{item1.dictValue}}
					<view class="arrow">详情
						<image src="../../static/arrow2.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="wrapper_item_container">
					<view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2"
						:class="{active:item2.addr==currentaddr}" @click="active(item2.addr,item2.name)">
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
</template>

<script>
	import choosedate from "../../components/choosedate.vue"
	import moment from "moment";
	export default {
		data() {
			return {
				currentaddr: "00", //当前点位编号
				// site:"CCF_FAN_VT",
				st: '2021-07-21 00:00:00',
				et: '2021-07-21 23:00:00',
				dataList: [],
				wrapperList1: [{
						dictValue: "前处理预脱",
						// toogleflag: false,
						// arrow: '../../static/downarrow.png',
						sites: [{
								name: '1.喷淋管道压力',
								val: '浮点数',
								unit: 'Bar',
								addr: 'dfdfaf'
							},
							{
								name: '2.频率',
								val: '浮点数',
								unit: 'Hz',
								addr: 'dfdfafdff'
							},
							{
								name: '3.电机温度',
								val: '浮点数',
								unit: 'A',
								addr: 'dfdfafedftwe'
							},
						]
					}

				],
				option: {
					tooltip: {
						trigger: 'axis',
						position: function(pt) {
							return [pt[0], '10%'];
						}
					},
					title: {
						left: 'center',
						text: '趋势分析图',
					},
					// toolbox: {
					//     feature: {
					//         dataZoom: {
					//             yAxisIndex: 'none'
					//         },
					//         restore: {},
					//         saveAsImage: {}
					//     }
					// },
					xAxis: {
						type: 'time',
						boundaryGap: false,
						show: false
					},
					yAxis: {
						type: 'value',
						boundaryGap: [0, '100%']
					},
					// dataZoom: [{
					// 	type: 'inside',
					// 	start: 0,
					// 	end: 1
					// },
					// {
					// 	start: 0,
					// 	end: 20
					// },
					// ],
					series: [{
						name: '数值',
						type: 'line',
						smooth: true,
						symbol: 'none',
						areaStyle: {},
						data: []
					}]
				},
			}
		},
		methods: {
			async active(addr, name) {
				console.log(addr, this.currentaddr);
				this.currentaddr = addr
				// 获取折线图数据
				this.option.title.text = name
				this.getsiteValList()
			},
			toogle(index) {
				// this.wrapperList1[index].toogleflag = !this.wrapperList1[index].toogleflag;
				// this.wrapperList1[index].arrow = this.wrapperList1[index].toogleflag ? '../../static/uparrow.png' :
				// 	'../../static/downarrow.png'
			},
			getdateA(a) {
				this.st = a.startDate;
				this.et = a.endDate;
				this.getsiteValList()
			},
			// 获取内容列表
			async getwrapperList(id) {
				let wraplist = await this.api.getwrapperList({
					id: id
				})
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
				// this.chartsDataLine1.series[0].name=wraplist[0].sites[0].name
				// 返回第一项第一行的编号，用于初始化折线图
				return {
					addr: wraplist[0].sites[0].addr,
					name: wraplist[0].sites[0].name
				};
			},
			// 获取折线图数据
			async getsiteValList() {
				// let siteValList=await this.api.getsiteValList({site:'CCF_FAN_VT',st:'2021-06-21 00:00:00',et:'2021-07-21 23:00:00'})
				this.dataList = [];
				let siteValList = await this.api.getsiteValList({
					site: this.currentaddr,
					st: this.st,
					et: this.et
				})
				// this.chartsDataLine1.categories=siteValList.date
				siteValList.data = siteValList.data.map(item => Number(item))
				for (let item of siteValList.date) {
					this.dataList.push([item])
				}
				for (let i = 0; i < siteValList.data.length; i++) {
					for (let j = 0; j < this.dataList.length; j++) {
						if (i == j) {
							this.dataList[j].push(siteValList.data[i])
						}
					}
				}
				this.dataList.push()
				this.option.series[0].data = this.dataList
				console.log(12344543, this.dataList, this.option.series[0].data);
			}


		},
		components: {
			choosedate
		},
		async onLoad() {
			this.st = `${moment().format("YYYY-MM-DD")} 00:00:00`
			this.et = moment().format("YYYY-MM-DD HH:mm:ss")

			// this.option.series[0].data = this.dataList



			// 获取内容列表
			let sets = await this.getwrapperList(uni.getStorageSync("currentheaderID"))
			this.currentaddr = sets.addr;
			this.option.title.text = sets.name ? sets.name : '趋势图分析';
			this.getsiteValList()
			console.log(234324, this.currentaddr);

		},
		onShow() {
			this.getwrapperList(uni.getStorageSync("currentheaderID"))
		}
	}
</script>

<script module="echarts" lang="renderjs">
	let myChart
	export default {
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/echarts.js'
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)
			}
		},
		methods: {
			initEcharts() {
				myChart = echarts.init(document.getElementById('echarts'))
				// 观测更新的数据在 view 层可以直接访问到
				myChart.setOption(this.option)
			},
			updateEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				myChart.setOption(newValue)
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法
				ownerInstance.callMethod('onViewClick', {
					test: 'test'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.pages_trend {
			width: 100%;
		.fixed {
			background-color: #FFF;
			width: 100%;
			position: fixed;
			top:var(--window-top);
			// height: 600upx;
			z-index: 100;

			.content {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 100%;

				.echarts {
					margin-top: 20upx;
					width: 100%;
					height: 470upx;
				}
			}
		}


		.wrapper_list {
			padding-top: 700upx;
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
						padding-right: 20upx;
						width: 100upx;
						color: #5481EA;
						font-size: 32upx;
						position: relative;

						image {
							position: absolute;
							top: 50%;
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

					.active {
						box-shadow: 0 0 10upx rgba(0, 0, 0, .5);
					}
				}



			}
		}
	}
</style>
