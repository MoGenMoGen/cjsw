
<style lang="scss">
	@import "uview-ui/index.scss";
</style>

<script>
	export default {
		onload: function() {
			document.addEventListener('touchstart', function(e) {
				console.log("1", e.touches.length)
				if (e.touches.length > 1) {
					e.preventDefault()
				}
			})
			document.addEventListener('gesturestart', function(e) {
				console.log("2")
				e.preventDefault()
			})
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

