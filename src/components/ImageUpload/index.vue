<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :on-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{hide: this.fileList.length >= this.limit}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b></template>
      的文件
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getBaseUrl, getToken } from '@/utils/auth'

export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 存储后台返回的图片列表，图片url为相对路径
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      baseUrl: getBaseUrl(),
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/system/oss/upload', // 上传的图片服务器地址
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      uploadList: [],
      // 绑定 el-upload 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      fileList: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.initComponent(val)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    }
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isImg = false
      if (this.fileType.length) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type) > -1) return true
          return false
        })
      } else {
        isImg = file.type.indexOf('image') > -1
      }

      if (!isImg) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join('/')}图片格式文件!`)
        return false
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      this.$modal.loading('正在上传图片，请稍候...')
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        // res.data.fileName 原始文件名,如 test.jpg
        // res.data.url 是文件存储路径,接口返回的url是相对路径，如 2023/01/05/7f5fbbc2f08b493ea8507aa717c0c756.jpg
        this.uploadList.push({ name: res.data.fileName, url: res.data.url })
        this.fileList = this.uploadListToFileList(this.uploadList)
        this.$emit('input', this.getUrlString())
        this.$modal.closeLoading()
      } else {
        this.$modal.closeLoading()
        this.$modal.msgError(res.msg)
        this.$refs.imageUpload.handleRemove(file)
      }
    },
    // 删除图片
    handleDelete(file) {
      let name = file.name
      const targetIndex = this.fileList.map(f => f.name).indexOf(name)
      if (targetIndex > -1) {
        this.fileList.splice(targetIndex, 1)
        this.uploadList.splice(targetIndex, 1)
        this.$emit('input', this.getUrlString())
      }
    },
    // 上传失败
    handleUploadError(res) {
      this.$modal.msgError('上传图片失败，请重试')
      this.$modal.closeLoading()
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // uploadList 转为 fileList
    uploadListToFileList(uploadList) {
      return uploadList.map(item => {
        item = { name: item.name, url: this.baseUrl + item.url }
        return item
      })
    },
    // 获取组件url
    getUrlString() {
      return this.uploadList.map(item => {
        return item.url
      }).join()
    },
    // 初始化组件
    initComponent(val) {
      if (val) {
        let list = val.split(',')
        this.fileList = list.map(item => {
          item = { name: this.getFileName(item), url: this.baseUrl + item }
          return item
        })

        this.uploadList = list.map(item => {
          item = { name: this.getFileName(item), url: item }
          return item
        })
      } else {
        this.fileList = []
        this.uploadList = []
      }
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1)
      } else {
        return name
      }
    }

  }
}
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}

// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter, .el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>

