<template>
	<!-- 我的信息详情 -->
	<view class="container">
			<view class="title">
				{{info.title}}
			</view>
			<view class="date">
				{{info.date}}
			</view>
			<image :src="info.img" mode="aspectFill"  class="img"/>
			<view class="content">
				{{info.content}}
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{title:'消息标题消息标题消息标题消息标题',
				content:'消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容',
				img:'../../static/banner1.png',
				date:'2020-01-05'
				}
			};
		},
		onLoad(e){
			console.log(e);
		}
	}
</script>

<style lang="scss">
.container{
	background-color: #fff;
	padding:44upx 28upx;
	.title{
		height: 44upx;
		font-size: 32upx;
		line-height: 44upx;
		color: #000000;
		font-weight: 600;
	}
	.date{
		height: 34upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #000000;
		padding: 10upx 0;
	}
	.img{
		width: 690upx;
		height: 320upx;
		padding:10upx 2upx;
	}
	.content{
		width: 672upx;
		font-size: 28upx;
		line-height: 40upx;
		color: #606060;
	}
}
</style>
