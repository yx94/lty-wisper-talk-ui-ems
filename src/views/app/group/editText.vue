<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="420px"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="editForm">
      <el-form-item prop="value">
         <el-input
         v-if="type === 'groupName'"
          v-model="form.value"
          :placeholder="placeholder"
          :maxlength="max"
          :minlength="min"
          show-word-limit
          clearable
          autofocus
        ></el-input>
        <el-input
          v-else
          v-model="form.value"
          :placeholder="placeholder"
          :maxlength="max"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 5 }"
          show-word-limit
          clearable
          autofocus
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btn" slot="footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="submit()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "editText",
  data() {
    return {
      dialogVisible: false,
      type: "",
      form: {
        value: "",
      },
    };
  },
  computed: {
    title() {
      switch (this.type) {
        case "groupNotice":
          return "修改群公告";
        case "groupName":
          return "修改群名称";
        case "groupWelcomeMsg":
          return "修改入群欢迎语";
        default:
          return "";
      }
    },
    placeholder() {
      switch (this.type) {
        case "groupNotice":
          return "请输入1-3000个字符的群公告";
        case "groupName":
          return "请输入1-16个字符的群名称";
        case "groupWelcomeMsg":
          return "请输入1-200个字符的入群欢迎语";
        default:
          return "";
      }
    },
    max() {
      switch (this.type) {
        case "groupNotice":
          return 3000;
        case "groupName":
          return 16;
        case "groupWelcomeMsg":
          return 200;
        default:
          return 0;
      }
    },
    min() {
      switch (this.type) {
        case "groupName":
          return 1;
        default:
          return 0;
      }
    },
    rules() {
      switch (this.type) {
        case "groupNotice":
          return {
            value: [
              {
                min: 0,
                max: 3000,
                message: "群公告长度在 1 到 3000 个字符",
                trigger: "blur",
              },
            ],
          };
        case "groupName":
          return {
            value: [
              { required: true, message: "请输入群名称", trigger: "blur" },
              {
                min: 1,
                max: 16,
                message: "群名称长度在 1 到 16 个字符",
                trigger: "blur",
              },
            ],
          };
        case "groupWelcomeMsg":
          return {
            value: [
              {
                min: 0,
                max: 200,
                message: "群欢迎语长度在 1 到 200 个字符",
                trigger: "blur",
              },
            ],
          };
      }
    },
  },
  methods: {
    openDialog(type, value) {
      this.type = type;
      this.form.value = value;
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$emit("success", this.type, this.form.value);
          this.dialogVisible = false;
          this.clear();
        } else {
          return false;
        }
      });
    },
    clear() {
      this.type = "";
      this.form.value = "";
    },
  },
};
</script>
