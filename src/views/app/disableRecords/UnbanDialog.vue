<template>
  <el-dialog
    title="解除封禁处理"
    :visible.sync="showDialog"
    width="500px"
    append-to-body
  >
    <el-form ref="form" :model="params" label-width="160px" size="small">
      <el-form-item label="用户昵称">
        {{ nickname }}
      </el-form-item>
      <el-form-item label="用户ID" prop="relationId">
        {{ params.wtId }}
      </el-form-item>
      <el-form-item label="封禁类型" prop="type">
        {{ banTypeLabel }}
      </el-form-item>
      <el-form-item label="解封理由" prop="releaseReason">
        <el-select
          v-model="params.releaseReason"
          placeholder="请选择解封理由"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_release_reason"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="buttonLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unbanUser } from "@/api/app/disableRecords";
export default {
  name: "UnbanDialog",
  dicts: ["sys_disable_type", "sys_release_reason"],
  data() {
    return {
      showDialog: false,
      nickname: "",
      banTypeValue: "",
      // 按钮loading
      buttonLoading: false,
      params: {
        wtId: "",
        releaseReason: undefined,
      },
    };
  },
  computed: {
    banTypeLabel() {
      if (!this.dict) return "";
      const result = this.dict.type.sys_disable_type.find(
        (item) => item.value === this.banTypeValue
      );
      return result ? result.label : "";
    },
  },
  methods: {
    onDictReady(dict) {
      this.params.releaseReason = dict.type.sys_release_reason[0].value;
    },
    openDialog(item) {
      this.nickname = item.relationName;
      this.params.wtId = item.relationId;
      this.banTypeValue = item.type.toString();
      this.showDialog = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          unbanUser(this.params)
            .then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.showDialog = false;
              this.$emit('success')
            })
            .finally(() => {
              this.buttonLoading = false;
            });
        }
      });
    },
    cancel() {
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
