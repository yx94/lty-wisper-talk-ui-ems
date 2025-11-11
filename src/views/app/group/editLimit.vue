<template>
  <el-dialog
    title="修改入群限制"
    :visible.sync="dialogVisible"
    width="420px"
    append-to-body
  >
    <div class="limit">
      <div class="limit-item">
        <label>用户等级限制</label>
        <el-switch v-model="isLevelLimit" />
      </div>
      <div class="limit-input" v-if="isLevelLimit">
        <div><span>—&nbsp;</span>等级要求</div>
        <el-input
          v-model="levelLimit"
          placeholder="请输入1-200以内的整数"
          @keypress="allowOnlyNumbers()"
          @input="inputCheck()"
        ></el-input>
        <div v-if="alertTxt" class="limit-input-warn">{{ alertTxt }}</div>
      </div>
    </div>
    <div class="btn">
      <el-button type="cancel" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="submit()">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "editLimit",
  data() {
    return {
      dialogVisible: false,
      isLevelLimit: false,
      levelLimit: "",
      alertTxt: "",
    };
  },
  methods: {
    openDialog(level) {
      if (level) {
        this.isLevelLimit = true;
        this.levelLimit = level;
      } else {
        this.isLevelLimit = false;
        this.levelLimit = "";
      }
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
    },
    confirm() {
      let a = parseInt(this.levelLimit);
      if (this.isLevelLimit && (!a || a < 1 || a > 200)) {
        this.alertTxt = "请输入1-200之间的整数";
        return false;
      }
      return true;
    },
    submit() {
      if (this.isLevelLimit && (!this.levelLimit || this.levelLimit === 0)) {
        this.alertTxt = "请输入限制等级";
      } else {
        if (this.confirm()) {
          let num = this.isLevelLimit ? parseInt(this.levelLimit) : 0;
          this.$emit("success", num);
          this.dialogVisible = false;
          this.clear()
        }
      }
    },
    allowOnlyNumbers(event) {
      const char = String.fromCharCode(event.which);
      if (!/[0-9]/.test(char)) {
        event.preventDefault();
        this.alertTxt = "请输入数字";
      } else {
        this.alertTxt = "";
      }
    },
    inputCheck() {
      if (/[^\d]/g.test(this.levelLimit)) {
        this.levelLimit = this.levelLimit.replace(/[^\d]/g, "");
        this.alertTxt = "请输入数字";
      } else if (
        parseInt(this.levelLimit) < 1 ||
        parseInt(this.levelLimit) > 200
      ) {
        this.alertTxt = "请输入1-200之间的整数";
      } else {
        this.alertTxt = "";
      }
    },
    clear() {
        this.levelLimit = "";
        this.alertTxt = "";
        this.isLevelLimit = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.limit {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 16px;
  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    span {
      color: #999;
    }
    &-warn {
      color: red;
      font-size: 13px;
    }
  }
}
.btn {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 50px;
}
</style>
