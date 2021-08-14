<!-- 报表页面 -->
<template>
	<view class="pages_reportform">
		<view class="container">
			
			<view class="hidden">
				<!-- <view class="navigation">
					<view class="back" @click="back">
						<image src="../../static/back.png" mode="widthFix"></image>
					</view>
				</view> -->
				<view class="head_switch">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(item.sort)" :class="{activeheader:item.sort==currentheaderID}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<view class="formList">
				<view class="listBody" v-for="(item,index) in formList" :key="index" @click="showDetail(index)">
					{{item.name}}
					<image src="../../static/arrow3.png" mode=""></image>
				</view>
			</view> 
			

			<!-- <view class="containerBody" v-for="(item,index) in surface" :key="index">
				<view class="containerTitle">
					{{item.title}}
				</view>
				<view class="containerList">
					<view class="bodyList" v-for="(item1,index1) in item.body" :key="index1">
						<view class="name">
							{{item1.name}}
						</view>
						<view class="content">
							{{item1.content}}
						</view>
					</view>
					<view class="" style="font-size:28upx;color:rgba(0, 0, 0, 0.9); ">
						{{item.note}}
					</view>
					<view class="listInput" v-for="(item2,index2) in item.input" :key="index2">
							<view class="name">
							{{item2.name}}:
							</view>
							<view class="content">
								<input type="text" value="" placeholder="保养标准: 干净无灰尘" placeholder-class="placeholderIn" />
							</view>
					</view>
					<view class="abnormal">
						<view class="name">
							{{item.abnormalIn}}
						</view>
						<view class="content">
							
						</view>
					</view>
				</view>
			
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				obj: {
					id: 123123
				},
				detailId:"",
				option: {
					column: [{
							label: "姓名",
							prop: "name",
							disabled: false,
							mock: {
								type: 'name'
							},
							span: 8,
							rules: [{
								required: true,
								message: "请输入姓名",
								trigger: "blur"
							}]
						},
						{
							label: "密码",
							prop: "password",
							disabled: false,
							type: 'password',
							mock: {
								type: 'name'
							},
							span: 8,
							rules: [{
								required: true,
								message: "请输入密码",
								trigger: "blur"
							}]
						},
					]
				},
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
						id: '5',
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
				currentheaderID: '1',
				surface: [{
						title: "涂装离子风机保养记录表",
						body: [{
								name: "编号",
								content: "007——WI-347"
							},
							{
								name: "责任人",
								content: "工艺人员"
							},
							{
								name: "检测仪器",
								content: "检测仪器名称"

							},
							{
								name: "仪器型号",
								content: "检测仪器名称"
							},
							{
								name: "线别",
								content: "涂装七线"
							},
							{
								name: "区域",
								content: "除尘区"
							},

						],
						note: "保养项目（7月-保养周期/每月）",
						input: [{
								name: "机体内壁"
							},
							{
								name: "铜针"
							},
							{
								name: "叶轮"
							},
							{
								name: "风鼓内测"
							},
							{
								name: "进风口格栅"
							},
							{
								name: "出风口"
							}

						],
						abnormalIn: "异常记录"

					},
					{
						title: "静电检测记录表",
					}


				],
				formList: []
			};
		},
		methods: {
			switchHead(sort) {
				if (this.currentheaderID != sort) {
					this.currentheaderID = sort
					uni.setStorageSync("currentheaderID", this.currentheaderID)
					// this.getwrapperList(this.currentheaderID)
					this.api.getReportList({id:this.switchList[sort-1].id}).then(res=>{
						this.formList=res
						
					})
				}
			},
			sub() {
				this.$vervify(this.formData); //表单校验 成功会继续往下走 失败抛出异常

				const res = this.$submitForm(this.formData); //校验成功 获取表单值
				console.log('表单对象 :>> ', res);
			},
			emptytChange() {
				this.$message.success("清空方法回调")
			},
			submit(form, done) {
				this.$message.success("当前数据" + JSON.stringify(this.obj))
				console.log(JSON.stringify(this.obj));
				done()
			},
			error(err) {
				this.$message.success('请查看控制台');
				console.log("111", err)
			},
			showDetail(index){
				 uni.navigateTo({
				 	url:`./detail?id=${this.formList[index].id}`
				 })
			},
			// back(){
			// uni.navigateBack({
				
			// })}
			
		},
		onLoad() {
			this.api.getReportType().then(res => {
				this.switchList = res
				// console.log("1111", this.switchList);
				this.api.getReportList({id:this.switchList[0].id}).then(res=>{
					this.formList=res
					console.log("2222",this.formList);
				})
			})
		}


	}
</script>

<style lang="scss" scoped>
	.pages_reportform {
		width: 100%;
		background-color: #ecf0f1;
		min-height: 100vh;
		.container {
			width: 100%;

			.formList {
				padding: 40upx 20upx 500upx 20upx;
				box-sizing: border-box;
				
				margin-top: 80upx;

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
					border-radius: 12upx;

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
				background-color: #0984e3;
				height: calc(var(--status-bar-height) +86upx);
				// overflow: hidden;
				width: 100%;
				// .navigation{
				// 	width: 100%;
				// 	// background-color: #2957C4;
				// 	background-color: #0984e3;
				// 	padding:20upx;
				// 	box-sizing: border-box;
				// 	.back{
				// 		width:24upx ;
				// 		image{
				// 			width:24upx !important;
				// 		}
				// 	}
				// }
				.head_switch {
					// position: fixed;
					margin-top: calc(var(--status-bar-height) + 10upx);
					// z-index: 100;
					background-color: #0984e3;
					width: 100%;
					height: 76upx;
					// padding-bottom: 12upx;
					overflow-x: scroll;
					overflow-y: hidden;
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
				.head_switch::-webkit-scrollbar {
					display: none;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				margin-top: 100upx;
				justify-content: center;
				margin-left: -90upx;

				/deep/ .el-form-item__content {
					margin-left: 110upx !important;

				}

			}

			.containerBody {
				width: 100%;
				margin-top: 100upx;
				// padding: 62upx 0 0 0;
				box-sizing: border-box;
				border-bottom: 30upx solid #FAFAFA;

				.containerTitle {
					text-align: center;
					font-size: 32upx;
					color: rgba(0, 0, 0, 0.9);
					font-weight: 600;
				}

				.containerList {
					margin-top: 60upx;
					padding: 0 0 0 40upx;
					box-sizing: border-box;

					.bodyList {
						display: flex;
						margin-bottom: 25upx;

						.name {
							position: relative;
							width: 150upx;
							display: inline-block;
							text-align-last: justify;
							font-size: 28upx;
							color: rgba(0, 0, 0, 0.9);

						}

						.name::after {
							content: ":";
							position: absolute;
							right: -20upx;


						}

						.content {
							margin-left: 50upx;
							font-size: 28upx;
							color: rgba(0, 0, 0, 0.9);
						}
					}

					.listInput {

						margin-top: 30upx;
						display: flex;

						.name {
							width: 150upx;
							font-size: 28upx;
							line-height: 78upx;
						}

						.content {
							margin-left: 20upx;
							width: 480upx;
							height: 78upx;
							border: 2upx solid #DCDFE6;
							opacity: 1;
							border-radius: 8upx;
							padding: 20upx;
							box-sizing: border-box;
							line-height: 78upx;

							input {
								font-size: 28upx;
							}

							.placeholderIn {
								font-size: 28upx;
							}
						}
					}
				}
			}
		}


	}
</style>
