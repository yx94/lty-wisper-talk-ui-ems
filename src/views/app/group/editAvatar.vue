<template>
  <el-dialog
    title="编辑群头像"
    :visible.sync="dialogVisible"
    width="420px"
    append-to-body
  >
    <ImageUpload style="text-align: center;" v-model="imageUrl" :limit="1"/>
    <div class="bottom-btn">
      <el-button
        class="submit-btn"
        type="primary"
        size="mini"
        @click="submitUpload"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "editAvatar",
  data() {
    return {
      dialogVisible: false,
      imageUrl: "",
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    submitUpload() {
      if (this.imageUrl) {
        this.$emit('success', this.imageUrl);
      this.dialogVisible = false;
      } else {
        this.$message.error('请上传图片');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bottom-btn {
  margin-top: 30px;
  width: 100%;
  text-align: center;
  .submit-btn {
    width: 270px;
    height: 40px;
    border-radius: 7px;
  }
}
</style>
<style lang="scss">
.avatar-uploader {
  text-align: center;
}
</style>
