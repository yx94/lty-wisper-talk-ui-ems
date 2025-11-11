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
    <LT-table @getList="getList" :data="tableData">

        <el-table-column label="URL" prop="signUrl" />

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleQuery(scope.row)"
            >查询</el-button>
          </template>
        </el-table-column>
    </LT-table>
  </div>
</template>

<script>
  import {
    getSignUrlList
  } from "@/api/salary/link";

  export default {
    name: "Link",
    data() {
      return {
        tableData: [{
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄",
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 弄",
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
        let queryParams = {...ref.queryParams}
        getSignUrlList(queryParams).then(response => {
          this.tableData = response.rows;
          that.loaded(response.total)
        })
      },
      handleQuery(){

      }
    },
  };
</script>

<style lang="scss" scope>
  .btnbox {
    margin-bottom: 15px;
  }
</style>
