<template>
	<view class="pages_login">
		<view class="login_container">
			<!-- 背景图 开始 -->
			<view class="login_bg">
				<image :src="bg" mode="widthFix" />
			</view>
			<!-- 背景图 结束 -->
			<!-- 表单 开始 -->
			<view class="login_form">
				<view class="form_phone">
					<image :src="phoneimg" mode="widthFix" />
					<input type="number" placeholder="请输入手机号码" maxlength="11" placeholder-style="color:#909090"
						v-model="info.phone" />
				</view>
				<view class="form_password">
					<image :src="passimg" mode="widthFix" />
					<input type="password" placeholder="请输入密码" maxlength="20" placeholder-style="color:#909090"
						v-model="info.password" />
				</view>
				<button @click="summit">登录</button>
			</view>
			<!-- 表单 结束 -->
		</view>
		<!-- 忘记密码 -->
		<text class="forget_pass" @click="forget">忘记密码</text>
	</view>
</template>

<script>
	import bg from "static/banner1.png";
	import phoneimg from "static/loginPhone.png";
	import passimg from "static/loginPass.png";
	export default {
		data() {
			return {
				// 图片
				bg,
				phoneimg,
				passimg,
				info: {
					phone: "",
					password: "",
				}, //用户信息
			};
		},
		methods: {
			summit() {
				uni.switchTab({
					url:"/pages/index/index"
				})
			},
			forget() {
				uni.navigateTo({
					url:"/pages/login/forgetpass"
				})
			}
		}
		

	};
</script>

<style lang="scss" scoped>
	.pages_login {
		// border-top: 2upx solid rgba(0, 0, 0, .2);
		width: 100%;

		.login_container {
			width: 100%;
			padding-top: 60rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.login_bg {
				image {
					width: 600rpx;
				}

				margin-bottom: 160rpx;
			}

			.login_form {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 530rpx;

				.form_phone {
					width: 100%;
					height: 110rpx;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #d0ced8;

					image {
						width: 40rpx;
						margin-left: 8rpx;
						margin-right: 28rpx;
					}

					input {
						font-size: 28rpx;
					}
				}

				.form_password {
					width: 100%;
					height: 110rpx;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #d0ced8;

					image {
						width: 40rpx;
						margin-left: 8rpx;
						margin-right: 28rpx;
					}

					input {
						font-size: 28rpx;
					}
				}

				button {
					margin-top: 100rpx;
					width: 100%;
					text-align: center;
					height: 88rpx;
					line-height: 88rpx;
					background: #2b89f7;
					border-radius: 60rpx;
					color: #fff;
					font-size: 28rpx;
				}
			}
		}

		text.forget_pass {
			font-size: 24rpx;
			font-weight: 300;
			color: #5e97f4;
			opacity: 1;
			float: right;
			margin-right: 156rpx;
			margin-top: 40rpx;
		}
	}
</style>
