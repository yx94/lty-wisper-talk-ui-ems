<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click=""
          v-hasPermi="['system:role:add']">上传</el-button>
      </el-col>
      <right-toolbar :search="false" @queryTable="getList()"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="merchantName" label="服务商"> </el-table-column>
      <el-table-column prop="externalAgreementNo" label="商户签约号"> </el-table-column>
      <el-table-column prop="outBizNo" label="外部单号"> </el-table-column>
      <el-table-column prop="alipayLogonId" label="签约公司支付宝账号"> </el-table-column>
      <el-table-column prop="agreementNo" label="签约成功协议号"> </el-table-column>
      <el-table-column prop="orderId" label="进件单ID"> </el-table-column>
      <el-table-column prop="applyStatus" label="进件状态">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sp_apply_status" :value="scope.row.applyStatus" />
        </template>
      </el-table-column>
      <el-table-column prop="cardNo" label="服务商支付宝唯一转账账号"> </el-table-column>
      <el-table-column prop="bookId" label="记账单id"> </el-table-column>
      <el-table-column prop="signTime" label="签约时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text">创建服务商进件</el-button>
          <el-button type="text">创建记账本</el-button>
          <el-button size="mini" type="text" @click="handleTrans(scope.row)">转账</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发薪弹窗 -->
    <el-dialog title="转账" :visible.sync="TransDialogVisible">

      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="服务商" prop="merchantName">
          <el-input readonly :value="formData.merchantName" placeholder="请输入服务商标识" :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="转账方式" prop="transway">
          <el-radio-group v-model="formData.transway" size="medium">
            <el-radio v-for="(item, index) in transwayOptions" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="转账类型" prop="tansType">
          <el-radio-group v-model="formData.tansType" size="medium">
            <el-radio v-for="(item, index) in dict.type.sp_tans_type" :key="index" :label="item.value"
              :disabled="item.disabled">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="日期选择" prop="month">
          <el-date-picker type="month" v-model="formData.month" format="yyyy-MM" value-format="yyyy-MM"
            :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="上传转账本" prop="fileUrl">
          <el-upload class="upload-demo" drag :auto-upload="false" action='' accept=".pdf,.doc,.docx,.xls,.xlsx"
            :limit="1" :on-change="handleFileUpload" :on-remove="handleFileRemove">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="TransDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTransConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getSubAgreementList,
    transBankCard,
    transAccount
  } from "@/api/salary/server";
  export default {
    name: "server",
    dicts: ['sp_apply_status', 'sp_tans_type'],
    data() {
      return {
        // 遮罩层
        loading: true,
        //表格数据
        tableData: [],
        //发薪弹窗
        TransDialogVisible: false,
        formData: {
          id: '',
          merchantName: '',
          transway: 1,
          tansType: '',
          month: '',
          fileUrl: '',
        },
        rules: {
          transway: [{
            required: true,
            message: '转账方式不能为空',
            trigger: 'change'
          }],
          tansType: [{
            required: true,
            message: '转账类型不能为空',
            trigger: 'change'
          }],
          month: [{
            required: true,
            message: '请选择日期选择',
            trigger: 'change'
          }],
          fileUrl: [{
            validator: this.validateFile,
            trigger: 'change'
          }]
        },
        transwayOptions: [{
          "label": "单笔到卡",
          "value": 1
        }, {
          "label": "单笔到户",
          "value": 2
        }],
      };
    },
    async created() {
      this.getList()
      let tansTypeResponse = await this.getDicts('sp_tans_type')
      this.formData.tansType = tansTypeResponse.data[0].dictValue
    },
    mounted() {

    },
    methods: {
      /** 查询服务商签约列表 */
      getList() {
        this.loading = true
        getSubAgreementList().then(response => {
          this.tableData = response.data;
          this.loading = false
        })
      },
      //发薪弹窗
      handleTrans(rows) {
        // console.log(rows)
        this.formData.id = rows.id
        this.formData.merchantName = rows.merchantName
        this.TransDialogVisible = true
      },
      handleTransConfirm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          // console.log(this.formData)
          let fd = new FormData()
          fd.append("file", this.formData.fileUrl)
          let form = {}
          form.id = this.formData.id
          form.month = this.formData.month
          form.tansType = this.formData.tansType
          // console.log('form',form)
          let json = JSON.stringify(form)
          let blob = new Blob([json], {
            type: 'application/json',
          });
          fd.append("form", blob)

          let transFun = (parmas) => {
            // 单笔到卡
            if (this.formData.transway == 1) {
              return transBankCard(parmas)
            }
            // 单笔到户
            if (this.formData.transway == 2) {
              return transAccount(parmas)
            }
            return
          }

          transFun(fd).then(response => {
            // console.log(response)
            this.$modal.msgSuccess("转账成功");
            this.TransDialogVisible = false;
          })
        })
      },
      // 上传转账本
      handleFileUpload(file) {
        // console.log(file)
        this.formData.fileUrl = file.raw
        this.$refs["elForm"].validateField(["fileUrl"]);
      },
      handleFileRemove(file) {
        this.formData.fileUrl = ''
      },
      validateFile(rule, value, callback) {
        if (!value || value.length === 0) {
          return callback(new Error('请上传转账本'));
        }
        // 可以添加更多验证逻辑，例如文件大小、类型等
        callback(); // 如果验证通过，则调用 callback() 函数，不带参数或传入 null/undefined/'' 等值。
      },
    },
  };
</script>

<style lang="scss" scope>
  .btnbox {
    margin-bottom: 15px;
  }
</style>
