<template>
  <el-dialog
    title="封禁处理"
    :visible.sync="open"
    :center="true"
    width="420px"
    append-to-body
  >
    <el-form
      :model="form"
      ref="form"
      class="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-form-item :label="form.relationType === 0 ? '用户昵称':'群聊名称'" required prop="relationName" style="margin-bottom: 10px;">
        {{ form.relationName }}
      </el-form-item>
      <el-form-item :label="form.relationType === 0 ? '用户ID':'群聊ID'" required prop="relationId" style="margin-bottom: 10px;">
        {{ form.relationId }}
      </el-form-item>
      <el-form-item label="封禁选项" required prop="type" v-if="form.relationType === 0">
        <el-select placeholder="请选择" clearable v-model="form.type">
          <el-option
            v-for="dict in dict.type.sys_disable_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作理由" required prop="reason">
        <el-select placeholder="请选择" clearable v-model="form.reason">
          <el-option
            v-for="dict in dict.type.sys_disable_reason"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="form-btn">
        <el-button :loading="isLoading" type="primary" @click="submitForm">确定封禁</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { addDisableRecords } from '../../../api/app/disableRecords';

export default {
  name: "banDialog",
  dicts: ["sys_disable_type", "sys_disable_reason"],
  data() {
    return {
      open: false,
      isLoading: false,
      form: {
        relationId: undefined, //用户ID
        relationName: undefined, //用户昵称
        relationType: undefined, //封禁对象类型  0-用户 1-群组
        reason: undefined, //操作理由
        type: undefined, //封禁选项
      },
      rules: {
        type: [
          { required: true, message: "请选择封禁选项", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请选择操作理由", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    openDialog(item) {
      this.form.relationName = item.relationName;
      this.form.relationId = item.relationId;
      this.form.relationType = item.type;
      if (item.type === 1) {
        this.form.type = -1
      } else {
        this.form.type = undefined
      }
      this.open = true;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = {
            relationId: this.form.relationId,
            relationType: this.form.relationType,
            type: this.form.type,
            reason: this.form.reason
          }
            this.isLoading = true;
            addDisableRecords(data)
              .then((response) => {
                this.$modal.msgSuccess("操作成功");
                this.open = false;
                this.$emit("success");
              })
              .finally(() => {
                this.isLoading = false;
              });
            console.log(this.form)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form {
  .form-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    .el-button {
      width: 200px;
    }
  }
}
</style>
