<template>
	<view class="pages_reportformDetail">
		<view class="navigation">
			<view class="back" @click="back">
				<image src="../../static/back.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="title">
			{{name}}
		</view>
		<view class="para">
			<view class="paraList" v-for="(item,index) in para " :key="index">
				{{item}}
			</view>
		</view> 
     <view class="content">
				<avue-form ref="form" v-model="obj" :option="option" @reset-change="emptytChange" @submit="submit"
					@error="error">
				</avue-form>
	</view> 
	<view class="rmks"> 
		<view class="note">
			备注 
		</view>
		<view class="formTitle">
			{{name}}
		</view>
		<view class="rmksList" v-for="(item,index) in rmks" :key="index">
			{{item}}
		</view>
	</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				obj: {
					id: 123123
				},
				id:1,
				detailList:{
					
				},
				content:{
					
				},//输入框对象
				name:"",
				para:[],//设备信息
				rmks:[],//备注
				option:{
					column:[]
				}
				
			}
		},
		methods:{
			back(){
			uni.navigateBack({
				
			})}
			
		},
		onLoad(e) {
			console.log(1111, e);
			this.id=e.id
			this.api.getReportDtl({
				id:this.id
			}).then(res => {
				this.detailList=res
				console.log(this.detailList);
				this.content=JSON.parse(this.detailList.content)
				console.log("输入框列表",this.content)
				this.rmks=this.detailList.rmks.split("\n")
				console.log("备注",this.rmks);
				this.para=this.detailList.para.split("\n")
				console.log("设备信息",this.para);
				this.name=this.detailList.name
				this.option.column=this.content.column
			})
		},

	}
</script>

<style lang="scss" scoped>
	.pages_reportformDetail{
		width: 100%;
		.navigation{
			width: 100%;
			// background-color: #2957C4;
			background-color: #0984e3;
			padding:20upx;
			.back{
				width:24upx ;
				image{
					width:24upx !important;
				}
			}
		}
		.title{
			width: 100%;
			text-align: center;
			font-size: 32upx;
			font-weight: 600;
			color:rgba(0,0,0,0.9) ;
		}
		.para{
			width: 100%;
			padding: 0 40upx;
			box-sizing: border-box;
			margin-top: 60upx;
			.paraList{
				margin-top: 30upx;
				font-size: 28upx;
				color: rgba(0, 0, 0, 0.9);
			}
		}
		.content{
			text-align: center;
			margin-top: 60upx;
		}
		.rmks{
			background: #FAFAFA;
			padding: 60upx;
			font-size: 24upx;
			color: #606060;
			.note{
				
			}
			.rmksList{
				margin-top: 30upx;
			}
			.formTitle{
			    margin-top: 20upx;
				padding-left: 10upx;
				box-sizing: border-box;
				border-left: 4upx solid #2957C4;
			}
		}
	}
</style>
