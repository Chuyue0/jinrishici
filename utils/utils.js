function getSystemInfo() {
	//获取系统消息
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

module.exports = {
	getSystemInfo,
}
