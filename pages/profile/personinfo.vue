<template>
	<!-- 个人信息页面 -->
	<view class="pages_personinfo">
		<view class="container">
			<view class="avatarbox" @click="changeAvatar">
				<view class="avatar">
					<image :src="info.avatar" mode="aspectFill" />
				</view>
				<view class="avataredit">
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>

			</view>
			<view class="list">
				<view class="item">
					<view class="title">真实姓名:</view>
					<input type="text" maxlength="8" class="content" v-model="info.name" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<view class="title">员工工号:</view>
					<input type="text" maxlength="11" class="content" v-model="info.account" disabled="true"></input>
					<!-- <image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image> -->
				</view>
				<view class="item">
					<view class="title">部门名称:</view>
					<input type="view" maxlength="10" class="content" v-model="info.deptId" disabled="true"></input>
					<!-- <image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image> -->
				</view>
				<!-- <view class="item">
					<view class="title">职位名称:</view>
					
					<view class="content">{{ info.post }}</view>
				</view> -->
				<view class="item">
					<view class="title" >性别:</view>
					<picker class="content" mode="selector" :range="sexes" @change="handleChangeSex"
						:disabled="!ifEdit">
						<view  class="content"> {{sexes[index1]}}</view>
					</picker>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<view class="title">政治面貌:</view>
					<picker class="content" mode="selector" :range="statuses" @change="handleChangeStatus" :disabled="!ifEdit">
						<view  class="content">{{statuses[index2]}}</view>
					</picker>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<view class="title">籍贯:</view>
					<input type="view" maxlength="20" class="content" v-model="info.place" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<view class="title">联系电话:</view>
					<input type="number" maxlength="11" class="content" v-model="info.phone"
						:disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<view class="title">联系地址:</view>
					<input type="text" maxlength="20" class="content" v-model="info.addr" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				


			</view>
			<button @click="ifEdit=true" v-show="!ifEdit">修改信息</button>
			<button @click="save" v-show="ifEdit">保存信息</button>
		</view>

	</view>
</template>

<script>
	import avatar from "static/avatar.png";
	import pen from 'static/pen.png'
	export default {
		data() {
			return {
				avatar,
				pen,
				id: "",
				ifEdit: false,
				index1: 0, //性别
				index2: 0, //政治面貌
				statuses: ['群众', '党员', '团员'],
				sexes: ['男', '女'],
				info: {
					avatar,

				},
			};
		},
		methods: {
			// 更换头像
			async changeAvatar() {
				if (this.ifEdit) {
					// 图片上传接口
					let avatar = await this.api.chooseImages('', 1)
					console.log(1111111);
					let res = await this.api.upLoad(avatar[0])
					this.info.avatar=res
					
				}

			},
			// 更改政治面貌
			handleChangeStatus(e) {
				this.index2 = e.target.value;
				this.info.party = this.index2 + 1
			},
			handleChangeSex(e) {
				this.index1 = e.target.value;
				this.info.sex = this.index1 + 1
			},
			// 保存信息
			save() {
				this.ifEdit = false
				console.log(this.info);
				this.api.modidyPersoninfo(this.info).then(()=>{
				  uni.showToast({
				    title: '保存成功',
				    icon: 'success',
				    duration: 2000
				  })
				  this.ifEdit = false
				})

			},
		},
		async onLoad() {
			this.info = await this.api.getPersoninfo()
			this.index1 = Number(this.info.sex) - 1
			this.index2 = Number(this.info.party) - 1

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
	.pen {
		width: 30upx;
	}

	.pages_personinfo {
		width: 100%;
		// height: 100vh;
		background: #fafafa;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		padding: 20upx;
		padding-bottom: 100upx;

		.container {
			// height: calc(100vh - 88upx - 100upx);
			width: 100%;
			background: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;

			.avatarbox {
				position: relative;

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

				.avataredit {
					position: absolute;
					bottom: 0;
					right: 0;
				}

			}


			.list {
				margin-top: 100upx;
				// padding: 0 50upx;
				width: 100%;
				box-sizing: border-box;
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
						width: 150upx;
						font-size: 28upx;
						margin-right: 20upx;
					}

					.content {
						font-size: 28upx;
						flex:1;
						overflow: hidden;
					}
				}
			}

			.code {
				margin-top: 36upx;
				width: 164upx;
			}

			button {
				margin: 50upx 0;
				border-radius: 25upx;
			}
		}
	}
</style>
