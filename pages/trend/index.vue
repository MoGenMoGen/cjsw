<template>

	<view>
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
					<image :src="item1.arrow" mode="widthFix" class="arrow"></image>
				</view>
				<view class="wrapper_item_container" v-show="item1.toogleflag">
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
				st: '',
				et: '',
				dataList: [],
				wrapperList1: [{
						dictValue: "前处理预脱",
						toogleflag: false,
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
						text: '趋势分析图',
					},
					tooltip: {
						trigger: 'axis',
						 axisPointer: {
						    animation: false
						 }
					},	
					toolbox: {
					    feature: {
					        dataZoom: {
					            yAxisIndex: 'none'
					        },
					        restore: {},
					        saveAsImage: {}
					    }
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						show: false,
						splitLine: {
						   show: false
						},
						data: []
					},
					yAxis: {
						type: 'value',
						boundaryGap: [0, '100%'],
						splitLine: {
						            show: false
						}
					},
					dataZoom: [{
						type: 'inside',
						start: 0,
						end: 0.1
					},
					{
						start: 0,
						end: 0.1
					},
					],
					series: [{
						name: '数值',
						type: 'line',
						symbol: 'none',
						sampling: 'lttb',
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
				this.wrapperList1[index].toogleflag = !this.wrapperList1[index].toogleflag;
				this.wrapperList1[index].arrow = this.wrapperList1[index].toogleflag ? '../../static/uparrow.png' :
					'../../static/downarrow.png'
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
				for (let item of wraplist) {
					item.toogleflag = false;
					item.arrow = '../../static/downarrow.png';
				}
				wraplist.push()
				this.wrapperList1 = wraplist
				console.log({
					wraplist: this.wrapperList1
				});
				// this.chartsDataLine1.series[0].name=wraplist[0].sites[0].name
				// 返回第一项第一行的编号，用于初始化折线图
				return {addr:wraplist[0].sites[0].addr,name:wraplist[0].sites[0].name};
			},
			// 获取折线图数据
			async getsiteValList() {
				// let siteValList=await this.api.getsiteValList({site:'CCF_FAN_VT',st:'2021-06-21 00:00:00',et:'2021-07-21 23:00:00'})
				this.dataList=[];
				let siteValList = await this.api.getsiteValList({
					site: this.currentaddr,
					st: this.st,
					et: this.et
				})
				
				console.log(siteValList.date)
				console.log(siteValList.data)

				this.option.series[0].data = siteValList.data;
				this.option.xAxis.data = siteValList.date;
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
			this.option.title.text=sets.name?sets.name:'趋势图分析';
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
	.fixed {
		background-color: #FFF;
		width: 100%;
		position: fixed;
		top: 0;
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
</style>
