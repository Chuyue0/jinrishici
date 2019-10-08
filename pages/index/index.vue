<template>
	<view class="page" catchtouchmove="doNot">
		<view class="tag-name" v-if="false"><!-- v-if="verse.matchTags" -->
			<text class="tag-txt" :style="{background:randomColor.hex }">{{verse.matchTags[0]}}</text>
		</view>
		<view class="refresh-btn" v-if="false" :style="{borderColor:randomColor.hex,color:randomColor.hex }" @click="loadShici()">
			下
		</view>
		<view id="color-name" class="fadeout">
			<text>{{ randomColor.name }}</text>
		</view>
		<view class="verse waves horizontal">
			<view class="content">
				<text decode="true">{{ verse.content }}</text>
			</view>
			<view class="origin">
				<text decode="true" space="nbsp">{{ verse.origin.author || '' }} 「{{ verse.origin.title || '无' }}」</text>
			</view>
		</view>
		<view class="wave-box"><canvas canvas-id="waves" class="wave-cont"></canvas></view>
		<!-- 存在背景色
		 <actve class="actve-box" waveNum='2' waveStatus='true' background='#7ec0eb'></actve> -->
	</view>
</template>

<script>
	import jinrishici from '@/utils/jinrishici';
	import shici from '@/static/json/shici'
	import actve from '@/pages/active/active';
	import wavesColors from '@/static/json/wavesColors';
	import { getSystemInfo } from '@/utils/utils';
	export default {
		components: {
			actve: actve
		},
		data() {
			return {
				verse: {}, //今日诗词数据
				randomColor: '', //随机颜色数据
				canvasW: 0,
				canvasH: 0,
				timer: null,
				step: 0,
				colorLines:[]
			};
		},
		onLoad() {
			let that = this;
			getSystemInfo().then(res => {
				console.log(res);
				//that.canvasW = res.screenWidth * 2 + 'rpx';
				//that.canvasH = res.screenHeight * 2 + 'rpx';
			});
			uni.loadFontFace({
				family: 'FZXiJinLJW2',
				source: 'url("https://reading.oss.iyougu.com/ldtmp/FZXiJinLJW.TTF")',
				success(res) {
				}
			});
			that.loadShici();
			let randNum = that.getRandNum(wavesColors.length);
			that.randomColor = wavesColors[randNum];
			console.log(that.randomColor);
			that.waves();
		},
		onShow(){
			console.log(getApp().globalData)
		},
		onUnload(){
		},
		onShareAppMessage(res){
			return {
				title: '今日诗词',
				path: '/pages/index/index'
			}
		},
		methods: {
			doNot(e){
			},
			waves() {
				let that=this;
				let color = that.randomColor.RGB;
				that.colorLines = [
					`rgba(${color[0]},${color[1]},${color[2]},0.1)`,
					`rgba(${color[0]},${color[1]},${color[2]},0.3)`,
					`rgba(${color[0]},${color[1]},${color[2]},0.6)`,
					`rgba(${color[0]},${color[1]},${color[2]},0.9)`
				];				
				let query = uni.createSelectorQuery().select('.wave-cont');
				query.boundingClientRect(res => {
					that.canvasW = res.width;
					that.canvasH = res.height;
					loop();
				}).exec();
								
				let ctx = uni.createCanvasContext('waves');
				let step=0;
				let requestAnimFrame = (function () {
					return function (callback) {
							setTimeout(callback, 1000 / 60);
						};
				})();
				let lines=that.colorLines;
				
				function loop(){
					let height = that.canvasH ;
					let width = that.canvasW ;
					ctx.clearRect(0, 0, width, height); //清除画布内容
					step ++;
					for (let i = lines.length - 1; i >= 0; i--) {
						let angel = ((step + i * 60) * Math.PI) / 181; //角度
						let deltaHeight = Math.sin(angel) * 35;
						let deltaHeightRight = Math.cos(angel) * 35;
						ctx.setFillStyle(lines[i]); //设置填充色
						ctx.beginPath(); //开始创建一个路径
						ctx.moveTo(0, height / 2 + deltaHeight); //把路径移动到指定点
						ctx.bezierCurveTo(width / 2, height / 2 + deltaHeight - 35, width / 2, height / 2 + deltaHeightRight -50 , width, height / 2 + deltaHeightRight-10); //贝塞尔曲线路径
						ctx.lineTo(width, height); //增加新点
						ctx.lineTo(0, height);
						ctx.lineTo(0, height / 2 + deltaHeight);
						ctx.closePath(); //关闭路径
						ctx.fill(); //对当前路径进行填充
					}
					ctx.draw() //绘画
					requestAnimFrame(loop);
				}
			},
			getRandNum(len){
				return parseInt(len * Math.random())
			},
			loadShici(){
				let that=this;
				jinrishici.load(res => {
					uni.showLoading({
						title: '加载中..'
					})
					if (res.status == 'success') {
						uni.hideLoading()
						console.log(res)
						that.verse = res.data;
						uni.setStorage({
							key: 'jrsc',
							data: res.data
						})
					}else{
						uni.hideLoading()
						console.log(shici)
						that.verse = shici[that.getRandNum(shici.length)]
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	//height: var(--status-bar-height);
	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@mixin fadeIn($animationName) {
		@keyframes #{$animationName} {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		animation: $animationName 500 ease-in;
	}

	page {
		width: 100%;
		height: 100%;
		background-color: #efefef;
		.page {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			overflow: hidden;
			.tag-name{
				position: absolute;
				right: 20rpx;
				top: 10rpx;
				font-size: 24rpx;
				.tag-txt{
					display: inline-block;
					min-width: 80rpx;
					height: 50rpx;
					line-height: 50rpx;
					border-radius: 20rpx;
					color: #fff;
					text-align: center;
				}
			}
			#color-name {
				position: absolute;
				left: 0;
				top: 0;
				color: rgba(0, 0, 0, 0.1);
				font-size: calc(100px + 5%);
				font-family: FZXiJinLJW2;
				opacity: 1;
				writing-mode: vertical-rl;
				white-space: nowrap;
				transform: translate(10%, -5%);

				&.fadeout {
					opacity: 0;
					animation: fadeOut 5s ease;
				}
			}
			.refresh-btn{
				position: absolute;
				right: -14rpx;
				top: 50%;
				width: 80rpx;
				height: 40rpx;
				line-height: 40rpx;
				border: 2rpx solid #666;
				background-color: transparent;
				border-radius: 16rpx;
				text-align: center;
				color: #666;
				font-size: 24rpx;
			}
			.verse {
				position: absolute;
				left: 50%;
				text-align: center;
				transform: translate(-50%, -50%);
				width: 100%;

				.content {
					width: 80%;
					margin: 0 auto;
					word-break: break-all;
					font-size: calc(30px + 1%);
				}

				.origin {
					display: flex;
					margin-top: 20rpx;
					//font-size: 12px;
					justify-content: center;
					align-items: center;
				}

				text {
					color: #333;
					font-family: FZXiJinLJW2, PingFangSC;
				}

				&.waves {
					top: 30%;
				}

				//横向
				&.horizontal {
					transition: top 500ms ease-in-out;
					@include fadeIn(horizontalFadein);
				}

				//竖向
				&.vertical {
					top: 50%;
					text-align: left;
					transform: translate(-50%, -80%);
					writing-mode: vertical-rl;
					@include fadeIn(verticalFadein);

					.content {
						width: auto;
						line-height: 1.25;
					}

					.origin {
						margin-right: 10rpx;
						justify-content: flex-start;
						flex-wrap: wrap;
						word-break: keep-all;
					}
				}
			}

			.wave-box {
				width: 100%;
				height: 40%;
				position: absolute;
				bottom: 0;
				left: 0;

				.wave-cont {
					width: 100%;
					height: 100%;
				}
			}

			.actve-box {
				width: 100%;
				height: 86rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 10;
			}
		}
	}
</style>
