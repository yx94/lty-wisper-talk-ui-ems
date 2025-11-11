<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    :center="true"
    width="750px"
    append-to-body
  >
    <el-row :gutter="10" class="mb8">
      <!-- <span class="mr20">
        <span class="label-title">用户的领头羊id：</span>
        <el-input
          v-model="inputValue"
          placeholder="请输入用户领头羊id"
          clearable
          size="small"
          style="width: 200px"
        />
      </span> -->
      <el-button
        type="primary"
        size="mini"
        style="font-size: 14px"
        @click="add()"
        >添加</el-button
      >
      <el-button
        type="primary"
        size="mini"
        style="font-size: 14px"
        @click="refresh()"
        >刷新</el-button
      >
    </el-row>
    <el-table :data="tableData" border height="400px" style="width: 100%">
      <el-table-column
        align="center"
        :resizable="false"
        label="序号"
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        prop="groupNickname"
        label="用户昵称"
        width="180"
      >
        <template #default="scope">
          <span style="color: rgb(64, 158, 255); cursor: pointer" @click="goToUserDetail(scope.row.wtId)">
            {{ scope.row.groupNickname }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        prop="wtId"
        label="用户ID"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        prop="registerTime"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column align="center" :resizable="false" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="removeMember(scope.row.wtId)"
          >
            移出
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加成员"
      :visible.sync="transferVisible"
      width="800px"
      append-to-body
    >
      <el-transfer
        v-model="value"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入用户ID或昵称"
        :data="allUsers"
        :props="transferProps"
         :titles="['成员列表', '选择列表']"
      >
        <template #default="{ option }">
          {{ option.groupNickname }}
        </template>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTransfer">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
export default {
  name: "handleMember",
  props: {
    title: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    addList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      open: false,
      tableData: [],
      inputValue: "",
      transferVisible: false,
      value: [],
      allUsers: [],
      transferProps: {
        key: "wtId",
        label: "groupNickname",
        disabled: "disabled",
      },
    };
  },
  watch: {
    list: {
      immediate: true,
      handler(val) {
        this.tableData = val;
      },
    },
    addList: {
      immediate: true,
      handler(val) {
        this.allUsers = val.map((user) => ({
          ...user,
          disabled: user.position === 0,
        }));
      },
    },
  },
  methods: {
    openDialog() {
      this.inputValue = "";
      this.open = true;
    },
    add() {
      this.allUsers = [];
      this.value = [];
      this.fetchAllUsers();
      this.transferVisible = true;
    },
    removeMember(wtId) {
      this.$emit("remove", wtId);
    },
    refresh() {
      this.$emit("refresh");
    },
    fetchAllUsers() {
      this.$emit("getData");
    },
    confirmTransfer() {
      if (this.value.length === 0) {
        this.$message({
          message: "请选择要添加的成员",
          type: "warning",
        });
        return;
      }
      this.$emit("add", this.value);
      this.transferVisible = false;
    },
    filterMethod(query, item) {
      return (item.groupNickname.indexOf(query) > -1 || item.wtId.indexOf(query) > -1);
    },
    goToUserDetail(id) {
      this.open = false;
      this.$router.push({ name: "userDetail", query: { id: id }});
      // this.userId = id;
      // this.getUserDetails();
      // window.scrollTo(0, 0);
    },
  },
};
</script>
<style lang="scss" scoped></style>
