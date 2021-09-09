<!-- 我的报表页面 -->
<template>
	<view class="pages_myreport">
		<view class="container">
			<view class="hidden">
				<view class="navigation">
					<view class="back" @click="back">
						<image src="../../static/back.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="head_switch" style="margin-top: 0upx;">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(item.sort)" :class="{activeheader:item.sort==currentheaderID}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<view class="formList">
				<view class="listBody" v-for="(item,index) in formList" :key="index" @click="showDetail(item)">
					{{item.name}}
					<image src="../../static/arrow3.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 报表详情弹窗 -->
		<el-dialog :visible.sync="visible2" :title="reportInfo.name" append-to-body fullscreen>

			<view class="para">
				<view class="paraList" v-for="(item,index) in para " :key="index">
					{{item}}
				</view>
			</view>

			
			<avue-crud :data="data2" :option="option2">
				  <template slot="menuRight" slot-scope="{size}">
						<el-button type="primary" icon="el-icon-edit"  :size="size">2021-09</el-button>
						<el-button type="primary" icon="el-icon-download"  :size="size" @click='download' >导出</el-button>
				  </template>
			</avue-crud>


			<view class="rmks">
				<view class="formTitle">
					备注
				</view>
				<view class="rmksList" v-for="(item,index) in rmks" :key="index">
					{{item}}
				</view>
			</view>
		</el-dialog>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:'',
				para: [], //设备信息
				rmks: [], //备注
				reportInfo: '',
				visible2: false,
				option2: {
					showStripe: true,
					border: true,
					addBtn: false,
					menu: false,
					align: 'center',
					menuAlign: 'center',
					column: [{
							label: '测试地点',
							prop: 'addr',
						},
						{
							label: '标准',
							prop: 'bz'
						}, {
							label: '9.1',
							prop: 'val1'
						}, {
							label: '9.2',
							prop: 'val2'
						}, {
							label: '9.3',
							prop: 'val3'
						},

					]
				},
				data2: [{
					addr: '上料除尘1',
					bz: '0±0.2KV',
					val1: '12',
					val2: '24',
					val3: '23'
				}, {
					addr: '上料除尘2',
					bz: '0±0.2KV',
					val1: '12',
					val2: '24',
					val3: '3'
				}, {
					addr: '异常记录',
					bz: '',
					val1: '无',
					val2: '无',
					val3: '无'
				}, , {
					addr: '提交人',
					bz: '',
					val1: '张三',
					val2: '张三',
					val3: '张三'
				}, {
					addr: '审核人',
					bz: '',
					val1: '李四',
					val2: '李四',
					val3: '李四'
				}],
				currentheaderID: "1",
				switchList: [],
				formList: []
			};
		},
		methods: {
			
			download(){
				this.api.getReportTest({
				
				}).then(res => {
					window.open(res)
					console.log(res);
				})
			},
			
		
			switchHead(sort) {
				if (this.currentheaderID != sort) {
					this.currentheaderID = sort
					uni.setStorageSync("currentheaderID", this.currentheaderID)
					// this.getwrapperList(this.currentheaderID)
					this.api.getReportList({
						id: this.switchList[sort - 1].id
					}).then(res => {
						this.formList = res

					})
				}
			},


			showDetail(item) {
				console.log(item);
				this.reportInfo = item
				this.visible2 = true
				this.api.getReportDtl({
					id: item.id
				}).then(res => {
					this.rmks = res.rmks.split("\n")
					this.para = res.para.split("\n")
				})


				// this.option2.column = []
				// this.api.getReportLog({
				// 	id: item.id,
				// 	st: '2021-09-01',
				// 	et: '2021-10-31'
				// }).then(res => {
				// 	this.data2 = res.data
				// 	this.option2.column = res.column
				// 	this.visible2 = true
				// })
			},


			back() {
				uni.navigateBack({

				})
			}



		},
		onLoad() {
			this.api.getReportType().then(res => {
				this.switchList = res
				this.api.getReportList({
					id: this.switchList[0].id
				}).then(res => {
					this.formList = res
					console.log("2222", this.formList);
				})
			})


		}

	}
</script>

<style lang="scss">
	.para {
		width: 100%;
		//padding: 0 40upx;
		box-sizing: border-box;
		//margin-top: 60upx;

		.paraList {
			margin-top: 5upx;
			font-size: 28upx;
			color: rgba(0, 0, 0, 0.9);
		}
	}

	.rmks {
		background: #FAFAFA;
		//padding: 60upx;
		font-size: 24upx;
		color: #606060;

		.note {}

		.rmksList {
			margin-top: 30upx;
		}

		.formTitle {
			margin-top: 20upx;
			padding-left: 10upx;
			box-sizing: border-box;
			border-left: 4upx solid #2957C4;
		}
	}

	.pages_myreport {
		width: 100%;
		// background: #FAFAFA;
		background-color: #ecf0f1;
		min-height: 100vh;

		.pic {
			height: 400upx;
			width: 100%;
		}

		.container {
			width: 100%;

			.formList {
				padding: 40upx 20upx 500upx 20upx;
				box-sizing: border-box;

				margin-top: 164upx;

				.listBody {
					position: relative;
					margin-top: 20upx;
					background-color: #FFFFFF;
					width: 710upx;
					padding: 50upx;
					box-sizing: border-box;
					font-size: 28upx;
					color: #606060;
					box-shadow: 0upx 2upx 4upx rgba(155, 155, 155, 0.08);
					border-radius: 20upx;

					image {
						position: absolute;
						width: 12upx;
						height: 21upx;
						top: 50%;
						right: 60upx;
						transform: translateY(-50%);
					}
				}


			}

			.hidden {

				top: 0;
				position: fixed;
				z-index: 100;
				background-color: #2957C4;
				height: calc(var(--status-bar-height) +86upx);
				width: 100%;

				.navigation {
					width: 100%;
					// background-color: #2957C4;
					background-color: #0984e3;

					.back {
						width: 24upx;
						padding: 20upx 30upx;

						image {
							width: 24upx !important;
						}
					}
				}

				.head_switch {
					margin-top: calc(var(--status-bar-height) + 10upx);
					// background-color: #2957C4;
					background-color: #0984e3;
					width: 100%;
					height: 76upx;
					overflow-x: scroll;
					overflow-y: hidden;
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
		}
	}
</style>
