<!-- 报表页面 -->
<template>
	<view class="pages_reportform">
		<view class="container">
			<view class="hidden">
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
				detailId: "",
				switchList: [],
				currentheaderID: '1',
				formList: []
			};
		},
		methods: {
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
			showDetail(index) {
				uni.navigateTo({
					url: `./detail?id=${this.formList[index].id}`
				})
			},
		},
		onLoad() {
			this.api.getReportType().then(res => {
				this.switchList = res
				// console.log("1111", this.switchList);
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
					margin-top: calc(var(--status-bar-height));
					// z-index: 100;
					background-color: #0984e3;
					width: 100%;
					padding:20upx 0;
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
