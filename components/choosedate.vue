<template>
	<view class="nav">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="leftcell">
					<picker mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
						<view class="uni-input">{{date1}}</view>
					</picker>
					<text style="height: 80upx;line-height: 80upx;">~</text>
					<picker mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDateChange2">
						<view class="uni-input">{{date2}}</view>
					</picker>
				</view>

				<image class="iconimg" src="../static/dateicon.png" mode="widthFix" style="width: 50upx;" />
			</view>
		</view>
	</view>
</template>   

<script>
	export default {
		props: {},
		data() {
			const currentDate = this.getDate({
				format: true,
			});
			return {
				// date: currentDate,
				date1: currentDate,
				date2: currentDate,
			};
		},
		methods: {
			bindDateChange1: function(e) {
				if(new Date(this.date1).getTime()<=new Date(this.date2).getTime())
				this.date1 = e.target.value;
				else
				{
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},    
			bindDateChange2: function(e) {
				if(new Date(this.date1).getTime()<=new Date(this.date2).getTime())
				this.date2 = e.target.value;
				else
				{
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === "start") {
					year = year - 60;
				} 
				else if (type === "end") {
					// year = year + 2;
					year = year ;
				}
				month = month > 9 ? month : "0" + month;
				day = day > 9 ? day : "0" + day;
				return `${year}-${month}-${day}`;
			},
			search() {
				this.$emit('search', {
					date: this.date,
					cd: this.cd
				})
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
		created() {
			const currentDate = this.getDate({
				format: true,
			});
		}

	};
</script>

<style scoped lang="scss">
	.uni-list-cell{
		margin:30upx auto;
		display: flex;
		align-items: center;
		width: 450upx;
		border:1px solid #ccc;
		border-radius: 30upx;
		padding:0 20upx;
		justify-content: space-between;
		.leftcell{ 
			width: 420upx;
			display: flex;
			align-items: center;
			// padding:0 20upx;
			.uni-input {
				height: 80upx;
				line-height: 80upx;
			}
		}
		
	}
	
</style>
