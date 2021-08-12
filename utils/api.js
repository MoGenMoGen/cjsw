const config = require("./config");
import Vue from 'vue'
// const app = getApp()

const hostUrl = config.serverURL;

function get(url, data, header, loading) {
	// console.log(url)
	if (loading !== false) {
		uni.showLoading({
			title: "加载中"
		});
	}

	let BladeAuth = uni.getStorageSync("Blade-Auth")
	let myheader = {
		"Blade-Auth": BladeAuth
	}
	header = header ? header : {}
	myheader = {
		...myheader,
		...header
	}

	let promise = new Promise((resolve, reject) => {
		uni.request({
			data: data,
			method: "get",
			header: myheader,
			// url: config.serverURL + url,
			url: '/api' + url,
			timeout: 30000,
			timeout:15000,
			success: function(res) {
				console.log('get success', res)
				// 登录失效重新登录
				if (res.data.code == '401') {
					console.log("401");
					uni.showToast({
						title: '登录失效了，重新登录',
						duration: 2000,
						icon: "none",
					})
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/login/index'
						})
					}, 2000)


				} else if (res.data.code == '200')
					resolve(res.data);
				else {
					if (!loading) {
						uni.showToast({
							title: res.data.msg,
							duration: 2000,
							icon: 'loading'
						})
					}

				}
			},
			fail: function(err) {
				console.log("get error");
				uni.showToast({
					icon: "none",
					title: JSON.stringify(err),
					duration: 2000,

				});
				reject(err);
			},
			complete: function() {
				if (loading !== false) {
					uni.hideLoading();
				}
			}
		});
	});
	return promise;
}

function post(url, data, header, loading) {
	if (loading !== false) {
		uni.showLoading({
			title: "加载中"
		});
	}

	let BladeAuth = uni.getStorageSync("Blade-Auth")
	let myheader = {
		"Blade-Auth": BladeAuth
	}
	header = header ? header : {}
	myheader = {
		...myheader,
		...header
	}
	let promise = new Promise((resolve, reject) => {
		uni.request({
			data: data,
			header: myheader,
			method: "post",
			// url: config.serverURL + url,
			url: '/api' + url,

			timeout: 60000,
			timeout:15000,
			success: function(res) {
				console.log('post success', res)
				// 登录失效重新登录
				if (res.data.code == '401') {
					uni.showToast({
						title: '登录失效了，重新登录',
						duration: 2000,
						icon: 'none',
						complete() {
							uni.reLaunch({
								url: '/pages/login/index'
							})
						}
					})

				} else if (res.data.code == '200')
					resolve(res.data);
				else {
					if (!loading) {
						uni.showToast({
							title: res.data.msg,
							duration: 2000,
							icon: 'loading'
						})
					}
				}

			},
			fail: function(err) {
				console.log('post fail')
				uni.showToast({
					icon: "none",
					title: JSON.stringify(err),
					duration: 2000
				});
				reject(err)
			},
			complete: function() {
				uni.hideLoading()
			}
		});
	});
	return promise;
}
// 专门针对登录的post提交,error_code=='400'账号或密码错误,没有error_code成功
// 其他接口用的get/post,code==401未授权，code=200成功，其他code就是服务器问题


function loginpost(url, data, header) {
	// console.log(url)
	uni.showLoading({
		title: "加载中"
	});

	header = header ? header : {}

	let promise = new Promise((resolve, reject) => {
		uni.request({
			data: data,
			header,
			method: "post",
			// url: config.serverURL + url,
			url: '/api' + url,
			timeout: 60000,
			timeout:15000,
			success: function(res) {
				console.log('post success', res)
				// 400账号或密码错误
				if (res.data.error_code == '400') {
					uni.showToast({
						title: res.data.error_description,
						// title: "111",
						icon: 'none',
						duration: 2000
					})

				} else if (!res.data.error_code) {
					console.log(1242343564565)
				} else {
					console.log("dfsjfjglskdfgjdklsgj")
					uni.showToast({
						title: res.data.msg,
						duration: 2000,
						icon: 'loading'
					})
				}
				// 不管账号是否存在或错误都返回res
				resolve(res.data);


			},
			fail: function(err) {
				console.log('post fail')
				uni.showToast({
					icon: "none",
					title: JSON.stringify(err),
					duration: 2000
				});
				reject(err)
			},
			complete: function() {
				uni.hideLoading()
			}
		});
	});
	return promise;
}

class api {
	//登录
	login(data) {
		return new Promise((resolve, reject) => {
			loginpost("/blade-auth/oauth/token", data, {

				"Authorization": "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
				"Content-Type": "application/x-www-form-urlencoded",
			}).then(res => {
				// uni.setStorageSync("user_id", res.user_id)
				resolve(res);
			});
		});
	}



	//注册
	register(data) {
		return new Promise(resolve => {
			post("/general/ access/register", data).then(res => {
				resolve(res.data)
			})
		})
	}
	//登出
	logOut() {
		return new Promise((resolve, reject) => {
			get("/general/access/logout", data).then(res => {
				resolve(res);
			});
		});
	}



	//注销账号
	cancel(data) {
		return new Promise(resolve => {
			post("/zfw/api/pers/cancle", data).then(res => {
				resolve(res)
			})
		})
	}
	//设置新密码
	password(data) {
		return new Promise(resolve => {
			post("/blade-user/update-passwordV2", data).then(res => {
				resolve(res)
			})
		})
	}
	//图片选择
	chooseImages(type, max) {
		// uni.setStorage({
		// 	key: "ifClose",
		// 	data: 'no'
		// })
		let promise = new Promise((resolve, reject) => {
			let that = this
			uni.chooseImage({
				count: max || 9, //一次最多可以选择的图片张数
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: type || ['camera', 'album '], // 可以指定来源是相册还是相机，默认二者都有
				// 可以指定来源是相册还是相机，默认二者都有

				success: function(res) {
					uni.showLoading({
						title: '上传中...',
					})
					let img = res.tempFilePaths
					resolve(img)
					// that.upLoad(res.tempFilePaths[0])
				},
				fail: function(err) {
					console.log(err)
				},
				complete: function() {
					uni.hideLoading()
				}
			})
		})
		return promise
	}
	//上传操作
	async upLoad(imgPath) {
		// let token = uni.getStorageSync('yui3-token')
		// if(!token){
		//   token = await getToken2()
		// }
		console.log({
			imgPath
		})
		return new Promise((resolve, reject) => {
			let that = this
			//上传文件
			uni.uploadFile({
				url: '/api' + '/blade-resource/oss/endpoint/put-file',
				filePath: imgPath,
				name: 'file',
				// header: {
				// 	"Content-Type": "multipart/form-data",

				// },
				// formData: {
				// 	"Blade-Auth": uni.getStorageSync("Blade-Auth")
				// },
				success: function(res) {
					uni.showLoading({
						title: '上传成功',
					})
					console.log('================')
					console.log(1111111111)
					let img = JSON.parse(res.data).data.link;

					resolve(img)
				},
				fail: function(res) {
					console.log('上传失败', res);
					uni.showModal({
						title: '上传失败',
						content: res.msg,
						showCancel: false,
						success: function(res) {}
					})
				},
				complete: function() {
					uni.hideLoading();
				}
			});
		})
	}

	// 首页轮播图
	getbanner() {
		return new Promise((resolve, reject) => {
			get("/blade-banner/banner/list?type=mob-index", {}, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		});

	}
	// 获取头部切换栏列表
	getheadswitchList() {
		return new Promise((resolve, reject) => {
			get("/blade-mh/site/workshopList", {}, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	// 获取首页内容列表
	getwrapperList(data) {
		return new Promise((resolve, reject) => {
			post("//blade-mh/site/siteByWorkShopId", data, {
				'Content-Type': 'application/json'
			}, false).then(res => {
				resolve(res.data);
			});
		})
	}

	//获取折线图数据
	getsiteValList(data) {
		return new Promise((resolve, reject) => {
			get("/blade-mh/site/siteValList", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	//获取报警信息列表
	getapiList(data) {
		return new Promise((resolve, reject) => {
			get("/blade-mh/errlog/apiList", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}

	// 车间详情
	getsiteDetail(data) {
		return new Promise((resolve, reject) => {
			get("/blade-mh/site/siteDetail", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	// 类别列表
	getdictionary(data) {
		return new Promise((resolve, reject) => {
			get("blade-system/dict/dictionary", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	// 工艺列表
	getcraftList(data) {
		return new Promise((resolve, reject) => {
			get("/blade-mh/site/craftList", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	// 个人面貌列表
	getPartyList(data) {
		return new Promise((resolve, reject) => {
			get("/blade-system/dict/dictionary", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	
	// 个人信息
	getPersoninfo() {
		return new Promise((resolve, reject) => {
			get("/blade-user/myInfo", {}, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}
	// 修改个人信息
	modidyPersoninfo(data) {
		return new Promise((resolve, reject) => {
			post("/blade-user/update-infoV2", data, {
				'Content-Type': 'application/json'
			}).then(res => {
				resolve(res.data);
			});
		})
	}

}
export {
	api
};
