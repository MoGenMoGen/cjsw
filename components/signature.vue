<template>
    <view class='contents'>
        <canvas  v-if="!signImage" class='firstCanvas' canvas-id="secondCanvas" @touchmove='move' @touchstart='start($event)' @touchend='end'
         @touchcancel='cancel' @longtap='tap' disable-scroll='true' @error='error'>
        </canvas>
		<image :src="signImage" mode="" v-if="signImage" ></image>
        <view class="caozuo">
            <view class="chongqian" @tap='clearClick'>
                重签
            </view>
            <view class="over" @tap="overSign" v-if="!signImage">
                完成签名
            </view>
        </view>
    </view>
</template>

<script>
    var content = null;
    var touchs = [];
    var canvasw = 0;
    var canvash = 0;
    var _that;
    //获取系统信息
    uni.getSystemInfo({
        success: function(res) {
            canvasw = res.windowWidth;
            canvash = res.windowHeight;
        },
    })
    export default {
        data() {
				
            return {
				content :"",
                signImage: '',
                isEnd: false // 是否签名
            }
        },

        methods: {
            overSign: function() {
				
					_that=this
                if (this.isEnd) {
                    uni.canvasToTempFilePath({
                        canvasId: 'secondCanvas',
						fileType:'jpg',
                        success: function(res) {
                            //打印图片路径74
							
							uni.showToast({
								title:"签名成功",
								icon:"none"
							})
                            console.log(res.tempFilePath)
                            console.log('完成签名')
                            //设置图片
                            _that.signImage = res.tempFilePath
							console.log(_that.signImage)
							_that.$emit("signImage", _that.signImage)
                        }
                    },this)
                } else {
                    uni.showToast({
                        title: '请先完成签名',
                        icon: "none",
                        duration: 1500,
                        mask: true
                    })
                }

            },

            // 画布的触摸移动开始手势响应
            start: function(event) {
                // console.log(event)
                console.log("触摸开始" + event.changedTouches[0].x)
                console.log("触摸开始" + event.changedTouches[0].y)
                //获取触摸开始的 x,y
                let point = {
                    x: event.changedTouches[0].x,
                    y: event.changedTouches[0].y
                }
                // console.log(point)
                touchs.push(point);

            },
            // 画布的触摸移动手势响应
            move: function(e) {
                let point = {
                    x: e.touches[0].x,
                    y: e.touches[0].y
                }
                // console.log(point)
                touchs.push(point)
                if (touchs.length >= 2) {
                    this.draw(touchs)
                }
            },

            // 画布的触摸移动结束手势响应
            end: function(e) {
                console.log("触摸结束" + e)
                // 设置为已经签名
                this.isEnd = true
                // 清空轨迹数组
                for (let i = 0; i < touchs.length; i++) {
                    touchs.pop()
                }

            },

            // 画布的触摸取消响应
            cancel: function(e) {
                console.log("触摸取消" + e)
            },

            // 画布的长按手势响应
            tap: function(e) {
                console.log("长按手势" + e)
            },

            error: function(e) {
                console.log("画布触摸错误" + e)
            },

            //绘制
            draw: function(touchs) {
                console.log(touchs[0],touchs[1])
                let point1 = touchs[0]
                let point2 = touchs[1]
                touchs.shift()
                this.content.moveTo(point1.x, point1.y)
               this.content.lineTo(point2.x, point2.y)
                this.content.stroke()
                this.content.draw(true)
            },
            //清除操作
            clearClick: function() {
				//清除画布
				this.content.clearRect(0, 0, canvasw, canvash)
				this.content.draw(true)
                // 设置为未签名
                this.isEnd = false
				this.signImage=''
				this.$parent.bodyList.receiptSign=""
                
            },
        },
        /**
         * 生命周期函数--监听页面加载
         */
        mounted() {
            _that = this
            //获得Canvas的上下文
            this.content = uni.createCanvasContext('secondCanvas',this)
            //设置线的颜色
            this.content.setStrokeStyle("#000")
            //设置线的宽度
            this.content.setLineWidth(5)
            //设置线两端端点样式更加圆润
            this.content.setLineCap('round')
            //设置两条线连接处更加圆润
            this.content.setLineJoin('round')
        },

    }
</script>

<style>
    .ts {
        color: #FF485D;
        font-size: 30upx;
        height: 100upx;
        line-height: 100upx;
        padding-left: 20upx;
    }

    canvas {
        background-color: #DDDDDD;
        width: 100%;
        margin: 0 30rpx 0 0;
        height: 400rpx;  
    }
    image{
		width: 100%;
		margin: 0 30rpx 0 0;
		height: 400rpx;
	}
    .contents {
        padding-top: 20upx;
        padding-bottom: 100upx;
        box-sizing: border-box;
    }

    #signatureImg {
        background-color: #EEEEEE;
    }

    .caozuo {
        display: flex;
		justify-content: space-around;

        /* position: fixed; */
        left: 0;
        bottom: 0;
    }
	.caozuo view{
		width: 240rpx;
		height: 75rpx;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		
	}
  

    .caozuo view:active {
        background-color: #CCCCCC;
        color: #333333;
    }

    .chongqian {
		
		background: #FFFFFF;
		border: 2rpx solid #50A1FF;
		opacity: 1;
		border-radius: 12rpx;
    }

    .over {
        color:#ffffff ;
        background: #50A1FF;
        opacity: 1;
        border-radius: 12rpx;
    }
</style>