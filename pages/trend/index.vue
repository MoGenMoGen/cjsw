<template>

	<view class="pages_trend">
		<view class="fixed">
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

				<picker  mode="selector" :range="crafts" @change="handleChangecraft"  range-key='dictValue'>
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
			<view style="height:250px">
				<l-echart ref="chart"></l-echart>
			</view>
		</view>

		<!-- 与首页相同的内容区域 -->
		<view class="wrapper_list">
			<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1" @click="toDetail(item1.id)">
				<view class="wrapper_item_title">
					{{item1.dictValue}}
					<view class="arrow">详情
						<image src="../../static/arrow2.png" mode="widthFix"></image>
					</view>
				</view>
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
					<view class="wrapper_item_item" v-for="(item2,index2) in item1.sites" :key="index2"
						@click="active(item2.addr)" :style="{'background-color':(item2.checked?item2.color:'')}">
						<view class="line1 line" :style="{'color':(item2.checked?'#fff':'#333')}">
							{{item2.name}}
						</view>
						<view class="line2 line" :style="{'color':(item2.checked?'#fff':item2.color)}">
							{{item2.val}}
						</view>
						<view class="line3 line" :style="{'color':(item2.checked?'#fff':'#333')}">
							(XX~XX)
						</view>
						<view class="line4 line" :style="{'color':(item2.checked?'#fff':'#333')}">
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
	import * as echarts from '@/uni_modules/lime-echart_0.3.4/components/l-echart/echarts.min';
	import moment from "moment";
	export default {
		data() {
			return {
				categories: ['温度类', '压力类', '温度类', '压力类', '温度类', '压力类'],
				index1: -1,
				index2: -5,
				crafts: ['前处理预脱', '前处理主脱', '前处理水洗'],
				st: '',
				et: '',
				sites: "",
				timer: null,
				// 类别id
				categoryID:'',
				// 工艺id
				craftID:'',
				// 选中编号数组
				AddrCheckedArray: [],
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
			// 按类别下拉框修改下标
			handleChangeCategory(e) {
				this.index1 = e.target.value;
				this.categoryID=this.categories[this.index1].id
				this.getwrapperList(uni.getStorageSync("currentheaderID"), uni.getStorageSync("isChild"),this.categoryID,this.craftID)
			},
			handleChangecraft(e) {
				this.index2 = e.target.value;
				this.craftID=this.crafts[this.index2].id
				this.getwrapperList(uni.getStorageSync("currentheaderID"), uni.getStorageSync("isChild"),this.categoryID,this.craftID)
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
			// 选中编号
			active(addr) {

				// 判断数组中是否有该编号
				let flag = false;
				for (let item of this.AddrCheckedArray) {
					if (item == addr) {
						flag = true;
						break;
					}
				}
				// 取消选中
				if (flag) {
					// 1.删除选中数组中该编号
					this.AddrCheckedArray = this.AddrCheckedArray.filter(item => item != addr)

					// 重新请求内容接口修改选中状态，不用循环内容数组修改选中状态
					// 先清空定时器
					this.getwrapperList(uni.getStorageSync("currentheaderID"), uni.getStorageSync("isChild"),this.categoryID,this.craftID)
					// 请求中的sites重新赋值为数组的','分割字符串
					this.sites = this.AddrCheckedArray.join(',')
					this.getsiteValList(true)
				} else {
					// 最多不能超过十条
					if (this.AddrCheckedArray.length == 10) {
						uni.showToast({
							title: '最多不超过10条',
							icon: "none",
							duration: 2000
						})
						return false;
					}
					// 选中且不差过10条，向选中编号的数组中添加该编号
					this.AddrCheckedArray.push(addr)

					// 重新请求内容接口修改选中状态，不用循环内容数组修改选中状态
					// 先清空定时器
					this.getwrapperList(uni.getStorageSync("currentheaderID"), uni.getStorageSync("isChild"),this.categoryID,this.craftID)
					// 请求中的sites重新赋值为数组的','分割字符串
					this.sites = this.AddrCheckedArray.join(',')
					this.getsiteValList()
				}


			},
			// 获取内容列表
			getwrapperList(id, child,categoryID,craftID) {
				if (this.timer) {
					clearInterval(this.timer);
				}
				console.log('获取内容列表');
				this.api.getwrapperList({
					id: id,
					siteType:categoryID,
					siteName:craftID
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
						console.log('child', uni.getStorageSync('currentChildIndex'));
						console.table(res[uni.getStorageSync('currentChildIndex')].children);
						this.wrapperList1 = res[uni.getStorageSync('currentChildIndex')].children
					} else
						this.wrapperList1 = res
				})
				// 10s轮询
				this.timer = setInterval(() => {
					this.api.getwrapperList({
						id: id,
						siteType:categoryID,
						siteName:craftID
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
							this.wrapperList1 = res[uni.getStorageSync('currentChildIndex')].children
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
			this.categories.unshift({dictValue:'全部'})
			this.crafts=await this.api.getcraftList({pid:uni.getStorageSync('currentheaderID')})
			this.crafts.unshift({dictValue:'全部'})
			this.getwrapperList(uni.getStorageSync("currentheaderID"), uni.getStorageSync("isChild"))
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
			padding-top: calc(180upx + var(--status-bar-height) + 250px);
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

					.active {
						box-shadow: 0 0 10upx rgba(0, 0, 0, .5);
					}
				}



			}
		}
	}
</style>
