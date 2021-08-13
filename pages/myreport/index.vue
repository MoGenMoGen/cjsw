<!-- 我的报表页面 -->
<template>
	<view class="pages_myreport"> 
		<view class="container">
			<view class="hidden">
				<view class="head_switch" style="margin-top: 100upx;">
					<text class="switch_item" v-for="(item,index) in switchList" :key="index"
						@click="switchHead(item.sort)" :class="{activeheader:item.sort==currentheaderID}">
						{{item.dictValue}}
					</text>
				</view>
			</view>
			<view class="formList">
				<view class="listBody" v-for="(item,index) in formList" :key="index" @click="showDetail(index)">
					{{item.name}}
					<image src="../../static/arrow3.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			
				currentheaderID:"1",
			
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
				formList:[
					{
						name:"涂装离子风机保养记录表",
						
					},
					{
						name:"涂装离子风机保养记录表",
						
					},
					{
						name:"涂装离子风机保养记录表",
						
					},
					{
						name:"涂装离子风机保养记录表",
						
					},
					{
						name:"涂装离子风机保养记录表",
						
					}
				]
			};
		},
		methods:{
			switchHead(sort){
				if (this.currentheaderID != sort) {
					this.currentheaderID = sort
					uni.setStorageSync("currentheaderID", this.currentheaderID)
					// this.getwrapperList(this.currentheaderID)
					this.api.getReportList({id:this.switchList[sort-1].id}).then(res=>{
						this.formList=res
						
					})
				}
			},
			showDetail(index){
				this.api.getReportDtl({id:this.formList[index].id}).then(res=>{
					console.log(res);
				})
			}
			
			
		},
		onLoad() {
			this.api.getReportType().then(res=>{
				this.switchList=res
				this.api.getReportList({id:this.switchList[0].id}).then(res=>{
					this.formList=res
					console.log("2222",this.formList);
				})
			})
			
			
		}
		
	}
</script>

<style lang="scss">
	.pages_myreport{
		width: 100%;
		.pic{
			height: 400upx;
			width: 100%;
		}
		.container{
			width: 100%;
			.formList{
				padding: 40upx 20upx 500upx 20upx;
				box-sizing:border-box;
				background: #FAFAFA;
				margin-top: 80upx;
				.listBody{
					position: relative;
					margin-top: 20upx;
					background-color:#FFFFFF ;
					width: 710upx;
					padding: 50upx;
					box-sizing: border-box;
					font-size: 28upx;
					color: #606060;
					box-shadow: 0upx 2upx 4upx rgba(155, 155, 155, 0.08);
					border-radius: 12upx;
					image{
						position: absolute;
						width:12upx ;
						height: 21upx;
						top: 50%;
						right: 60upx;
						transform: translateY(-50%);
					}
				}
				
			}
			
			.hidden{
				top: 0;
				position: fixed;
				z-index: 100;
				background-color: #2957C4;
				height: calc(var(--status-bar-height) +86upx);
				width: 100%;
			}
			.head_switch{
				margin-top: calc(var(--status-bar-height) + 10upx);
				background-color: #2957C4;
				width: 100%;
				height: 76upx;
				overflow-x: scroll;
				white-space: nowrap;
				.switch_item{
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
	}
</style>
