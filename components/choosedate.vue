<template>
	<view class="nav">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="leftcell">
					<!-- 开始年月日 -->
					<picker mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
						<view class="uni-input">{{date1}}</view>
					</picker>
					<!-- 开始时分秒 -->
					<picker mode="time" :value="time1" start="00:00" end="23:59" @change="bindTimeChange1">
						<view class="uni-input">{{time1}}</view>
					</picker>
					<text style="height: 80upx;line-height: 80upx;">~</text>
					<!-- 结束年月日 -->
					<picker mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDateChange2">
						<view class="uni-input">{{date2}}</view>
					</picker>
					<!-- 结束时分秒 -->
					<picker mode="time" :value="time2" start="00:00" end="23:59" @change="bindTimeChange2">
						<view class="uni-input">{{time2}}</view>
					</picker>
				</view>

				<image class="iconimg" src="../static/dateicon.png" mode="widthFix" style="width: 50upx;" />
			</view>
		</view>
	</view>
</template>   

<script>
	import moment from "moment";
	export default {
		props: {},
		data() {
			const currentDate = this.getDate({
			});
			return {
				// date: currentDate,
				date1: currentDate,
				date2: currentDate,
				time1:'00:00',
				time2:'23:59'	
			};
		},
		methods: {
			bindDateChange1: function(e) {
				if(moment(`${e.target.value} ${this.time1}`).valueOf()<=moment(`${this.date2} ${this.time2}`).valueOf())
				{
					this.date1 = e.target.value;
					// console.log('日期变化',`${this.date1} ${this.time1}:00`);
						this.$emit('func', {startDate:`${this.date1} ${this.time1}:00`,endDate:`${this.date2} ${this.time2}:00`})
				}
				else
				{
					console.log(moment(`${e.target.value} ${this.time1}`).valueOf(),moment(`${this.date2} ${this.time2}`).valueOf());
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},    
			bindDateChange2: function(e) {
				if(moment(`${this.date1} ${this.time1}`).valueOf()<=moment(`${e.target.value} ${this.time2}`).valueOf())
				{
					this.date2 = e.target.value;
					this.$emit('func', {startDate1:`${this.date1} ${this.time1}:00`,endDate1:`${this.date2} ${this.time2}:00`})
				}
				else
				{
					console.log(moment(`${this.date1} ${this.time1}`).valueOf(),moment(`${e.target.value} ${this.time2}`).valueOf());
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},
			bindTimeChange1:function(e) {
				if(moment(`${this.date1} ${e.target.value}`).valueOf()<=moment(`${this.date2} ${this.time2}`).valueOf())
				{
					this.time1 = e.target.value;
					this.$emit('func', {startDate1:`${this.date1} ${this.time1}:00`,endDate1:`${this.date2} ${this.time2}:00`})
				}
				else
				{
					console.log(moment(`${this.date1} ${e.target.value}`).valueOf(),moment(`${this.date2} ${this.time2}`).valueOf());
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},
			bindTimeChange2:function(e) {
			if(moment(`${this.date1} ${this.time1}`).valueOf()<=moment(`${this.date2} ${e.target.value}`).valueOf())
			{
				this.time2 = e.target.value;
				this.$emit('func', {startDate1:`${this.date1} ${this.time1}:00`,endDate1:`${this.date2} ${this.time2}:00`})
			}
				else
				{
					console.log(moment(`${this.date1} ${this.time1}`).valueOf(),moment(`${this.date2} ${e.target.value}`).valueOf());
					uni.showToast({
						title:'开始时间需小于结束时间',
						icon:"none",
						duration:2000
					})
				}
			},
			getDate(type) {
				let date=moment().format("YYYY-MM-DD");	
				// let year =moment().get('year')
				// let month = moment().get('month')+1
				// let day = moment().get('date')

				if (type === "start") {
					date =moment().add(-1, 'years').format("YYYY-MM-DD")
				} 
				else if (type === "end") {    
					// year = year + 2;
				}
				return date;
			},
			
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
			this.time2=moment().format("HH:mm")
			const currentDate = this.getDate({
				format: true,
			});
			// this.$emit('getdate', {startDate:`${this.date1} ${this.time1}:00`,endDate:`${this.date2} ${this.time2}:00`})
		}

	};
</script>

<style scoped lang="scss">
	.uni-list-cell{
		margin:30upx auto;
		display: flex;
		align-items: center;
		width: 630upx;
		border:1px solid #ccc;
		border-radius: 30upx;
		padding:0 20upx;
		justify-content: space-between;
		.leftcell{ 
			width: 600upx;
			display: flex;
			align-items: center;  
			picker{
			margin:0 5upx;	
			}
			// padding:0 20upx;
			.uni-input {
				height: 80upx;
				line-height: 80upx;
			}
		}
		
	}
	
</style>
