<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="领头羊ID" prop="wtId">
        <el-input
          v-model="queryParams.wtId"
          placeholder="请输入领头羊ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户分组">
        <el-select v-model="queryParams.userGroup" placeholder="请选择用户分组" clearable>
          <el-option
            v-for="dict in dict.type.app_user_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="注册IP" prop="joinIp">
        <el-input
          v-model="queryParams.joinIp"
          placeholder="请输入注册IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="登录IP" prop="lastLoginIp">
        <el-input
          v-model="queryParams.lastLoginIp"
          placeholder="请输入登录IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户性别">
        <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="地区" prop="area">
        <el-select
          v-model="queryParams.area"
          placeholder="请选择地区"
          clearable
        >
          <el-option
            v-for="area in areaOptions"
            :key="area.value"
            :label="area.label"
            :value="area.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="actionStatus">
        <el-select
          v-model="queryParams.actionStatus"
          placeholder="请选择用户账号状态"
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
      <el-form-item label="设备ID" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="registerDateRange"
          style="width: 220px"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="loginDateRange"
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
          v-hasPermi="['app:user:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="false" />
      <el-table-column label="用户昵称" align="center" prop="nickName" width="120">
        <template #default="scope">
          <span
            style="color: rgb(64, 158, 255); cursor: pointer"
            @click="goToUserDetail(scope.row)"
            >{{ scope.row.nickName }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center" prop="area" />
      <el-table-column label="领头羊ID" align="center" prop="wtId" width="100" />
      <el-table-column
        label="手机号"
        align="center"
        prop="mobile"
        width="120"
      />
      <el-table-column label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="" trigger="hover">
            <img
              :src="scope.row.avatar ? baseUrl+scope.row.avatar : defaultAvatar"
              width="200"
              height="200"
            />
            <img
              slot="reference"
              :src="scope.row.avatar ? baseUrl+scope.row.avatar : defaultAvatar"
              width="40"
              height="40"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center" prop="birthday" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <span>{{ parseInt(scope.row.gender) === 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="actionStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.actionStatus === 0">正常</span>
          <span v-else-if="scope.row.actionStatus === 2 || scope.row.actionStatus === 3">封禁中</span>
          <span v-else-if="scope.row.actionStatus === 1">已注销</span>
          <span v-else>{{ scope.row.actionStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="注册IP" align="center" prop="joinIp" />
      <el-table-column
        label="注册时间"
        align="center"
        prop=""
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="登录ip"
        align="center"
        prop="lastLoginIp"
        width="160"
      />
      <el-table-column
        label="最近登录时间"
        align="center"
        prop="lastLoginTime"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" align="center" prop="deviceId" />
      <el-table-column
        label="用户分组"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.userGroup" placeholder="请设置用户分组" @change="userGroupSelectChange(scope.row)" clearable>
          <el-option
            v-for="dict in dict.type.app_user_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.actionStatus == 0"
            size="mini"
            type="danger"
            @click="handleBanDialog(scope.row)"
            >封禁</el-button
          >
          <el-button
          v-if="scope.row.actionStatus == 2 || scope.row.actionStatus == 3"
            size="mini"
            type="primary"
            @click="handleUnBanDialog(scope.row)"
            >解封</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="goToUserDetail(scope.row)"
            >查看详情</el-button
          >
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
    <UnbanDialog ref="unBanDialog" @success="getList" />
  </div>
</template>

<script>
import { listUser, addUserGroup } from "@/api/app/user";
import UserDisableRecord from "../../components/userDisableRecord";
import UnbanDialog from "../disableRecords/UnbanDialog.vue";
import { getBaseUrl } from '@/utils/auth'
import defaultAvatar from '@/assets/images/defaultAvatar.png'

export default {
  name: "User",
  dicts: ["sys_user_sex", "app_user_group"],
  components: { UserDisableRecord, UnbanDialog },
  data() {
    return {
      baseUrl: getBaseUrl(),
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
      // 用户管理表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      registerDateRange: [],
      loginDateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wtId: undefined,
        nickName: undefined,
        userGroup: undefined,
        mobile: undefined,
        gender: undefined,
        bio: undefined,
        area: undefined,
        regionId: undefined,
        joinIp: undefined,
        loginFailure: undefined,
        deviceId: undefined,
        actionStatus: undefined,
      },
      // 表单参数
      form: {},
      // 区域数据
      areaOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "中国",
          label: "CN",
        },
      ],
      // 用户状态
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
          value: 2,
          label: "封禁中",
        },
        {
          value: 1,
          label: "已注销",
        }
      ],
      // 表单校验
      rules: {
        id: [{ required: true, message: "ID不能为空", trigger: "blur" }],
        wtId: [{ required: true, message: "领头羊ID不能为空", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
        ],
      },
      defaultAvatar: defaultAvatar,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户管理列表 */
    getList() {
      this.loading = true;
      const queryParams = { ...this.queryParams };
      if (this.registerDateRange && this.registerDateRange.length !== 0) {
        (queryParams.joinTimeStart = this.registerDateRange[0]),
          (queryParams.joinTimeEnd = this.registerDateRange[1]);
      }
      if (this.loginDateRange && this.loginDateRange.length !== 0) {
        (queryParams.lastLoginTimeStart = this.loginDateRange[0]),
          (queryParams.lastLoginTimeEnd = this.loginDateRange[1]);
      };
      listUser(queryParams).then((response) => {
        this.userList = response.rows;
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
        wtId: undefined,
        nickName: undefined,
        pwd: undefined,
        salt: undefined,
        mobile: undefined,
        infoStatus: undefined,
        avatar: undefined,
        birthday: undefined,
        gender: undefined,
        bio: undefined,
        area: undefined,
        regionId: undefined,
        fontSize: undefined,
        friendsBackImage: undefined,
        voiceTel: undefined,
        joinIp: undefined,
        lastLoginIp: undefined,
        lastLoginTime: undefined,
        loginFailure: undefined,
        qrcode: undefined,
        deviceId: undefined,
        userStatus: undefined,
        actionStatus: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        userGroup: undefined
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
      this.registerDateRange= [];
      this.loginDateRange= [];
      this.queryParams.userGroup = undefined;
      this.queryParams.gender = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查看详情按钮操作 */
    goToUserDetail(row) {
      const id = row.wtId;
      this.$router.push({ name: "userDetail", query: { id: id }});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "app/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    handleBanDialog(item) {
      let data = {
        relationName: item.nickName,
        relationId: item.wtId,
        type: 0,
      }
      this.$refs["banDialog"].openDialog(data);
    },
    handleUnBanDialog(item) {
      let data = {
        relationName: item.nickName,
        relationId: item.wtId,
        type: item.disableLevel,
      }
      this.$refs["unBanDialog"].openDialog(data);
    },
    userGroupSelectChange(row) {
      addUserGroup({id: row.id, userGroup: row.userGroup}).then((response)=>{
        console.log(response);
        if (response.code === 200) this.$message.success("操作成功");
      })
    },
  },
};
</script>
