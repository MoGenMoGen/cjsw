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
					<text class="title">真实姓名:</text>
					<input type="text" class="content" v-model="info.name" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">员工工号:</text>
					<input type="text" class="content" v-model="info.account" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">部门名称:</text>
					<input type="text" class="content" v-model="info.deptId" disabled="true"></input>
					<!-- <image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image> -->
				</view>
				<!-- <view class="item">
					<text class="title">职位名称:</text>
					<text class="content">{{ info.post }}</text>
				</view> -->
				<view class="item">
					<text class="title">性别:</text>
					<picker class="content" mode="selector" :range="sexes" @change="handleChangeSex"
						:disabled="!ifEdit">
						<text>{{sexes[index1]}}</text>
					</picker>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">政治面貌:</text>
					<picker mode="selector" :range="statuses" @change="handleChangeStatus" :disabled="!ifEdit">
						<view>{{statuses[index2]}}</view>
					</picker>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">籍贯:</text>
					<input type="text" class="content" v-model="info.place" :disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">联系电话:</text>
					<input type="number" maxlength="11" class="content" v-model="info.phone"
						:disabled="!ifEdit"></input>
					<image :src="pen" mode="widthFix" v-show='ifEdit' class='pen'></image>
				</view>
				<view class="item">
					<text class="title">联系地址:</text>
					<input type="text" class="content" v-model="info.addr" :disabled="!ifEdit"></input>
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

			button {
				margin: 50upx 0;
				border-radius: 25upx;
			}
		}
	}
</style>
