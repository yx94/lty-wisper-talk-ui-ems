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
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="性别" prop="sex" />
      <el-table-column label="出生年月" prop="year" />
      <el-table-column label="身份证号" prop="font" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="工资账号" prop="num" />
      <el-table-column label="实名认证" prop="isTrue" />
      <el-table-column label="人脸核实" prop="isFace" />
      <el-table-column label="岗位名称" prop="entryName" />
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleQuery(scope.row)">确认入职</el-button>
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
        tableData: [
          {
            name: "施免升",sex:"男",year:'2006-10',font:'350622200510270519',phone:'15992035383',num:'15992035383',isTrue:'已认证',isFace:'已认证',entryName:'普工/操作工'
          },
          {
            name: "陈全优",sex:"男",year:'1972-05',font:'362425197212063033',phone:'13860142801',num:'13860142801',isTrue:'已认证',isFace:'已认证',entryName:'普工/操作工'
          },
          {
            name: "张丽",sex:"女",year:'1980-06',font:'412927197809160025',phone:'13525176586',num:'13525176586',isTrue:'已认证',isFace:'已认证',entryName:'普工/操作工'
          },
          {
            name: "朱凯",sex:"男",year:'1996-03',font:'362330199611153815',phone:'13627931356',num:'13627931356',isTrue:'已认证',isFace:'已认证',entryName:'普工/操作工'
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
