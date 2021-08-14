<template>
	<view class="uni-list-cell">
		<view class="leftcell">
			<!-- 开始年月日 -->
			<picker mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
				<view class="uni-input">{{lessdate1}}</view>
			</picker>
			<!-- 开始时分秒 -->
			<picker mode="time" :value="time1" start="00:00" end="23:59" @change="bindTimeChange1">
				<view class="uni-input">{{time1}}</view>
			</picker>
			<text style="height: 60upx;line-height: 60upx;">~</text>
			<!-- 结束年月日 -->
			<picker mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDateChange2">
				<view class="uni-input">{{lessdate2}}</view>
			</picker>
			<!-- 结束时分秒 -->
			<picker mode="time" :value="time2" start="00:00" end="23:59" @change="bindTimeChange2">
				<view class="uni-input">{{time2}}</view>
			</picker>
		</view>

		<!-- <image class="iconimg" src="../static/dateicon.png" mode="widthFix" style="width: 40upx;" /> -->
	</view>
</template>

<script>
	import moment from "moment";
	export default {
		props: {
			CheckedCount: {
				type: Number,
				default: 0
			}
		},
		data() {
			const currentDate = this.getDate({});
			return {
				// date: currentDate,
				date1: currentDate,
				date2: currentDate,
				time1: '00:00',
				time2: '23:59'
			};
		},

		methods: {
			bindDateChange1: function(e) {
				console.log(`${e.target.value} ${this.time1}`, `${this.date2} ${this.time2}`);
				// 开始时间小于结束时间
				if (moment(`${e.target.value} ${this.time1}`).valueOf() <= moment(`${this.date2} ${this.time2}`)
					.valueOf()) {
					// 1条数据大于36h
					if ((moment(`${this.date2} ${this.time2}`).valueOf() - moment(`${e.target.value} ${this.time1}`)
							.valueOf()) > 129600000) {
						uni.showToast({
							title: '总时间需小于36h',
							icon: "none",
							duration: 2000
						})
					}
					// 总时间不超过36h
					else if ((moment(`${this.date2} ${this.time2}`).valueOf() - moment(
							`${e.target.value} ${this.time1}`).valueOf()) * this.CheckedCount <= 129600000) {
						this.date1 = e.target.value
						// console.log('日期变化',`${this.date1} ${this.time1}:00`);
						this.$emit('func', {
							startDate: `${this.date1} ${this.time1}:00`,
							endDate: `${this.date2} ${this.time2}:00`
						})
					}
					// 总时间超过了36h
					else {
						uni.showToast({
							title: '总时间需小于36h',
							icon: "none",
							duration: 2000
						})
					}
				} else {
					// console.log(moment(`${e.target.value} ${this.time1}`).valueOf(), moment(
					// `${this.date2} ${this.time2}`).valueOf());
					console.log(`${e.target.value} ${this.time1}`, `${this.date2} ${this.time2}`);
					uni.showToast({
						title: '开始时间需小于结束时间',
						icon: "none",
						duration: 2000
					})
				}
			},
			bindDateChange2: function(e) {
				if (moment(`${this.date1} ${this.time1}`).valueOf() <= moment(`${e.target.value} ${this.time2}`)
					.valueOf()) {
					// 总时间不超过36h
					if ((moment(`${e.target.value} ${this.time2}`).valueOf() - moment(`${this.date1} ${this.time1}`)
							.valueOf()) * this.CheckedCount <= 129600000) {
						this.date2 = e.target.value;
						this.$emit('func', {
							startDate: `${this.date1} ${this.time1}:00`,
							endDate: `${this.date2} ${this.time2}:00`
						})
					}
					// 总时间超过了36h
					else {
						uni.showToast({
							title: '总时间需小于36h',
							icon: "none",
							duration: 2000
						})
					}

				} else {
					console.log(moment(`${this.date1} ${this.time1}`).valueOf(), moment(
						`${e.target.value} ${this.time2}`).valueOf());
					uni.showToast({
						title: '开始时间需小于结束时间',
						icon: "none",
						duration: 2000
					})
				}
			},
			bindTimeChange1: function(e) {
				if (moment(`${this.date1} ${e.target.value}`).valueOf() <= moment(`${this.date2} ${this.time2}`)
					.valueOf()) {
					// 总时间不超过36h
					if ((moment(`${this.date2} ${this.time2}`).valueOf() - moment(`${this.date1} ${e.target.value}`)
							.valueOf()) * this.CheckedCount <= 129600000) {
						this.time1 = e.target.value;
						this.$emit('func', {
							startDate: `${this.date1} ${this.time1}:00`,
							endDate: `${this.date2} ${this.time2}:00`
						})
					}
					// 总时间超过了36h
					else {
						uni.showToast({
							title: '总时间需小于36h',
							icon: "none",
							duration: 2000
						})
					}

				} else {
					console.log(moment(`${this.date1} ${e.target.value}`).valueOf(), moment(
						`${this.date2} ${this.time2}`).valueOf());
					uni.showToast({
						title: '开始时间需小于结束时间',
						icon: "none",
						duration: 2000
					})
				}
			},
			bindTimeChange2: function(e) {
				if (moment(`${this.date1} ${this.time1}`).valueOf() <= moment(`${this.date2} ${e.target.value}`)
					.valueOf()) {
					// 总时间不超过36h
					if ((moment(`${this.date2} ${e.target.value}`).valueOf() - moment(`${this.date1} ${this.time1}`)
							.valueOf()) * this.CheckedCount <= 129600000) {

						console.log('时间戳为', (moment(`${this.date2} ${e.target.value}`).valueOf() - moment(
							`${this.date1} ${this.time1}`).valueOf()) * this.CheckedCount);

						this.time2 = e.target.value;
						this.$emit('func', {
							startDate: `${this.date1} ${this.time1}:00`,
							endDate: `${this.date2} ${this.time2}:00`
						})
					}
					// 总时间超过了36h
					else {
						uni.showToast({
							title: '总时间需小于36h',
							icon: "none",
							duration: 2000
						})
					}

				} else {
					console.log(moment(`${this.date1} ${this.time1}`).valueOf(), moment(
						`${this.date2} ${e.target.value}`).valueOf());
					uni.showToast({
						title: '开始时间需小于结束时间',
						icon: "none",
						duration: 2000
					})
				}
			},
			getDate(type) {
				let date = moment().format("YYYY-MM-DD");
				// let year =moment().get('year')
				// let month = moment().get('month')+1
				// let day = moment().get('date')

				if (type === "start") {
					date = moment().add(-1, 'years').format("YYYY-MM-DD")
				} else if (type === "end") {
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
			lessdate1() {
				return `${this.date1}`.slice(5)
			},
			lessdate2() {
				return `${this.date2}`.slice(5)
			}

		},
		created() {
			this.time2 = moment().format("HH:mm")
			const currentDate = this.getDate({
				format: true,
			});
			// this.$emit('getdate', {startDate:`${this.date1} ${this.time1}:00`,endDate:`${this.date2} ${this.time2}:00`})
		}

	};
</script>

<style scoped lang="scss">
	.uni-list-cell {
		// width: 750upx;
		// box-sizing: border-box;
		// margin: 0upx 10upx;
		// display: flex;
		white-space: nowrap;
		// flex-wrap: nowrap;
		align-items: center;
		// width: 650upx;
		border: 1px solid #ccc;
		border-radius: 30upx;
		// padding: 0 20upx;
		// justify-content: space-between;
		border: 2upx solid #1989FA;
		.leftcell {
			// width: 600upx;
			display: flex;
			align-items: center;
			justify-content: center;

			picker {
				margin: 0 5upx;
				// padding:0 20upx;
			.uni-input {
				height: 60upx;
				line-height: 60upx;
				// font-size: 32upx;
				font-size: 28upx;
			}
			}

			
		}

	}
</style>
