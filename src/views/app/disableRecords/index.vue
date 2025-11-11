<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="110px"
    >
      <el-form-item label="被封用户/群ID" prop="relationId">
        <el-input
          v-model="queryParams.relationId"
          placeholder="请输入用户wtId或群ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="封禁对象" prop="relationType">
        <el-select
          v-model="queryParams.relationType"
          placeholder="请选择封禁对象类型"
          clearable
        >
          <el-option label="用户" :value="0" />
          <el-option label="群聊" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="封禁状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择封禁状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_disable_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封禁类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择封禁类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_disable_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封禁时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 220px"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
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
          v-hasPermi="['app:disableRecords:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="disableRecordsList">
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_disable_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="封禁类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_disable_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column label="封禁对象" align="center" prop="relationType">
        <template slot-scope="scope">
          {{ scope.row.relationType === 0 ? "用户" : "群聊" }}
        </template>
      </el-table-column>
      <el-table-column label="被封禁用户/群聊昵称" align="center" prop="relationName">
        <template #default="scope">
          <span style="color: rgb(64, 158, 255); cursor: pointer" @click="goToGroupDetail(scope.row)">
            {{scope.row.relationName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="领头羊ID或群号" align="center" prop="relationId" />
      <el-table-column label="封禁理由" align="center" prop="reason" />
      <el-table-column label="封禁操作人" align="center" prop="operator" />
      <!-- <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.relationType === 0">
          <el-button v-if="scope.row.status === 0" type="text" v-hasPermi="['app:disableRecords:edit']" @click="openDialog(scope.row)">
            解除封禁
          </el-button>
          <div v-if="scope.row.status === 1">
            {{ scope.row.operateTips }}
          </div>
          <div v-if="scope.row.status === 2">封禁结束</div>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <UnbanDialog ref="dialog" @success="onUnbanUserSuccess" />
  </div>
</template>

<script>
import { listDisableRecords } from "@/api/app/disableRecords";
import UnbanDialog from "./UnbanDialog";
export default {
  name: "DisableRecords",
  dicts: ["sys_disable_status", "sys_disable_type"],
  components: { UnbanDialog },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 封禁管理表格数据
      disableRecordsList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        relationId: undefined,
        relationName: undefined,
        relationType: undefined,
        status: undefined,
        type: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询封禁管理列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.dateRange && this.dateRange.length !== 0) {
        (queryParams.startTime = this.dateRange[0]),
          (queryParams.endTime = this.dateRange[1]);
      }

      listDisableRecords(queryParams).then((response) => {
        this.disableRecordsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    openDialog(item) {
      this.$refs["dialog"].openDialog(item);
    },
    onUnbanUserSuccess() {
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/disableRecords/export",
        {
          ...this.queryParams,
        },
        `disableRecords_${new Date().getTime()}.xlsx`
      );
    },
    /** 查看详情按钮操作 */
    goToGroupDetail(row) {
      if (row.relationType === 0) {
        this.$router.push({ name: "userDetail", query: { id: row.relationId }});
      } else if (row.relationType === 1) {
      this.$router.push({ name: "groupDetail", query: { id: row.relationId } });
      }
    },
  },
};
</script>
