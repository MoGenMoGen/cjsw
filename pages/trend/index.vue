<template>
	
	<view>
		<view class="">
			<choosedate></choosedate>
		</view>
		<qiun-title-bar title="基本折线图"/>
		<view class="charts-box">
		  <qiun-data-charts type="line" :chartData="chartsDataLine1"/>
		</view>
	</view>
</template>

<script>
	import choosedate from "../../components/choosedate.vue"
	export default {
		data() {
			return {
				chartsDataLine1:{
		categories: ["2012", "2013", "2014", "2015","2016", "2017", "2018", "2019", "2020", "2021"],
		series: [{
			name: "成交量A",
			data: [50,70,55,130,35, 8, 25, 37, 4, 20]
		},
		// {
		// 	name: "成交量B",
		// 	data: [70, 40, 65, 10,200,164,30,100, 44, 68]
		// }, {
		// 	name: "成交量C",     
		// 	data: [100, 80, 95, 150, 99,215,44,86,112, 132]
		// },
		]
	},
			}
		},
		methods: {
			
		},
		components:{
			choosedate
		},
		async onLoad(){
			// 获取折线图数据
			let siteValList=await this.api.getsiteValList({site:'CCF_FAN_VT',st:'2021-06-21 00:00:00',et:'2021-07-21 23:00:00'})
			this.chartsDataLine1.categories=siteValList.date.map(item=>item.slice(0,10));
			this.chartsDataLine1.series[0].data=siteValList.data.map(item=>Number(item))
		}
	}
</script>

<style>

</style>
