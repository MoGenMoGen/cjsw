<template>
	<view class="nav">
		<view class="dateBox">
			<view class="uni-list-cell-db">
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input" v-if="date==''">请选择日期</view>
					<view class="uni-input" v-else>{{ date }}</view>
				</picker>
			</view>
			<image class="iconimg" src="../static/dateicon.png" mode="widthFix" />
		</view>
		<view class="taskBox">
			<input type="text" class="task" :placeholder="placeholderIn" placeholder-class="placeholderStyle" v-model="cd"></input>
		</view>
		<view class="taskBtn" @click="search">
			搜索
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			placeholderIn: "",
		},
		data() {
			// const currentDate = this.getDate({
			// 	format: true,
			// });
			return {
				// date: currentDate,
				date: "",
				cd:""
			};
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value;
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === "start") {
					year = year - 60;
				} else if (type === "end") {
					year = year + 2;
				}
				month = month > 9 ? month : "0" + month;
				day = day > 9 ? day : "0" + day;
				return `${year}-${month}-${day}`;
			},
			search(){
				 this.$emit('search', {date:this.date,cd:this.cd})
			}
		},
		computed: {
			startDate() {
				return this.getDate("start");
			},
			endDate() {
				return this.getDate("end");
			},
		},
		created(){
			const currentDate = this.getDate({
				format: true,
			});
		}
	
	};
</script>

<style>
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 750rpx;
		height: 100rpx;
		background: #ffffff;
		opacity: 1;
	}

	.dateBox {
		width: 226rpx;
		height: 60rpx;
		border: 1rpx solid #303030;
		opacity: 1;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.uni-list-cell-db {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 16rpx;
		color: #909090;
		opacity: 1;
	}

	.iconimg {
		width: 36rpx;
	}

	.task {
		width: 312rpx;
		height: 60rpx;
		border: 1rpx solid #303030;
		opacity: 1;
		border-radius: 12rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		box-sizing: border-box;
		padding-left: 10upx;
	}

	.placeholderStyle {
		font-size: 24rpx;
		text-align: center;
		line-height: 60rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #909090;
		opacity: 1;
	}

	.taskBtn {
		width: 116rpx;
		height: 60rpx;
		background: #2b89f7;
		opacity: 1;
		border-radius: 12rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #ffffff;
		opacity: 1;
		text-align: center;
		line-height: 60rpx;
	}
</style>
