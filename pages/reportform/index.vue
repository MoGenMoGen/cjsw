<!-- 报表页面 -->
<template>
	<view class="pages_reportform">
		<view class="container">
			<view class="hidden">
				<view class="head_switch">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(item.id)" :class="{activeheader:item.id==currentheaderID}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<view class="containerBody" v-for="(item,index) in surface" :key="index">
				<view class="containerTitle">
					{{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				switchList: [{
						dictValue: '涂装线',
						id: '1'
					},
					{
						dictValue: '供漆',
						id: '2'
					}, {
						dictValue: '机器人',
						id: '3'
					},
					{
						dictValue: '废弃处理',
						id: '4'
					},
					{
						dictValue: '冰水机房',
						id: '5'
					},
					{
						dictValue: '空压机',
						id: '6'
					},
					{
						dictValue: '安全环保',
						id: '7'
					}
				],
				currentheaderID: '1',
				surface:[
					{
						title:"涂装离子风机保养记录表",
					},
					
				]
			}
		},
		methods: {
			switchHead(id){
				if (this.currentheaderID != id) {
					this.currentheaderID = id
					uni.setStorageSync("currentheaderID", this.currentheaderID)
					// this.getwrapperList(this.currentheaderID)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages_reportform{
		width: 100%;
		.container{
			width:100%;
		.hidden {
			top: 0;
			position: fixed;
			z-index: 100;
			background-color: #2957C4;
			height: calc(var(--status-bar-height) +86upx);
			// overflow: hidden;
			width: 100%;
		
			.head_switch {
				// position: fixed;
				margin-top: calc(var(--status-bar-height) + 10upx);
				// z-index: 100;
				background-color: #2957C4;
				width: 100%;
				height: 76upx;
				// padding-bottom: 12upx;
				overflow-x: scroll;
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
		}
		.containerBody{
			width: 100%;
			margin-top: 100upx;
			padding: 62upx 0 0 0  ; 
			box-sizing: border-box;
			.containerTitle{
				text-align: center;
				font-size: 32upx;
				color: rgba(0, 0, 0, 0.9);
				font-weight: 600;
				}
		}
		}
		
		
	}
</style>
