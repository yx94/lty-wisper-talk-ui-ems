<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="群名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入群聊名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="群ID" prop="groupNumber">
        <el-input
          v-model="queryParams.groupNumber"
          placeholder="请输入群聊ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="创建者领头羊id" prop="wtId">
        <el-input
          v-model="queryParams.wtId"
          placeholder="请输入用户领头羊id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者昵称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="群人数" prop="groupMemberCountRange">
        <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
          "
        >
          <el-input-number
            controls-position="right"
            v-model="groupMemberCountRange.min"
            :max="groupMemberCountRange.max - 1"
            :min="0"
            placeholder="最小值"
          />
          <span style="margin: 0 5px">-</span>
          <el-input-number
            controls-position="right"
            v-model="groupMemberCountRange.max"
            :min="groupMemberCountRange.min + 1"
            placeholder="最大值"
          />
        </div>
      </el-form-item>
      <el-form-item label="群状态" prop="groupStatus">
        <el-select
          v-model="queryParams.groupStatus"
          placeholder="请选择群状态"
          clearable
        >
          <el-option
            v-for="status in statusOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="createDateRange"
          style="width: 220px"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="成员保护模式" prop="groupStatus" label-width="120px">
        <el-select
          v-model="queryParams.memberProtectSwitch"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="status in memberProtectOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="全员禁言" prop="groupStatus">
        <el-select
          v-model="queryParams.bannedSwitch"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="status in bannedOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="状态" align="center" prop="groupStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.groupStatus === 0">正常</span>
          <span v-else-if="scope.row.groupStatus === 1">已封禁</span>
          <span v-else-if="scope.row.groupStatus === 99">已解散</span>
        </template>
      </el-table-column>
      <el-table-column
        label="群名称"
        align="center"
        prop="groupName"
        width="120"
      >
        <template #default="scope">
          <span
            style="color: rgb(64, 158, 255); cursor: pointer"
            @click="goToGroupDetail(scope.row)"
            >{{ scope.row.groupName }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="群ID"
        align="center"
        prop="groupNumber"
        width="120"
      />
      <el-table-column
        label="创建者信息"
        align="center"
        prop="userWtId"
        width="160"
      >
        <template #default="scope">
          <span
            style="color: rgb(64, 158, 255); cursor: pointer"
            @click="goToUserDetail(scope.row)"
            >{{ `${scope.row.userName} (ID：${scope.row.userWtId})` }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="100"
      />
      <el-table-column
        label="群公告"
        align="center"
        prop="groupNotice"
        width="180"
      >
        <template #default="scope">
          <el-popover trigger="hover" placement="top">
            <template #reference>
              <span class="eclipse">{{ scope.row.groupNotice || "暂无" }}</span>
            </template>
            <div infinite-scroll-disabled class="popover-content">
              {{ scope.row.groupNotice || "暂无" }}
            </div>
          </el-popover>
          <!-- <span>{{ scope.row.groupNotice || "暂无" }}</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="成员保护模式"
        align="center"
        prop="groupNotice"
        width="100"
      >
        <template #default="scope">
          <span>{{
            scope.row.memberProtectSwitch === 0 ? "关闭" : "开启"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全员禁言" align="center" prop="groupNotice">
        <template #default="scope">
          <span>{{ scope.row.bannedSwitch === 0 ? "关闭" : "开启" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="群人数"
        align="center"
        prop="groupMemberCount"
        width="100"
      />
      <el-table-column
        label="最大群人数"
        align="center"
        prop="groupMemberCount"
        min-width="160"
      >
        <template #default="scope">
          <div class="btn-updateMemberCount">
            <span>{{ scope.row.groupMaxMemberCount }}</span>
            <el-button
              size="mini"
              v-if="scope.row.groupStatus !== 99"
              @click="updateGroupMemberCount(scope.row)"
              >修改</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        align="center"
        prop="operatorName"
        width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.groupStatus === 1">{{
            `${scope.row.operatorName}于${scope.row.operatorTime}操作永久封禁` ||
            "— —"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <span class="btn-group">
            <el-button
              size="mini"
              type="primary"
              @click="goToGroupChat(scope.row)"
            >
              聊天记录
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goToGroupMember(scope.row)"
            >
              成员管理
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="goToGroupDetail(scope.row)"
            >
              群详情
            </el-button>
            <el-button
              v-if="scope.row.groupStatus === 0"
              size="mini"
              type="danger"
              @click="handleBanDialog(scope.row)"
            >
              封禁
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <UserDisableRecord ref="banDialog" @success="getList" />
  </div>
</template>

<script>
import { listGroup, setGroupMemberCount } from "@/api/app/group";
import UserDisableRecord from "../../components/userDisableRecord";
import { MessageBox } from "element-ui";
export default {
  name: "Group",
  components: { UserDisableRecord },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 群组管理表格数据
      groupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      createDateRange: [],
      groupMemberCountRange: {
        min: undefined,
        max: undefined,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupNumber: undefined,
        groupName: undefined,
        groupStatus: undefined,
        wtId: undefined,
        userName: undefined,
        bannedSwitch: undefined,
        memberProtectSwitch: undefined,
      },
      // 表单参数
      form: {},
      // 群聊状态
      statusOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "已封禁",
        },
        {
          value: 99,
          label: "已解散",
        },
      ],
      // 全员禁言状态
      bannedOptions: [
        {
          value: 0,
          label: "关闭",
        },
        {
          value: 1,
          label: "开启",
        },
      ],
      // 群成员保护模式
      memberProtectOptions: [
        {
          value: 0,
          label: "关闭",
        },
        {
          value: 1,
          label: "开启",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询群组管理列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.createDateRange && this.createDateRange.length !== 0) {
        (queryParams.startTime = this.createDateRange[0]),
          (queryParams.endTime = this.createDateRange[1]);
      }
      if (this.groupMemberCountRange !== undefined) {
        if (this.groupMemberCountRange.min !== undefined) {
          queryParams.groupMemberCountLow = this.groupMemberCountRange.min;
        }
        if (this.groupMemberCountRange.max) {
          queryParams.groupMemberCountHigh = this.groupMemberCountRange.max;
        }
      }
      listGroup(queryParams)
        .then((response) => {
          this.groupList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userWtId: undefined,
        userName: undefined,
        groupNumber: undefined,
        groupName: undefined,
        groupAvatar: undefined,
        groupNotice: undefined,
        groupStatus: undefined,
        groupMemberCount: undefined,
        groupMaxMemberCount: undefined,
        warnStatus: undefined,
        createTime: undefined,
        operatorName: undefined,
        operatorTime: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.createDateRange = [];
      this.groupMemberCountRange = {
        min: undefined,
        max: undefined,
      };
      (this.queryParams.bannedSwitch = undefined),
        (this.queryParams.memberProtectSwitch = undefined);
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查看详情按钮操作 */
    goToGroupDetail(row) {
      this.$router.push({
        name: "groupDetail",
        query: { id: row.groupNumber },
      });
    },
    /** 成员管理按钮操作 */
    goToGroupMember(row) {
      const groupNumber = row.groupNumber;
      this.$router.push({
        name: "groupMember",
        query: {
          groupNumber: groupNumber,
          groupName: row.groupName,
          groupStatus: row.groupStatus,
        },
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/group/export",
        {
          ...this.queryParams,
        },
        `group_${new Date().getTime()}.xlsx`
      );
    },
    // 封禁按钮
    handleBanDialog(item) {
      let data = {
        relationName: item.groupName,
        relationId: item.groupNumber,
        type: 1,
      };
      this.$refs["banDialog"].openDialog(data);
    },
    // 更新最大群人数
    updateGroupMemberCount(item) {
      const currentGroupMemberCount = parseInt(item.groupMemberCount, 10);
      MessageBox.prompt("请设置该群最大群人数", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: "请输入大于0的整数",
        inputValue: item.groupMaxMemberCount,
        inputValidator: (value) => {
          const newValue = parseInt(value, 10);
          if (newValue < currentGroupMemberCount) {
            return `设置的最大群人数不可小于当前群人数${currentGroupMemberCount}`;
          }
          return true;
        },
      })
        .then(({ value }) => {
          console.log(value);
          if (value !== item.groupMaxMemberCount) {
            setGroupMemberCount({
              groupNumber: item.groupNumber,
              groupMemberCount: value,
            }).then((res) => {
              console.log(res);
              if (res.code === 200) {
                this.$message.success("操作成功");
                item.groupMaxMemberCount = value;
              }
            });
          }
        })
        .catch(() => {});
    },
    // 群聊聊天记录
    goToGroupChat(item) {
      this.$router.push({
        name: "GroupImchatLog",
        query: {
          groupId: item.groupNumber,
        },
      });
    },
    goToUserDetail(row) {
      this.$router.push({ name: "userDetail", query: { id: row.userWtId }});
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
.btn-updateMemberCount {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.eclipse {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.popover-content {
  overflow-y: scroll;
  max-width: 480px;
  max-height: 500px;
}
</style>
