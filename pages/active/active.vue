<template name="actve">
	<view class="waveWrapper waveAnimation">
		<view class="waveWrapperInner bgTop" :style="{background:background}"><view class="wave waveTop"></view></view>
		<view class="waveWrapperInner bgMiddle" :style="{background: background ,opacity: waveNum==1?'1':'0.75'}">
			<view class="wave waveMiddle " :class="waveStatus?'run':'pause'"></view>
		</view>
		<view v-if="waveNum>=2" class="waveWrapperInner bgBottom" :style="{background:background}"><view class="wave waveBottom " :class="waveStatus?'run':'pause'"></view></view>
	</view>
</template>

<script>
	export default{
		name: 'actve',
		props:{
			//属性
			waveNum: {
				type: Number,
				value: 2
			},
			// 动画运行状态
			waveStatus: {
				type: Boolean,
				value: true
			},
			// 波浪颜色
			background: {
				type: String,
				value: '#f7e8aa'
			}
		},
		created:function(e){},
		methods:{
			//函数
		}
	}
</script>

<style scoped>
.waveWrapper {
	height: 86rpx;
	width: 100%;
	overflow: hidden;
	position: absolute;
	left: 0;
	top: 0;
}

.waveWrapperInner {
	position: absolute;
	width: 100%;
	overflow: hidden;
	height: 100%;
	bottom: -1px;
}

.bgTop {
	z-index: 15;
	opacity: 0.5;
}

.bgMiddle {
	z-index: 10;
}

.bgBottom {
	z-index: 5;
}

.wave {
	position: absolute;
	left: 0;
	width: 200%;
	height: 100%;
	background-repeat: repeat no-repeat;
	background-position: 0 bottom;
	transform-origin: center bottom;
}

.waveTop {
	background-image: url('~@/static/images/wave-top.png');
	background-size: 50% 46rpx;
}

.waveAnimation .waveTop {
	animation: move-wave 3s;
	-webkit-animation: move-wave 3s;
	-webkit-animation-delay: 1s;
	animation-delay: 1s;
}

.waveMiddle {
	background-image: url('~@/static/images/wave-mid.png');
	background-size: 50% 65rpx;
	animation: move_wave 7s linear infinite;
}

.waveAnimation .waveMiddle {
	animation: move_wave 7s linear infinite;
}

.waveBottom {
	background-image: url('~@/static/images/wave-bot.png');
	background-size: 50% 86rpx;
}

.waveAnimation .waveBottom {
	animation: move_wave 12s linear infinite;
}

@keyframes move_wave {
	0% {
		transform: translateX(0) translateZ(0) scaleY(1);
	}

	50% {
		transform: translateX(-25%) translateZ(0) scaleY(0.55);
	}

	100% {
		transform: translateX(-50%) translateZ(0) scaleY(1);
	}
}

.waveAnimation .pause {
	animation-play-state: paused;
}

.waveAnimation .run {
	animation-play-state: running;
}
</style>
