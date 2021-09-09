<template>
	<view class="pages_reportformDetail">

		<u-navbar @custom-back="back" :title="name" title-color="#ffffff" back-icon-color="#ffffff"
			:background="background"></u-navbar>
		<view class="title">
			{{name}}
		</view>
		<view class="para">
			<view class="date" style="font-size: 30upx;">
				当前日期：{{date}}
			</view>
			<view class="paraList" v-for="(item,index) in para " :key="index">
				{{item}}
			</view>
		</view>
		<view class="content">
			<avue-form ref="form" v-model="obj" :option="option" @reset-change="emptytChange" @submit="submit"
				@error="error">
			</avue-form>
		</view>
		<view class="rmks">
			<view class="note">
				备注
			</view>
			<view class="formTitle">
				{{name}}
			</view>
			<view class="rmksList" v-for="(item,index) in rmks" :key="index">
				{{item}}
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				date: "",
				obj: {},
				background: {
					backgroundColor: '#0984e3',
				},
				id: 1,
				detailList: {

				},
				content: {

				}, //输入框对象
				name: "",
				para: [], //设备信息
				rmks: [], //备注
				option: {
					labelWidth:120,
					// labelWidth:100,
					// labelPosition: 'top',
					column: [],
					group: []
				}

			}
		},
		methods: {
			back() {
				uni.navigateBack({

				})
			},
			emptytChange() {
				this.$message.success("清空方法回调")
			},
			submit(form, done) {
				console.log(form)
				this.obj.id = this.id
				// this.$message.success("当前数据" + JSON.stringify(this.obj))
				// // this.obj.date = this.date
				// console.log(JSON.stringify(this.obj))
				this.api.mobSubmitReport(JSON.stringify(this.obj)).then(res => {
					if (res.code === 200) {
						this.$message.success("提交成功")
					}
					console.log(res)

				})



				done()
			},
			error(err) {
				this.$message.success('请查看控制台');
				//console.log("111", err)
			},
			dateFormat(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},

		},
		onLoad(e) {
			this.id = e.id
			this.api.getReportDtl({
				id: this.id
			}).then(res => {
				this.detailList = res
				this.content = JSON.parse(this.detailList.content)
				this.rmks = this.detailList.rmks.split("\n")
				this.para = this.detailList.para.split("\n")
				this.name = this.detailList.name
				this.option.column = this.content.column
				this.option.group = this.content.group
			})

			this.api.getReportValue({
				id: this.id
			}).then(res => {
				this.obj = res
			})



			this.date = this.dateFormat("YYYY-mm-dd HH:MM", new Date())
		},

	}
</script>

<style lang="scss" scoped>
	.pages_reportformDetail {
		width: 100%;

		.navigation {
			width: 100%;
			// background-color: #2957C4;
			background-color: #0984e3;
			padding: 20upx;

			.back {
				width: 24upx;

				image {
					width: 24upx !important;
				}
			}
		}

		.title {
			margin-top: 50upx;
			width: 100%;
			text-align: center;
			font-size: 32upx;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.9);
		}

		.para {
			width: 100%;
			padding: 0 40upx;
			box-sizing: border-box;
			margin-top: 60upx;

			.paraList {
				margin-top: 30upx;
				font-size: 28upx;
				color: rgba(0, 0, 0, 0.9);
			}
		}

		.content {
			text-align: left;
			margin-top: 60upx;
			margin-left: 20upx;
			margin-right: 20upx;
		}

		.rmks {
			background: #FAFAFA;
			padding: 60upx;
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
	}
</style>
