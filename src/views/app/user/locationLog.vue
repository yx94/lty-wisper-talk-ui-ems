<template>
  <el-dialog
    title="定位日志历史"
    :visible.sync="open"
    :center="true"
    width="460px"
    append-to-body
  >
    <el-table :data="tableData" border style="width: 100%;" height="400px">
      <el-table-column align="center" :resizable="false"  label="序号" type="index" width="50"> </el-table-column>
      <el-table-column align="center" :resizable="false"  prop="loginTime" label="登录时间" width="160">
      </el-table-column>
      <el-table-column header-align="center" :resizable="false" prop="GPSInfo" label="GPS信息">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>

export default {
  name: "locationLog",
  data() {
    return {
      open: false,
      tableData: [
        // {
        //   loginTime: "2023-05-05 12:12:12",
        //   GPSInfo: `东经115°51'28.800"，北纬28°51'28.800"`,
        // }
      ],
    };
  },
  methods: {
    openDialog() {
      this.open = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
