<template>
	<!-- 修改密码页面 -->
	<view class="pages_modify_pass">
		<view class="wrapper">
			<view class="navigation">
				<view class="back" @click="back">
					<image src="../../static/back.png" mode="widthFix"></image>
				</view>
			</view>
			<image class="cover" :src="modifyPassCover" mode="aspectfit"></image>
			<!-- 表单 开始 -->
			<view class="list">
				<view class="item">
					<image :src="passimg" mode="widthFix" />
					<input type="password" placeholder="请输入原始密码" maxlength="16" placeholder-style="color:#909090"
						v-model="info.oldPassword" />
				</view>
				<view class="item">
					<image :src="passimg" mode="widthFix" />
					<input type="password" placeholder="请输入新密码" maxlength="16" placeholder-style="color:#909090"
						v-model="info.newPassword" />
				</view>
				<view class="item">
					<image :src="passimg" mode="widthFix" />
					<input type="password" placeholder="请输入新密码" maxlength="16" placeholder-style="color:#909090"
						v-model="info.newPassword1" />
				</view>
				<button @click="summit">确定</button>
			</view>
			<!-- 表单 结束 -->
		</view>
	</view>
</template>

<script>
	import modifyPassCover from "static/modifyPassCover.png";
	import passimg from "static/loginPass.png";
	import {
		md5
	} from '../../utils/md5.js';
	export default {
		data() {
			return {
				passimg,
				modifyPassCover,
				info: {
					newPassword1: "",
					newPassword: "",
					oldPassword: "",
				},
			};
		},
		methods: {
			async summit() {
				for (let i in this.info) {
					if (this.info[i] == '') {
						uni.showToast({
							title: '请将数据填完整',
							icon: 'loading'
						})
						return false;
					}
					

				}
				let formData = {
					newPassword1: md5(this.info.newPassword1),
					newPassword: md5(this.info.newPassword),
					oldPassword: md5(this.info.oldPassword),
				}
				let data = await this.api.password(formData)
				uni.showToast({
					title:data.msg
				})
				setTimeout(()=>{
					uni.clearStorageSync()
					uni.reLaunch({
					url:'/pages/login/index'
				})
				},1500)
				
			},
			back() {
				uni.navigateBack({
			
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages_modify_pass {
		width: 100%;

		.wrapper {
			
			.navigation {
				width: 100%;
				box-sizing: border-box;
				// background-color: #2957C4;
				background-color: #0984e3;
			
				.back {
					width: 24upx;
			padding: 20upx 30upx;
					image {
						width: 24upx;
					}
				}
			}
			width: 100%;
			// padding-top: 60rpx;
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
				width: 530rpx;

				.item {
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
	}
</style>
