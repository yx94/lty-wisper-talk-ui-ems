<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公告标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公告类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择公告类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.user_notice_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择处理状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.user_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接收用户类型" prop="userType" label-width="100px">
        <el-select
          v-model="queryParams.userType"
          placeholder="请选择接收类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.notice_user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-select
          v-model="queryParams.createBy"
          placeholder="请选择创建者"
          clearable
        >
          <el-option
            v-for="item in createByOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['app:noticeInfo:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['app:noticeInfo:edit']"
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
          v-hasPermi="['app:noticeInfo:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="noticeInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="处理状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.user_notice_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="公告ID" align="center" prop="id" />
      <el-table-column label="公告标题" align="center" prop="title" />
      <el-table-column label="公告类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.user_notice_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column label="接收用户类型" align="center" prop="userType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.notice_user_type"
            :value="scope.row.userType"
          />
        </template>
      </el-table-column>
      <el-table-column label="接收用户" align="center" prop="userWtid">
        <template slot-scope="scope">
          <span v-if="scope.row.userType === 1">
            <span
              v-for="(userId, index) in scope.row.userWtid.split(',')"
              :key="index"
              style="color: rgb(64, 158, 255); cursor: pointer"
              @click="goToUserDetail(userId)"
            >
              {{ userId }}
              <span v-if="index < scope.row.userWtid.split(',').length - 1"
                >,</span
              >
            </span>
          </span>
          <span v-else>全部用户</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="公告内容" align="center" prop="noticeContent" />
      <el-table-column label="公告图片" align="center" prop="noticeImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.noticeImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="公告跳转链接" align="center" prop="noticeH5" /> -->
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column label="处理人" align="center" prop="updateBy" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <span class="btn-list" v-if="scope.row.status !== 0">
            <el-button size="mini" type="text" @click="openDetails(scope.row)"
              >查看详情</el-button
            >
          </span>
          <span class="btn-list" v-if="scope.row.status === 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['app:noticeInfo:edit']"
              >编辑修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['app:noticeInfo:remove']"
              >删除公告</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-promotion"
              @click="handleSend(scope.row)"
              v-hasPermi="['app:noticeInfo:remove']"
              >通过并发送</el-button
            >
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

    <!-- 添加或修改公告消息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      center
      class="noticeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
            :readonly="!showSubmitBtn"
          />
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择公告类型"
            :disabled="!showSubmitBtn"
          >
            <el-option
              v-for="dict in dict.type.user_notice_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收类型" prop="userType">
          <el-select
            v-model="form.userType"
            placeholder="请选择接收类型"
            :disabled="!showSubmitBtn"
          >
            <el-option
              v-for="dict in dict.type.notice_user_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="指定用户"
          prop="userWtid"
          v-if="form.userType === 1"
        >
          <el-input
            :readonly="!showSubmitBtn"
            v-model="form.userWtid"
            type="textarea"
            placeholder="请输入用户的轻语ID，多账户用英文逗号隔开"
          />
        </el-form-item>
        <el-form-item label="公告正文">
          <!-- <editor v-model="form.noticeContent" :min-height="192"/> -->
          <el-input
            :readonly="!showSubmitBtn"
            v-model="form.noticeContent"
            type="textarea"
            placeholder="请输入公告正文"
            :autosize="{ minRows: 10 }"
          />
        </el-form-item>
        <el-form-item
          label="公告图片"
          prop="noticeImage"
          v-if="form.type && form.type !== 0"
        >
          <image-upload v-if="showSubmitBtn" v-model="form.noticeImage" />
          <image-preview
            v-else
            :src="form.noticeImage"
            :width="200"
            :height="200"
          />
        </el-form-item>
        <el-form-item label="H5链接" prop="noticeH5" v-if="form.type === 2">
          <el-input
            :readonly="!showSubmitBtn"
            v-model="form.noticeH5"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="showSubmitBtn">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNoticeInfo,
  getNoticeInfo,
  delNoticeInfo,
  addNoticeInfo,
  updateNoticeInfo,
  sendNotice,
} from "@/api/app/noticeInfo";
import { getUserListAll } from "@/api/app/user";

export default {
  name: "NoticeInfo",
  dicts: ["user_notice_status", "notice_user_type", "user_notice_type"],
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
      // 公告消息表格数据
      noticeInfoList: [],
      createByOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        status: undefined,
        userType: undefined,
        createBy: undefined,
        title: undefined,
        id: undefined,
      },
      // 创建时间
      createDateRange: [],
      // 表单参数
      form: {},
      // 是否展示提交按钮
      showSubmitBtn: true,
      // 表单校验
      rules: {
        title: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "公告类型不能为空", trigger: "change" },
        ],
        userType: [
          { required: true, message: "接收类型不能为空", trigger: "change" },
        ],
        userWtid: [
          { required: true, message: "指定用户不能为空", trigger: "blur" },
        ],
        noticeImage: [
          { required: true, message: "公告图片不能为空", trigger: "blur" },
        ],
        noticeH5: [
          { required: true, message: "公告跳转链接不能为空", trigger: "blur" },
        ],
        userWtid: [
          { required: true, message: "指定用户不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询公告消息列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.createDateRange && this.createDateRange.length !== 0) {
        (queryParams.startTime = this.createDateRange[0]),
          (queryParams.endTime = this.createDateRange[1]);
      }
      listNoticeInfo(queryParams).then((response) => {
        this.noticeInfoList = response.rows;
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
        title: undefined,
        type: undefined,
        status: undefined,
        userType: undefined,
        noticeContent: undefined,
        noticeImage: undefined,
        noticeH5: undefined,
        userWtid: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.resetForm("queryForm");
      this.createDateRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.showSubmitBtn = true;
      this.open = true;
      this.title = "新增公告发送申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      this.showSubmitBtn = true;
      const id = row.id || this.ids;
      getNoticeInfo(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改公告发送申请";
      });
    },
    openDetails(row) {
      this.loading = true;
      this.reset();
      this.showSubmitBtn = false;
      const id = row.id || this.ids;
      getNoticeInfo(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看公告详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateNoticeInfo(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addNoticeInfo(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的公告消息？')
        .then(() => {
          this.loading = true;
          return delNoticeInfo(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /** 发送消息操作 */
    handleSend(row) {
      this.loading = true;
      const id = row.id;
      sendNotice(id)
        .then((response) => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("发送成功");
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /** 查看详情按钮操作 */
    goToUserDetail(id) {
      this.$router.push({ name: "userDetail", query: { id: id } });
    },
    // 获取用户列表
    getUserList() {
      getUserListAll()
        .then((res) => {
          const newOptions = res.reduce((acc, item) => {
            if (!acc.some((option) => option.value === item.userId)) {
              acc.push({
                label: item.userName,
                value: item.userId,
              });
            }
            return acc;
          }, this.createByOptions.slice());
          this.createByOptions = newOptions;
        })
        .catch((error) => {
          console.error("获取用户列表失败:", error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  .el-button {
    margin-left: 0px !important;
  }
}
</style>
<style>
.noticeDialog {
  height: 100vh;
  overflow: hidden;
  .el-dialog .el-dialog__body {
    height: calc(90vh - 110px);
    overflow-y: auto;
  }
}
</style>
