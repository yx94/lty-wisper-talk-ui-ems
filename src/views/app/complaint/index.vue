<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="举报用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入举报用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="举报对象" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.user_complaint_user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="举报用户或者群id" prop="targetUserId">
        <el-input
          v-model="queryParams.targetUserId"
          placeholder="请输入举报用户或者群id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="举报类型" prop="complaintType">
        <el-select v-model="queryParams.complaintType" placeholder="请选择举报类型" clearable>
          <el-option
            v-for="dict in dict.type.user_complaint_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="complaintStatus">
        <el-select v-model="queryParams.complaintStatus" placeholder="请选择处理状态" clearable>
          <el-option
            v-for="dict in dict.type.user_complaint_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="举报时间">
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['app:complaint:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['app:complaint:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['app:complaint:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="complaintList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="主键" align="center" prop="id" v-if="false"/>
      <el-table-column label="举报用户ID" align="center" prop="userId" />
      <el-table-column label="举报对象" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_complaint_user_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="举报用户或者群id" align="center" prop="targetUserId" />
      <el-table-column label="举报类型" align="center" prop="complaintType"/>
      <el-table-column label="处理状态" align="center" prop="complaintStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_complaint_status" :value="scope.row.complaintStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="举报描述" align="center" prop="complaintDetail" />
      <el-table-column label="举报证据" align="center" prop="complaintImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.complaintImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="举报时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleIgnore(scope.row)"
          >忽略</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleWarn(scope.row)"
          >警告</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDisable(scope.row)"
          >封禁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <UserDisableRecord ref="banDialog" @success="handleDisableSuccess" />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {listComplaint, complaintBatchIgnore, complaintWarn, complaintDisable} from "../../../api/app/complaint";
import UserDisableRecord from "../../components/userDisableRecord/index.vue";


export default {
  name: "Complaint",
  components: {UserDisableRecord},
  dicts: ['user_complaint_user_type', 'user_complaint_status', 'user_complaint_type'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 封禁处理记录
      disableId: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 举报管理表格数据
      complaintList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        targetUserId: undefined,
        type: undefined,
        complaintType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "举报用户ID不能为空", trigger: "blur" }
        ],
        targetUserId: [
          { required: true, message: "举报对象id或者群id不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        complaintType: [
          { required: true, message: "举报类型不能为空", trigger: "change" }
        ],
        complaintStatus: [
          { required: true, message: "处理状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询举报管理列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.dateRange && this.dateRange.length !== 0) {
        queryParams.startTime = this.dateRange[0];
        queryParams.endTime = this.dateRange[1];
      }
      listComplaint(queryParams).then(response => {
        this.complaintList = response.rows;
        this.total = response.total;
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
        userId: undefined,
        targetUserId: undefined,
        type: undefined,
        complaintType: undefined,
        complaintStatus: undefined,
        complaintDetail: undefined,
        complaintImage: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    handleIgnore(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认忽略？').then(function() {
        return complaintBatchIgnore(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => {});
    },
    handleWarn(item) {
      this.$modal.confirm('是否确认警告用户？').then(function() {
        return complaintWarn(item.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => {});
    },
    handleDisable(item) {
      let data;
      if(item.item ===  2){
        data = {
          relationName: item.targetGroup.groupName,
          relationId: item.targetGroup.groupNumber,
          type: 1,
        };
      }else {
        data = {
          relationName: item.targetUser.nickName,
          relationId: item.targetUser.wtId,
          type: 0,
        }
      }
      this.disableId = item.id;
      this.$refs["banDialog"].openDialog(data);
    },
    handleDisableSuccess(){
      let data = {
        id: this.disableId,
        disableType: this.$refs["banDialog"].form.type,
      }
      complaintDisable(data).then(res => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
        this.disableId = "";
      }).catch(() => {});
    }
  }
};
</script>
