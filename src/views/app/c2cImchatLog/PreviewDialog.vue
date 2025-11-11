<template>
  <el-dialog
    :title="title"
    :visible.sync="showDialog"
    width="500px"
    :close-on-click-modal="true"
    append-to-body
    @open="initSound"
    @close="onCloseDialog"
  >
    <div
      v-if="type === 'note'"
      class="im-note-content"
      v-html="content.noteContent"
    ></div>
    <div v-if="type === 'video'" class="viedo-content">
      <video
        v-show="!videoLoadError"
        class="video"
        :src="content.videoUrl"
        controls
        :poster="content.videoUrl"
        v-on:error.prevent="handleVideoError()"
      >
        您的浏览器不支持视频标签
      </video>
      <div v-show="videoLoadError">视频加载失败，请检查视频链接</div>
    </div>

    <div v-if="type === 'sound'">
      <div class="waveform-wrapper">
        <div
          class="waveform-content"
          id="waveform"
          ref="waveform"
          v-loading="loadingWaveForm"
          element-loading-background="#FAFAFA"
        >
          <!-- Here be the waveform -->
        </div>
        <!-- 控制面板 -->
        <div class="wave-pannel">
          <div class="flex-left">
            <!-- 开始 / 结束按钮 -->
            <span class="play-btn" @click="onPlayAudio">
              <div class="inline-vertical">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="!isPlaying ? '播放' : '暂停'"
                  placement="top"
                >
                  <i
                    class="el-icon-video-play"
                    style="color: #3d80ff"
                    v-if="!isPlaying"
                  ></i>
                  <i
                    class="el-icon-video-pause"
                    style="color: #3d80ff"
                    v-else
                  ></i>
                </el-tooltip>
              </div>
            </span>
            <!-- 播放进度 -->
            <span class="play-progress">
              <div class="inline-vertical">
                <span>{{ currentTime || "00:00" }}</span> /
                <span>{{ duration || "00:00" }}</span>
              </div>
            </span>
          </div>
          <div class="flex-right">
            <!-- 音量控制 -->
            <div class="volumn-controll">
              <span>
                <div class="inline-vertical">音量：</div>
              </span>
              <span>
                <div class="inline-vertical">
                  <i
                    class="iconfont icon-yinliangai"
                    style="font-size: 14px; color: #bfbfbf"
                  ></i>
                </div>
              </span>
              <!-- 音量条 -->
              <el-slider
                v-model="volumeValue"
                height="100px"
                :show-tooltip="false"
                @change="onChangeVolume"
              />
              <span class="volume-value">
                <div class="inline-vertical">{{ volumeValue }}%</div>
              </span>
            </div>
            <!-- 倍速控制 -->
            <div class="speed-controll">
              <span>
                <div class="inline-vertical">倍速：</div>
              </span>
              <el-popover
                placement="bottom"
                trigger="click"
                popper-class="speed-controll-popover"
                v-model="showSpeedPannel"
              >
                <ul class="speed-list">
                  <li
                    class="speed-item"
                    v-for="item in speedList"
                    :key="item"
                    @click="handleChangePlaySpeed(item)"
                  >
                    {{ item }}
                  </li>
                </ul>
                <div class="speed-value-btn" slot="reference">
                  {{ speedValue + " X" }}
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <el-button
        type="primary"
        size="medium"
        @click="handleDownloadRecords"
        :loading="downloadLoading"
      >
        下载语音
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import dayjs from "dayjs";
import { getBaseUrl } from "@/utils/auth";

export default {
  name: "PreviewDialog",
  data() {
    return {
      baseUrl: getBaseUrl(),
      title: "",
      showDialog: false,
      type: undefined,
      content: undefined,
      // 视频加载失败
      videoLoadError: false,
      // 音频播放器相关
      // 声纹可视化插件实例
      wavesurfer: null,
      // 加载 audio
      loadingWaveForm: false,
      // 音量
      volumeValue: 100,
      // 倍速
      speedValue: 1,
      // 播放
      isPlaying: false,
      // 音频长度
      duration: "",
      // 当前播放进度
      currentTime: "",
      // 倍速列表
      speedList: [0.5, 1, 1.25, 1.5, 2],
      // 倍速弹窗
      showSpeedPannel: false,
      // 下载语音 loading
      downloadLoading: false,
    };
  },
  methods: {
    openDialog(item) {
      this.type = item.type;
      switch (item.type) {
        case "note":
          this.title = "笔记预览";
          break;
        case "video":
          this.title = "视频预览";
          break;
        case "sound":
          this.title = "语音预览";
          break;
        default:
          break;
      }
      this.content = item.content;
      if (item.type === "note") {
        this.content.noteContent = this.content.noteContent
          .replace(/src="(?!http)([^"]+)"/g, `src="${this.baseUrl}$1"`)
          .replace(
            /video src="(?!http)([^"]+)"/g,
            `video src="${this.baseUrl}$1"`
          );
      }
      this.showDialog = true;
    },
    handleVideoError() {
      this.videoLoadError = true;
    },
    // 关闭弹窗
    onCloseDialog() {
      // 设置默认值
      this.duration = "";
      this.currentTime = "";
      this.videoLoadError = false;
      if (this.wavesurfer) {
        this.wavesurfer.empty();
      }
    },
    initSound() {
      if (!this.content.soundUrl) return;
      this.loadingWaveForm = true;
      // 初始化 创建实例
      if (!this.wavesurfer) {
        this.$nextTick(() => {
          this.wavesurfer = WaveSurfer.create({
            // 应该在其中绘制波形的CSS选择器或HTML元素。这是唯一必需的参数。
            container: this.$refs.waveform,
            // 光标的填充颜色，指示播放头的位置。
            cursorColor: "red",
            // 更改波形容器的背景颜色。
            backgroundColor: "#FAFAFA",
            // 光标后的波形填充颜色。
            waveColor: "#3D80FF",
            // 光标后面的波形部分的填充色。当progressColor和waveColor相同时，完全不渲染进度波
            progressColor: "#E9E9E9",
            backend: "MediaElement",
            // 音频播放时间轴
            mediaControls: false,
            // 播放音频的速度
            audioRate: "1",
            barWidth: 2,
            barHeight: 1, // the height of the wave
            barRadius: 1,
            barGap: null, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
          });

          // 音频加载完成
          this.wavesurfer.on("waveform-ready", () => {
            this.loadingWaveForm = false;
            // 时长
            let duration = this.wavesurfer.getDuration();
            this.duration = dayjs
              .unix(duration)
              .format(Number(duration) > 60 * 60 ? "HH:mm:ss" : "mm:ss");
            console.log("audio ready!!!");
          });
          // 播放中
          this.wavesurfer.on("audioprocess", () => {
            // 播放进度
            let curTime = this.wavesurfer.getCurrentTime();
            this.currentTime = dayjs
              .unix(curTime)
              .format(Number(curTime) > 60 * 60 ? "HH:mm:ss" : "mm:ss");
          });
          // 改变进度
          this.wavesurfer.on("seek", () => {
            let curTime = this.wavesurfer.getCurrentTime();
            this.currentTime = dayjs
              .unix(curTime)
              .format(Number(curTime) > 60 * 60 ? "HH:mm:ss" : "mm:ss");
          });
          this.wavesurfer.on("finish", () => {
            this.isPlaying = false;
          });
          // 异常捕获
          this.wavesurfer.on("error", (e) => {
            // 播放进度
            if (this.loadingWaveForm) {
              console.log(e);
              this.$message.error("加载录音出错！");
              this.wavesurfer.cancelAjax();
              this.loadingWaveForm = false;
            }
          });
          // 加载音频url
          this.wavesurfer.load(this.content.soundUrl);
        });
      }
      // 加载音频url
      this.wavesurfer && this.wavesurfer.load(this.content.soundUrl);
    },
    // 播放控制
    onPlayAudio() {
      if (this.loadingWaveForm) return;
      this.isPlaying = !this.isPlaying;
      // 播放与暂停
      this.wavesurfer.playPause();
      console.log("call record playing!!");
    },
    // 音量
    onChangeVolume(val) {
      this.wavesurfer && this.wavesurfer.setVolume(val / 100);
      console.log("onChangeVolume", this.wavesurfer.getVolume());
    },
    // 切换倍速
    handleChangePlaySpeed(speed) {
      this.wavesurfer && this.wavesurfer.setPlaybackRate(speed);
      this.speedValue = speed;
      this.showSpeedPannel = false;
    },
    // 下载语音
    handleDownloadRecords() {
      this.downloadLoading = true;
      axios
        .get(this.content.soundUrl, {
          responseType: "blob",
        })
        .then((resp) => {
          if (resp.status === 200) {
            let data = resp.data;
            // 下载
            // 创建 a 标签
            let link = document.createElement("a");
            const url = window.URL.createObjectURL(data);
            link.href = url;
            link.download = this.getFileNameFromUrl(this.content.soundUrl);
            link.click();
            // 释放内存
            window.URL.revokeObjectURL(link.href);
            this.$message.success("下载成功");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("下载失败！");
        })
        .finally(() => {
          this.downloadLoading = false;
        });
    },
    getFileNameFromUrl(url) {
      // 创建 URL 对象
      const parsedUrl = new URL(url);
      // 获取路径部分
      const path = parsedUrl.pathname;
      // 提取文件名
      return path.substring(path.lastIndexOf("/") + 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.video {
  width: 100%;
}

.waveform-wrapper {
  background-color: #fafafa;
  margin-bottom: 16px;
  padding-top: 10px;
  border-radius: 6px;
  .waveform-content {
    margin: 10px;
  }
  .wave-pannel {
    font-size: 12px;
    height: 42px;
    line-height: 42px;
    padding: 0 20px;
    background-color: #f2f4f7;
    border-radius: 0px 0px 6px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .flex-left {
      display: flex;
      align-items: center;
      .play-btn {
        display: inline-block;
        margin-right: 6px;
        font-size: 24px;
        cursor: pointer;
      }
    }
    .flex-right {
      display: flex;
      align-items: center;
      .volumn-controll {
        display: flex;
        align-items: center;
        .volume-value {
          width: 40px;
          text-align: center;
          color: #3d80ff;
        }
      }
      .speed-controll {
        display: flex;
        align-items: center;
        margin-left: 6px;
        .speed-value-btn {
          width: 60px;
          text-align: center;
          height: 24px;
          line-height: 24px;
          background: #f2f4f7;
          border-radius: 4px;
          border: 1px solid #dddfe5;
          cursor: pointer;
        }
      }
    }
    .inline-vertical {
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>
<style lang="scss">
.volumn-controll .el-slider {
  width: 100px;
  margin: 0 6px 0 10px;
}
.speed-controll-popover {
  min-width: 80px !important;
  padding: 6px 2px;
  .speed-list {
    .speed-item {
      height: 28px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #f2f4f7;
        border-radius: 6px;
      }
    }
  }
}

.im-note-content {
  ol,
  ul {
    padding-inline-start: 1em;
  }
  ol {
    list-style: decimal;
  }
  ul {
    list-style: disc;
  }
  img,
  video {
    width: 100%;
  }
  .file-container {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  .file-icon {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    background: url(../../../assets/images/file.jpg) no-repeat;
    background-size: cover;
  }
  .file-text {
    flex: 1;
    overflow: hidden;
    font-size: 16px;
    color: #000;
  }
  .location-container {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  .location-icon {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    background: url(../../../assets/images/location.jpg) no-repeat;
    background-size: cover;
  }
  .location-text {
    flex: 1;
    overflow: hidden;
    font-size: 16px;
    color: #000;
  }
  .location-text-detail {
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
    font-size: 14px;
    color: #888;
  }
}
</style>
