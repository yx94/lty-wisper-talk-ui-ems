<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" v-if="groupStatus === 0">
      <!-- <el-row :gutter="10" class="mb8" v-if="!isBatchRemove">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="isBatchRemove = true"
            >批量移出群成员</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['app:group:export']"
            >导出</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb8" v-else>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="cancelBatch"
            >退出批量</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" size="mini" @click="batchRemove"
            >批量移出</el-button
          >
        </el-col>
      </el-row> -->

      <el-col :span="1.5">
        <el-button type="danger" size="mini" @click="batchRemove"
          >批量移出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['app:group:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>
    <el-row class="mb20 mt20 memberTitle">
      <span>{{ `${groupName}（id：${groupId}），${total}位成员如下：` }}</span>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="memberList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="isBatchRemove"
      /> -->
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="成员昵称" align="center" prop="groupNickname">
        <template #default="scope">
          <span style="color: rgb(64, 158, 255); cursor: pointer" @click="goToUserDetail(scope.row.wtId)">{{
            scope.row.groupNickname
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员ID" align="center" prop="wtId" />
      <el-table-column label="成员角色" align="center" prop="identity">
        <template slot-scope="scope">
          <span v-if="scope.row.identity === 1">普通群成员</span>
          <span v-else-if="scope.row.identity === 2">管理员</span>
          <span v-else-if="scope.row.identity === 3">群主</span>
        </template>
      </el-table-column>
      <el-table-column label="入群时间" align="center" prop="createTime" />
      <el-table-column label="入群方式" align="center" prop="joinType">
        <template slot-scope="scope">
          <span v-if="scope.row.identity === 3">— —</span>
          <span v-else-if="scope.row.joinType === 1">扫码</span>
          <span v-else-if="scope.row.joinType === 2"
            >{{ scope.row.inviterUserName }}邀请</span
          >
          <span v-else-if="scope.row.joinType === 3">搜索群ID</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="memberStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.memberStatus === 0">正常</span>
          <span v-else-if="scope.row.memberStatus === 1">已退群</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        v-if="groupStatus === 0"
      >
        <template slot-scope="scope" v-if="scope.row.memberStatus === 0">
          <span v-if="scope.row.identity !== 3" class="btn-member">
            <span>
              <el-button
                size="mini"
                type="danger"
                @click="toRemoveMember(scope.row)"
              >
                移出
              </el-button>
            </span>
            <span>
              <el-button
                v-if="scope.row.identity === 2"
                size="mini"
                type="danger"
                @click="handleAdmin(scope.row)"
              >
                取消管理权限
              </el-button>
              <el-button
                v-else
                size="mini"
                type="primary"
                @click="handleAdmin(scope.row)"
              >
                设为管理员
              </el-button>
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getGroupMember"
    />
  </div>
</template>
<script>
import {
  listMember,
  removeMember as removeMemberApi,
  setOrCancelManager,
} from "../../../api/app/group";
export default {
  name: "groupMember",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      groupId: this.$route.query.groupNumber,
      groupName: this.$route.query.groupName,
      groupStatus: parseInt(this.$route.query.groupStatus),
      memberList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      isBatchRemove: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.groupId = to.query.groupNumber;
      vm.groupName = to.query.groupName;
      vm.groupStatus = parseInt(to.query.groupStatus);
      (vm.queryParams = {
        pageNum: 1,
        pageSize: 10,
      }),
        vm.getGroupMember();
    });
  },
  methods: {
    getGroupMember() {
      this.loading = true;
      console.log(this.groupStatus);
      listMember(this.queryParams, { groupNumber: this.groupId })
        .then((response) => {
          if (response.code === 200) {
            this.memberList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.wtId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/groupMember/export",
        { groupNumber: this.groupId },
        `${this.groupName}(id:${this.groupId})_${new Date().getTime()}.xlsx`,
        {
          headers: { ContentType: "application/json" },
          params: this.queryParams,
          transformRequest: undefined,
        }
      );
    },
    toRemoveMember(row) {
      this.$modal
        .confirm("确定将该用户从群聊中移出吗？")
        .then(() => {
          this.removeMember(row.wtId);
        })
        .catch(() => {
          console.log("取消了");
        });
    },
    batchRemove() {
      let ids = this.ids;
      if (ids.length === 0) {
        this.$modal.msgError("请选择需要移出的用户");
        return;
      }
      this.$modal
        .confirm("确定将" + ids.length + "位用户移出群聊吗？")
        .then(() => {
          this.removeMember();
        })
        .catch(() => {
          console.log("取消了");
        });
    },
    cancelBatch() {
      this.isBatchRemove = false;
      this.ids = [];
      this.$refs.multipleTable.clearSelection();
    },
    removeMember(id) {
      let ids = id ? [id] : this.ids;
      let data = {
        groupNumber: this.groupId,
        wtIds: ids,
      };
      removeMemberApi(data)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getGroupMember();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleAdmin(row) {
      if (row.identity === 2) {
        this.$modal
          .confirm("确定取消该用户的管理权限吗？")
          .then(() => {
            this.removeAdmin(row.wtId);
          })
          .catch(() => {
            console.log("取消了");
          });
      } else {
        this.$modal
          .confirm("确定将该用户设为管理员吗？")
          .then(() => {
            this.addAdmin(row.wtId);
          })
          .catch(() => {
            console.log("取消了");
          });
      }
    },
    addAdmin(id) {
      let data = {
        groupNumber: this.groupId,
        wtIds: [id],
        identity: 2,
      };
      setOrCancelManager(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getGroupMember();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    removeAdmin(id) {
      let data = {
        groupNumber: this.groupId,
        wtIds: [id],
        identity: 1,
      };
      setOrCancelManager(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getGroupMember();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    goToUserDetail(id) {
      this.$router.push({ name: "userDetail", query: { id: id }});
    },
  },
};
</script>
<style lang="scss" scoped>
.memberTitle {
  font-size: 14px;
  font-weight: 550;
}
.btn-member {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
