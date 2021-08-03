<template>
	<view class="table">
		<view class="tr">
			<text class="td">
				1
			</text>
			<text class="td">
				1
			</text>
			<text class="td">
				1
			</text>
			<text class="td">
				1
			</text>
		</view>
		<view class="tr">
			<text class="td">
				ff
			</text>
			<text class="td">
				ff
			</text>
			<text class="td">
				ff
			</text>
			<text class="td">
				ff
			</text>
		</view>
	</view>
</template>  
<script></script>
<style lang="scss">
	.table{
		margin:50upx auto;
		padding:1upx;
		.tr{
			// padding:1upx;
			display: flex;
			.td{
				display: inline-block;
				width: 100upx;
				height: 60upx;
				line-height: 60upx;
				border-left:1px solid #333 ;
				border-top:1px solid #333 ;
				text-align: center;
			}
			.td:last-child(){
				border:1px solid #333;
			}
		}
	}
	
</style>