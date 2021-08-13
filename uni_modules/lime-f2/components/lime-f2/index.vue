<template>
	<view class="l-f2" :style="customStyle" v-if="canvasId">
		<!-- #ifndef APP-NVUE -->
		<cover-view class="l-f2__mask" v-if="isMask"></cover-view>
		<canvas
			class="l-f2__canvas"
			v-if="use2dCanvas"
			type="2d"
			:id="canvasId"
			:style="'width:' + width + 'px;height:' + height + 'px'"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		/>
		<canvas
			class="l-f2__canvas"
			v-else
			:width="nodeWidth"
			:height="nodeHeight"
			:style="'width:' + width + 'px;height:' + height + 'px'"
			:canvas-id="canvasId"
			:id="canvasId"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		/>
		<view v-if="isCloud" style="width:2048px; height:2048px; position: fixed; left: 9999px;">
			<canvas v-if="use2dCanvas" type="2d" :canvas-id="canvasId + '_cloud'" :id="canvasId + '_cloud'" class="l-f2__canvas"></canvas>
			<canvas v-else :canvas-id="canvasId + '_cloud'" :id="canvasId + '_cloud'" class="l-f2__canvas"></canvas>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<web-view
			class="l-f2__canvas"
			:id="canvasId"
			ref="webview"
			:webviewStyles="webviewStyles"
			src="http://liangei.gitee.io/limeui/hybrid/html/lime-ui/lime-f2/index.html?v=0.4.8"
			@pagefinish="isFinish = true"
			@onPostMessage="onMessage"
		></web-view>
		<!-- #endif -->
	</view>
</template>
<script>
// #ifndef APP-NVUE
import extendContext from './canvas';
import { compareVersion, wrapEvent, pixelRatio } from './utils';
// #endif
// #ifdef APP-NVUE
import { base64ToPath } from './utils';
// #endif
export default {
	// version: '0.5.1'
	name: 'l-f2',
	props: {
		// #ifdef MP-WEIXIN || MP-TOUTIAO
		type: {
			type: String,
			default: '2d'
		},
		// #endif
		// #ifdef APP-NVUE
		webviewStyles: Object,
		params: {
			type: Object,
			default: () => {}
		},
		// #endif
		customStyle: String,
		imageMask: String,
		source: {
			type: Array,
			default: () => []
		},
		isAutoPlay: Boolean,
		isDisableScroll: Boolean,
		isCloud: Boolean,
		onInit: {
			type: [Function, Object],
			default: () => {}
		}
	},
	data() {
		return {
			// #ifdef MP-WEIXIN || MP-TOUTIAO
			use2dCanvas: true,
			// #endif
			// #ifndef MP-WEIXIN || MP-TOUTIAO
			use2dCanvas: false,
			// #endif
			// #ifndef APP-NVUE
			width: null,
			height: null,
			nodeWidth: null,
			nodeHeight: null,
			isMask: false,
			isInited: false,
			imageData: null,
			// config: {},
			// #endif
			// #ifdef APP-NVUE
			isFinish: false,
			file: ''
			// #endif
		};
	},
	computed: {
		canvasId() {
			return `l-f2${this._uid}`;
		}
	},
	watch: {
		isAutoPlay(val) {
			if (val) {
				this.changeData(this.source);
			}
		},
		source: {
			handler: function(data) {
				if (this.isAutoPlay) {
					this.changeData(data);
				}
			},
			deep: true
		}
	},
	beforeDestroy() {
		this.clear();
		this.destroy();
	},
	created() {
		this.config = {}
		this.isMask = this.isCloud && this.imageMask;
		// #ifdef MP-WEIXIN || MP-TOUTIAO
		const { SDKVersion, version, platform, environment } = uni.getSystemInfoSync();
		// #endif
		// #ifdef MP-WEIXIN
		this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '2.9.2') >= 0 && !((/ios/i.test(platform) && /7.0.20/.test(version)) || /wxwork/i.test(environment)) && !/windows/i.test(platform);;
		// #endif
		// #ifdef MP-TOUTIAO
		this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '1.78.0') >= 0;
		// #endif
	},

	async mounted() {
		if (this.onInit) {
			this.init(this.onInit);
		}
	},
	methods: {
		// #ifdef APP-NVUE
		onMessage(e) {
			const res = e?.detail?.data[0] || null;
			if (res?.event) {
				this.$emit(res.event, JSON.parse(res.data));
			} else if (res?.file) {
				this.file = res.data;
			} else {
				console.error(res);
			}
		},
		// #endif
		async init(func, params = null) {
			// #ifdef APP-NVUE
			this.$watch(
				'isFinish',
				(n, o) => {
					(n || o) && (params || this.params) && this.$refs.webview.evalJs(`init(${JSON.stringify(func.toString())}, ${JSON.stringify(params || this.params)})`);
					this.isInited = true;
				},
				{
					immediate: true
				}
			);
			// #endif
			// #ifndef APP-NVUE
			let config = await this.getContext(this.canvasId);
			if (this.isCloud) {
				let imageMask = null;
				if (this.imageMask) {
					this.isMask = true;
					imageMask = await this.getImageMask(config);
					this.imageData = imageMask;
					this.isMask = false;
				}
				let cloud = await this.getContext(this.canvasId + '_cloud');
				config = Object.assign({}, config, { cloud, imageMask });
			}
			const chart = await func(config);
			if (chart) {
				this.chart = chart;
				this.canvasEl = chart.get('el');
				this.isInited = true;
			}
			// #endif
		},
		changeData(data) {
			// #ifndef APP-NVUE
			if (this.chart) {
				this.chart.changeData(data || this.source);
			}
			// #endif
			// #ifdef APP-NVUE
			this.$refs.webview.evalJs(`changeData(${JSON.stringify(data || this.source)})`);
			// #endif
		},
		clear() {
			// #ifndef APP-NVUE
			if (this.chart) {
				this.chart.clear();
			}
			// #endif
			// #ifdef APP-NVUE
			this.$refs.webview.evalJs(`clear()`);
			// #endif
		},
		destroy() {
			// #ifndef APP-NVUE
			if (this.chart) {
				this.chart.destroy();
			}
			// #endif
			// #ifdef APP-NVUE
			this.$refs.webview.evalJs(`destroy()`);
			// #endif
		},
		repaint() {
			this.changeData(this.source);
		},
		reset(func, params = null) {
			// #ifndef APP-NVUE
			this.$watch(
				'isInited',
				v => v && func(this.chart),
				{
					immediate: true
				}
			);

			// #endif
			// #ifdef APP-NVUE
			this.$refs.webview.evalJs(`reset(${JSON.stringify(func.toString())}, ${JSON.stringify(params || this.params)})`);
			// #endif
		},
		canvasToTempFilePath(args = {}) {
			// #ifndef APP-NVUE
			const { use2dCanvas, canvasId, config } = this;
			return new Promise((resolve, reject) => {
				const copyArgs = Object.assign(
					{
						canvasId,
						success: resolve,
						fail: reject
					},
					args
				);
				if (use2dCanvas) {
					let { canvas } = config[canvasId];
					delete copyArgs.canvasId;
					copyArgs.canvas = canvas;
				}
				uni.canvasToTempFilePath(copyArgs, this);
			});
			// #endif
			// #ifdef APP-NVUE
			this.file = '';
			this.$refs.webview.evalJs(`canvasToTempFilePath()`);
			return new Promise((resolve, reject) => {
				this.$watch('file', async file => {
					if (file) {
						const tempFilePath = await base64ToPath(file);
						resolve(args.success({ tempFilePath }));
					} else {
						reject(args.fail({ error: `` }));
					}
				});
			});
			// #endif
		},
		// #ifndef APP-NVUE
		getImageMask(config) {
			return new Promise(resolve => {
				uni.getImageInfo({
					src: this.imageMask,
					success: async res => {
						if (res.path) {
							// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO
							const localReg = /^\.|^\/(?=[^\/])/;
							res.path = localReg.test(this.imageMask) ? `/${res.path}` : res.path;
							// #endif
							const { context, width, height, canvas } = config;
							if (this.use2dCanvas) {
								const imageMask = () => {
									const imageMask = canvas.createImage();
									imageMask.crossOrigin = '';
									imageMask.src = res.path;
									imageMask.onload = async () => {
										context.drawImage(imageMask, 0, 0, res.width, res.height, 0, 0, width, height);
										const imageData = context.getImageData(0, 0, width, height).data;
										context.clearRect(0, 0, width, height);
										resolve(imageData);
									};
								};
								imageMask();
							} else {
								// #ifndef MP-BAIDU
								context.drawImage(res.path, 0, 0, res.width, res.height, 0, 0, width, height);
								// #endif
								// #ifdef MP-BAIDU
								context.drawImage(res.path, 0, 0, width, height, 0, 0, res.width, res.height);
								// #endif
								await this.canvasDraw(context);
								const imageData = await context.getImageData(0, 0, width, height);
								context.clearRect(0, 0, width, height);
								await this.canvasDraw(context);
								resolve(imageData);
							}
						}
					},
					fail(err) {
						console.error(JSON.stringify(err));
						resolve(null);
					}
				});
			});
		},
		canvasDraw(ctx) {
			return new Promise(resolve => {
				ctx.draw(false, () => {
					setTimeout(() => {
						resolve(true);
					}, 100);
				});
			});
		},
		getContext(canvasId) {
			const { use2dCanvas, type = '2d', config } = this;
			if (config[canvasId]?.context) {
				return Promise.resolve(config[canvasId]);
			}
			if (use2dCanvas) {
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`#${canvasId}`)
						.fields({
							node: true,
							size: true
						})
						.exec(res => {
							let { node, width, height } = res[0];
							width = width || 300;
							height = height || 300;
							const context = node.getContext(type);
							if (!canvasId.includes('_cloud')) {
								this.width = width;
								this.height = height;
							}
							node.width = width * pixelRatio;
							node.height = height * pixelRatio;
							this.config[canvasId] = { context, width, height, pixelRatio, canvas: node };
							resolve(this.config[canvasId]);
						});
				});
			}
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					.select(`#${canvasId}`)
					.boundingClientRect()
					.exec(res => {
						if (res) {
							let { width, height } = res[0];
							width = width || 300;
							height = height || 300;
							const context = uni.createCanvasContext(canvasId, this);
							if (!canvasId.includes('_cloud')) {
								this.width = width;
								this.height = height;
								// #ifdef MP-ALIPAY
								this.nodeWidth = width * pixelRatio;
								this.nodeHeight = height * pixelRatio;
								// #endif
							}
							this.config[canvasId] = {
								context: extendContext(context), 
								width, 
								height, 
								// #ifdef H5 || APP-PLUS
								pixelRatio: 1, 
								oPixelRatio: pixelRatio,
								// #endif
								// #ifndef H5 
								pixelRatio
								// #endif
							};
							resolve(this.config[canvasId]);
						}
					});
			});
		},
		touchStart(e) {
			if (this.canvasEl) {
				this.canvasEl.dispatchEvent('touchstart', wrapEvent(e));
			}
		},
		touchMove(e) {
			if (this.canvasEl) {
				this.canvasEl.dispatchEvent('touchmove', wrapEvent(e));
			}
		},
		touchEnd(e) {
			if (this.canvasEl) {
				this.canvasEl.dispatchEvent('touchend', wrapEvent(e));
			}
		}
		// #endif
	}
};
</script>
<style scoped lang="stylus">
full()
	// #ifndef APP-NVUE
	width 100%
	height 100%
	// #endif
	// #ifdef APP-NVUE
	flex 1
	// #endif
.l-f2
	full()
	position relative
	&__mask
		position absolute
		left 0
		right 0
		bottom 0
		top 0
		background-color #fff
		z-index 1
	&__canvas
		full()
</style>
