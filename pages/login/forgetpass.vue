<template>
	<!-- 修改密码页面 -->
	<view class="pages_modify_pass">
		<view class="wrapper">
			<image class="cover" :src="modifyPassCover" mode="aspectfit"></image>
			<!-- 表单 开始 -->
			<view class="list">
				<view class="item">
					<image :src="loginPhone" mode="widthFix" />
					<input type="number" placeholder="请输入手机号码" maxlength="11" placeholder-style="color:#909090"
						v-model="info.phone" />
				</view>
				<view class="item">
					<image :src="vertifycode" mode="widthFix" />
					<input type="text" placeholder="请输入验证码" maxlength="10" placeholder-style="color:#909090"
						v-model="info.vertifycode" />
					<view class="vertifylink" v-if="codeTime==0" @click="getCheckNum">
						获取验证码
					</view>
					<view class="vertifylinkactive" v-else>
						{{codeTime}}s
					</view>
				</view>
				<view class="item">
					<image :src="passimg" mode="widthFix" />
					<input type="password" placeholder="请输入密码" maxlength="16" placeholder-style="color:#909090"
						v-model="info.password" />
				</view>

			</view>
			<!-- 表单 结束 -->
			<view class="btnList">
				<button @click="cancel">取消</button>
				<button @click="summit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import modifyPassCover from "static/modifyPassCover.png";
	import passimg from "static/loginPass.png";
	import vertifycode from "static/vertifycode.png";
	import loginPhone from "static/loginPhone.png";
	export default {
		data() {
			return {
				passimg,
				modifyPassCover,
				vertifycode,
				loginPhone,
				vertifyflag: false,
				codeTime: 0,
				info: {
					phone: "",
					vertifycode: "",
					password: "",
				},
			};
		},
		methods: { 
			getCheckNum() {
				let res=this.reg.checkPhone(this.info.phone);
				if(res!='ok')
				{
					return uni.showToast({   
						title:res,
						icon:'none',
						duration: 1500
					})
				}
				this.codeTime = 5
				let timer = setInterval(() => {
					this.codeTime--;
					if (this.codeTime < 1) {
						clearInterval(timer);
						this.codeTime = 0
					}
				}, 1000)
			},
			 summit() {


			}
		},

	onLoad() {

	}
	};
</script>

<style lang="scss" scoped>
	.pages_modify_pass {
		width: 100%;

		.wrapper {
			width: 100%;
			padding-top: 60upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.cover {
				margin: 74upx 0 158upx 0;
				width: 187upx;
				height: 161upx;
			}

			.list {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 530upx;

				.item {
					position: relative;
					width: 100%;
					height: 110upx;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #d0ced8;

					image {
						width: 40upx;
						margin-left: 8upx;
						margin-right: 28upx;
					}

					input {
						font-size: 28upx;
					}

					.vertifylink {
						font-size: 28upx;
						color: #5481EA;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: 184upx;
						border-left: 1px solid #5481EA;
						text-align: center;
						right: 0;
					}

					.vertifylinkactive {
						font-size: 28upx;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: 184upx;
						text-align: center;
						right: 0;
						border-left: 1px solid #909090;
						color: #909090;
					}
				}

			}

			.btnList {
				margin-top: 100upx;
				width: 530upx;
				height: 88upx;
				display: flex;
				justify-content: space-between;

				button {
					width: 240upx;
					text-align: center;
					height: 88upx;
					line-height: 88upx;
					background: #F9F9F9;
					border-radius: 60upx;
					color: #5481EA;
					font-size: 28upx;
					border: 1px solid #5481EA;
				}

				button:first-child {}

				button:last-child {
					background-color: #5481EA;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
