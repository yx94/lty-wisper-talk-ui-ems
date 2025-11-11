<template>
  <div class="app-container">
    <!-- <div class="btnbox">
      <el-button type="primary" plain size="small">生成签约链接</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" size="mini">
      <el-table-column prop="date" label="URL"> </el-table-column>
      <el-table-column label="操作" width="180">
        <el-button type="text">查询</el-button>
      </el-table-column>
    </el-table> -->
    <LT-table :data="tableData">
      <el-table-column label="登记链接" prop="signUrl">
        <template slot-scope="scope">
         <qrcode-vue :value="scope.row.signUrl" size="100"></qrcode-vue>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleQuery(scope.row)">查询</el-button>
        </template>
      </el-table-column>
    </LT-table>
  </div>
</template>

<script>
  import {
    getSignUrlList
  } from "@/api/salary/link";
  import QrcodeVue from 'qrcode.vue'

  export default {
    name: "anxin",
    components:{
      QrcodeVue
    },
    data() {
      return {
        tableData: [{
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=687b59193f3f462dd5336e5a"
          },
          {
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=gsfgsgfgbryt566666"
          },
          {
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=yurutdyhdgjugh5657"
          },
          {
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=454554sretnfdvbds"
          },
          {
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=799srtghsrgcj454656"
          },
          {
            signUrl: "https://openapi.alipay.com/gateway.do?alipay_root_cert_sn=696985aerfgsfzcdf"
          },
        ],
      };
    },
    created() {},
    mounted() {},
    methods: {
      /** 查询签约列表 */
      getList(ref) {
        let that = ref;
        let queryParams = {
          ...ref.queryParams
        }
        getSignUrlList(queryParams).then(response => {
          this.tableData = response.rows;
          that.loaded(response.total)
        })
      },
      handleQuery() {

      }
    },
  };
</script>

<style lang="scss" scope>
  .btnbox {
    margin-bottom: 15px;
  }
</style>
