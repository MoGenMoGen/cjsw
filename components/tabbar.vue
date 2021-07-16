<template>
	<view class="componet_tabbar" :style="{'margin-bottom': paddingBottomHeight + 'upx'}">
		<view class="tab_container" >
			<view class="item" v-for="(item, index) in tabList" :key="index" @click="changeactive(index, item)">
				<image class="icon" v-if="current !== index" :src="item.icon[0]" mode="widthFix"></image>
				<image class="icon" v-else :src="item.icon[1]" mode="widthFix"></image>
				<text :class="{isSelected:current == index}">{{ item.title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// 首页图
	import home from "@/static/home.png";
	import homeSelected from "@/static/homeSelected.png";
	// 企业查图
	import firmQuery from "@/static/firmQuery.png";
	import firmQuerySelected from "@/static/firmQuerySelected.png";
	// 我的图
	import profile from "@/static/profile.png";
	import profileSelected from "@/static/profileSelected.png";
	// 整改单图
	import rectify from "@/static/rectify.png";
	import rectifySelected from "@/static/rectifySelected.png";
	// 自检任务图
	import selfCheck from "@/static/selfCheck.png";
	import selfCheckSelected from "@/static/selfCheckSelected.png";
	export default {
		props: {
			loginType: {
				type: Number,
				default () {
					return 1; //1：企业 2：服务商 3：监管机构
				},
			},
			tabIndex: {
				type: Number,
				default () {
					return 0;
				}
			},
			// 这个name是为了切换tab清空整改单首页userinfo.dept_id
			// 原因：从企业查详情跳转到整改单，会传递该企业的deptid,这时整改单列表显示的是该企业的整改单，但切换tab后要显示全部的;
			// 页面onload中接收了传递过来的deptid后一直存在，所以切换tab显示的仍然是该企业的整改单列表
			name:{
				type:String,
				default(){
					return '';
				}
			}
		},
		data() {
			return {
				// 图片
				home,
				homeSelected,
				firmQuery,
				firmQuerySelected,
				profile,
				profileSelected,
				rectify,
				rectifySelected,
				selfCheck,
				selfCheckSelected,
				current: 0, //当前选中
				paddingBottomHeight: 0, //苹果X以上手机底部适配高度
				// 1.企业
				tabList1: [{
						path: "/pages/index/index",
						title: "首页",
						icon: [home, homeSelected],
					},   
					{
						path: "/pages/selfCheck/index",
						title: "自检任务",
						icon: [selfCheck, selfCheckSelected],
					},
					{
						path: "/pages/rectify/index",
						title: "整改单",
						icon: [rectify, rectifySelected],
					},
					{
						path: "/pages/profile/index",
						title: "我的",
						icon: [profile, profileSelected],
					},
				],
				// 2：服务商3:监管机构相同
				tabList2: [{
						path: "/pages/index/index",
						title: "首页",
						icon: [home, homeSelected],
					},

					{
						path: "/pages/rectify/index",
						title: "整改单",
						icon: [rectify, rectifySelected],
					},
					{
						path: "/pages/firmQuery/index",
						title: "企业查",
						icon: [firmQuery, firmQuerySelected],
					},
					{
						path: "/pages/profile/index",
						title: "我的",
						icon: [profile, profileSelected],
					},
				],

			};
		},
		computed: {
			tabList() {
				//loginTye=1为tabList1、loginTye=2|3为tabList2
				return this.loginType == 1 ? this.tabList1 : this.tabList2
			}
		},
		methods: {
			//   切换tab
			changeactive(index, item) {
				// this.current = this.tabIndex;
				// console.log('tab',this.tabIndex);
				console.log(index, item)
				if(this.name=='rectify'){
					//清空整改单主页userinfo.dept_id
					this.$emit("clearId")
					
				}
				uni.switchTab({
					url: item.path
				})

				//  将item.path传给父组件，父组件跳转页面,index作为新页面的current
				// this.$emit("tabChange", item.path)
			}
		},
		created() {
			// 适配iphone底部
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					model.forEach(item => {
						//适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
							that.paddingBottomHeight = -43;
						}
					})
				}
			});
		},
		mounted() {
			this.current = this.tabIndex;
			console.log(this.current);
		}
	};
</script>

<style lang="scss" scoped>
	.componet_tabbar {
		position: fixed;
		bottom:0;
		width: 100%;
		border-top: 3upx solid #D8D8D8;
			height: 170upx;
			box-sizing: border-box;  
		// padding-bottom: 0;  
		// padding-bottom: constant(safe-area-inset-bottom);  
		// padding-bottom: env(safe-area-inset-bottom);
		.tab_container {
			box-sizing: border-box;
			background-color: #fff;
			height: 170upx;
			display: flex;
			width: 100%;
			box-sizing: border-box;
			justify-content: space-around;
			align-items: center;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 170upx;

				.icon {
					width: 48upx;
					height: 48upx;
				}

				text {
					padding-top: 14upx;
					font-size: 24upx;
				}

				.isSelected {
					color: #2B89F7;
				}
			}
		}
	}
</style>
