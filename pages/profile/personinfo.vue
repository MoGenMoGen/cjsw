<template>
	<!-- 个人信息页面 -->
	<view class="pages_personinfo">
		<view class="container">
			<view class="avatar">
				<image :src="info.avatar" mode="aspectFill" />
			</view>
			<view class="list">
				<view class="item">
					<text class="title">真实姓名:</text>
					<text class="content">{{ info.realName }}</text>
				</view>
				<view class="item">
					<text class="title">员工工号:</text>
					<text class="content">{{ info.jNum }}</text>
				</view>
				<view class="item">
					<text class="title">部门名称:</text>
					<text class="content">{{ info.deptName }}</text>
				</view>
				<view class="item">
					<text class="title">职位名称:</text>
					<text class="content">{{ info.post }}</text>
				</view>
				<view class="item">
					<text class="title">性别:</text>
					<text class="content">{{ info.sex }}</text>
				</view>
				<view class="item">
					<text class="title">政治面貌:</text>
					<text class="content">{{ info.status }}</text>
				</view>
				<view class="item">
					<text class="title">籍贯:</text>
					<text class="content">{{ info.nativeplace }}</text>
				</view>
				<view class="item">
					<text class="title">联系电话:</text>
					<text class="content">{{ info.phone }}</text>
				</view>
				<view class="item">
					<text class="title">联系地址:</text>
					<text class="content">{{ info.deptAddr }}</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import avatar from "static/avatar.png";
	export default {
		data() {
			return {
				avatar,
				id: "",
				info: {
					avatar,
					realName:'摩根',
					jNum:'007',
					deptName:'技术部',
					post:'工程师',
					sex:'男',
					status:"党员",
					nativeplace:'浙江宁波',
					phone:"400-001-008",
					deptAddr:"镇海329创业社区"
				},
			};
		},
		onLoad(e) {
			this.id = e.id;



		},
		onShow() {
			console.log("onshow");
		},
		mounted() {
			console.log("mounted", this.info.avatar);
			// 生成二维码
			// this.$refs.yuanqiQRCode.make();
		},
		onHide() {

			console.log("onhide");
		},
		onUnload() {
			console.log("onUnload");
		}

	};
</script>

<style lang="scss" scoped>
	.pages_personinfo {
		width: 100%;
		height: 100vh;
		background: #fafafa;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		padding: 20upx;

		.container {
			// height: calc(100vh - 88upx - 100upx);
			width: 100%;
			background: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;

			.avatar {
				margin-top: 100upx;
				width: 134upx;
				height: 134upx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.list {
				margin-top: 100upx;
				padding: 0 50upx;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.item {
					box-sizing: border-box;
					width: 80%;
					display: flex;
					align-items: center;
					padding: 40upx 0;
					border-bottom: 2upx solid #d0ced8;

					.title {
						font-size: 28upx;
						margin-right: 60upx;
					}

					.content {
						font-size: 28upx;
					}
				}
			}

			.code {
				margin-top: 36upx;
				width: 164upx;
			}
		}
	}
</style>
