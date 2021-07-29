<template>

	<view class="pages_trend">
		<view class="fixed">
			<!-- 控制折线图的下拉框 -->
			<view class="pickers">
				<picker mode="selector" :range="categories" @change="handleChangeCategory">
					<text v-if="index1<0">按类别</text>
					<text v-else>{{categories[index1]}}</text>
					<image src="../../static/downarrow.png" mode="widthFix" style="width:20upx; margin-left:20upx">
					</image>
				</picker>

				<picker mode="selector" :range="crafts" @change="handleChangecraft">
					<text v-if="index2<0">按工艺</text>
					<text v-else>{{crafts[index2]}}</text>
					<image src="../../static/downarrow.png" mode="widthFix" style="width:20upx; margin-left:20upx">
					</image>
				</picker>
			</view>
			<view style="width:750upx">
				<choosedate @func="getdateA"></choosedate>
			</view>
			<view style="height: 630upx">
				<l-echart ref="chart"></l-echart>
			</view>
		</view>

		<!-- 与首页相同的内容区域 -->
		<view class="wrapper_list">
			<view class="wrapper_item" v-for="(item1,index1) in wrapperList1" :key="index1">
				<view class="wrapper_item_title">
					{{item1.dictValue}}
					<view class="arrow">详情
						<image src="../../static/arrow2.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="wrapper_item_container">
					<view class="wrapper_item_item" v-for="(item2,index3) in item1.sites" :key="index3"
						@click="active(item2.addr,item2.name)">
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
	import * as echarts from '@/uni_modules/lime-echart/components/l-echart/echarts';
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
				wrapperList1: [{
						dictValue: "前处理预脱",
						arrow: '../../static/downarrow.png',
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
						position:['50%',250]
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
								show: true,
								formatter: function(params) {
									return echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', params.value);
								},
								backgroundColor: '#7581BD'
							},
							handle: {
								show: true,
								color: '#7581BD'
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
						top: 30,
						left: 15,
						right: 15,
						height: 160
					},
					  dataZoom: [{
					        type: 'inside',
					        start: 0,
					        end: 10
					    }, {
					        start: 0,
					        end: 10
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
			},
			handleChangecraft(e) {
				this.index2 = e.target.value;
			},
			getdateA(a) {
				this.st = a.startDate;
				this.et = a.endDate;
				// this.getsiteValList()
			},
			// 获取内容列表
			async getwrapperList(id) {
				this.wrapperList1 = await this.api.getwrapperList({
					id: id
				})
				
			},
			// 获取折线图数据
			 getsiteValList() {
			 this.api.getsiteValList({sites:'CCF_FAN_VT,CCF_FILTER_DPT1',st:'2021-07-20 18:00:00',et:'2021-07-20 19:00:00'}).then(res=>{
				this.option.series = res;
				this.$refs.chart.setOption(this.option)
			console.log(1111111111111111111,this.option.series);
			
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
		mounted() {
			this.$refs.chart.init(config => {
				const {
					canvas
				} = config;
				const chart = echarts.init(canvas, null, config);
				chart.setOption(this.option);
				return chart;
			});
			this.getsiteValList()
			
		},
		async onLoad() {
			this.st = `${moment().format("YYYY-MM-DD")} 00:00:00`
			this.et = moment().format("YYYY-MM-DD HH:mm:ss")
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
				script.src = '../../static/echarts.js'
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
			top: var(--window-top);
			// height: 600upx;
			z-index: 100;

			.pickers {
				display: flex;
				justify-content: center;

				picker {
					padding: 2upx;
					display: inline-block;
					border: 1px solid rgba(200, 200, 200, .5);
					margin: 10upx;
					border-radius: 20upx;
					display: flex;
					align-items: center;

					image {
						padding: 2upx;
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
			padding-top: 1100upx;
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
