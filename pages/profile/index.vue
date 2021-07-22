<template>
	<!-- 我的页面 -->
	<view class="pages_profile_tab">
		<view class="profile_container">

			<!-- 个人中心头部背景部分 开始 -->
			<view class="profile_info_bg">
				<view class="profile_info" @click="goToperson(userinfo.user_id)">
					<view style="display: flex">
						<view class="avatar" @click.stop="changeAvatar">
							<image :src="userdata.avatar?userdata.avatar:avatar" mode="aspectFill" />
						</view>
						<view class="info_detail">
							<view class="myinfo">
								<text class="name">{{ userdata.realName }}</text>
								<text class="tel">{{ userdata.phone }}</text>
							</view>
							<view class="film_name">{{ userdata.deptName }}</view>
						</view>
					</view>
					
				</view>
			</view>
			<!-- 个人中心头部背景部分 结束 -->
			<!-- 功能列表 开始 -->
			<view class="list">
				<view class="item" @click="goTopersoninfo">
					<view class="item_icon">
						<image :src="personinfo" mode="widthFix" />
						<text>个人信息</text>
					</view>
					<view class="righticon">
						<image :src="arrow2" mode="widthFix" />
					</view>
				</view>
				<view class="item" >
					<view class="item_icon">
						<image :src="phone" mode="widthFix" />
						<text>联系电话</text>
					</view>
					<view class="righticon">
						<image :src="arrow2" mode="widthFix" />
					</view>
				</view>
				<view class="item" >
					<view class="item_icon">
						<image :src="mymessage" mode="widthFix" />
						<text>我的消息</text>
					</view>
					<view class="righticon">
						<text>{{userdata.phone}}</text>
						<image :src="arrow2" mode="widthFix" />
					</view>
				</view>
				<view class="item" style="border: none" @click="goTomodifyPass">
					<view class="item_icon">
						<image :src="modifyPass" mode="widthFix" />
						<text>修改密码</text>
					</view>
					<view class="righticon">
						<image :src="arrow2" mode="widthFix" />
					</view>
				</view>
			</view>
			<!-- 功能列表 结束 -->
			<!-- 退出 开始 -->
			<view class="exit" @click="exit">退出</view>
			<!-- 退出 结束 -->

		</view>

	</view>
</template>

<script>
	// 头像
	import avatar from "static/avatar.png";
	import personinfo from "static/personinfo.png";
	import arrow2 from "static/arrow2.png";
	// 修改密码
	import modifyPass from "static/modifyPass.png";
	// 我的信息
	import mymessage from "static/mymessage.png";
	import phone from "static/phone.png";
	export default {
		data() {
			return {
				current: 0, //tab下标
				avatar,
				personinfo,
				mymessage,
				phone,
				modifyPass,
				arrow2,
				userinfo: {},
				// 用户基本信息
				userdata: {
					avatar,
					realName: "摩根",
					phone: "15182612784",
					deptName: "宁波聚联科技有限公司"
				},
				
			}
		},
		computed: {
			
		},
		methods: {
			// 进入个人中心
			goToperson() {
				
			},
			
			// 进入修改密码
			goTomodifyPass() {
				uni.navigateTo({
					url: '/pages/profile/modifypass'
				});
			},
			// 更换头像
			changeAvatar() {
				// 图片上传接口
				// let avatar = await this.api.chooseImages('', 1)
				// console.log(1111111);
				// let res = await this.api.upLoad(avatar[0])
				// 调用更换头像接口
				// await this.api.changeavatar({
				// 	avatar: res,
				// 	id: this.userinfo.user_id
				// })
				// 再次调取userinfo接口，重新赋值
				// this.api.getuserInfo(this.userinfo.user_id).then(res1 => {
				// 	this.userdata = res1
				// 	this.logo = this.userdata.avatar



					// this.$nextTick(function() {
				// 		if (this.loginType == 1)
				// 			this.$refs.yuanqiQRCode.make();
				// 		else
				// 			return false;
				// 	})
				// })
			},
			// 退出
			exit() {
				uni.clearStorageSync()
				uni.reLaunch({
					url: '/pages/login/index'
				});
			},   
		},
		components: {
		},
		beforeMount() {

		},
		mounted() {
			

		},
		
		async onShow() {


		},
	};
</script>



<style lang="scss" scoped>
	.pages_profile_tab {
		width: 100%;
		// height: calc(100vh - 173upx);
		height: 100vh;
		display: flex;
		flex-direction: column;

		.profile_container {
			padding-bottom: 120upx;

			background: #fafafa;
			width: 100%;

			flex: 1;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			display: flex;
			flex-direction: column;
			align-items: center;

			.profile_info_bg {
				padding: 200upx 0;
				width: 100%;
				background: #2b89f7;
				display: flex;
				align-items: center;
				box-sizing: border-box;

				.profile_info {
					width: 90%;
					margin: 0 auto;
					display: flex;
					justify-content: space-between;
					align-items: center;

					// align-content: center;
					.avatar {
						width: 134upx;
						height: 134upx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}

						margin-right: 28upx;
					}

					.info_detail {
						// height: 74upx;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.myinfo {
							display: flex;
							align-items: center;

							.name {
								font-size: 28upx;
								font-weight: 600;
								color: #ffffff;
								margin-right: 4upx;
							}

							.tel {
								font-size: 24upx;
								color: #ffffff;
							}
						}

						.film_name {
							font-size: 24upx;
							color: #ffffff;
						}
					}

					.code {
						// width: 64upx;
						float: right;
						margin-right: 20upx;

						image {
							width: 100%;
						}
					}

					.arrow {
						font-size: 24upx;
						color: #ffffff;
					}
				}
			}

			.queryinfo {
				background: #fff;
				width: 90%;
				margin-top: -92upx;
				border-radius: 20upx;
				display: flex;
				justify-content: space-around;
				box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);

				.querydetail {
					display: flex;
					flex-direction: column;

					view:first-child {
						display: flex;
						justify-content: center;
						font-size: 40upx;
						padding-top: 36upx;
						padding-bottom: 10upx;
						font-weight: 600;
						color: #303030;
					}

					view:last-child {
						font-size: 34upx;
						padding-bottom: 36upx;
					}
				}
			}

			.graph {
				margin: 10upx 0;
				width: 100%;

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

			.procition {
				box-sizing: border-box;
				box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
				background: #fff;
				margin-top: 20upx;
				padding: 20upx 40upx;
				width: 90%;

				text:first-child {
					margin-right: 34upx;
					font-size: 28upx;
				}

				text:last-child {
					color: #ff0000;
					font-size: 28upx;
				}
			}

			.list {
				border-radius: 30upx;
 				margin-top:-60upx;
				box-sizing: border-box;
				background: #fff;
				padding: 0 40upx;
				width: 90%;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);

				.item {
					box-sizing: border-box;
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 40upx 20upx;
					border-bottom: 2upx solid #d0ced8;

					.item_icon {
						display: flex;
						align-items: center;

						image {
							width: 32upx;
						}

						text {
							margin-left: 16upx;
							font-size: 28upx;
						}
					}

					.righticon {
						display: flex;
						align-items: center;
						
						image {
							width: 32upx;
						}
						text {
							margin-right: 16upx;
							font-size: 28upx;
						}
					}
				}
			}

			.exit {
				text-align: center;
				line-height: 88upx;
				margin-top: 80upx;
				// margin-bottom: 80upx;
				width: 530upx;
				height: 88upx;
				background: #ffffff;
				opacity: 1;
				border-radius: 60upx;
			}
		}
	}
</style>
