<template>
  <div class="LT-table">
    <el-row :gutter="10" class="mb8">
      <!--   <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
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
          v-hasPermi="['system:role:edit']"
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
          v-hasPermi="['system:role:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button>
      </el-col> -->

      <!-- 插槽内容为表格左上方的按钮组 -->
      <slot name="btn"></slot>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="LTGetList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="data">
    <!-- <el-table v-loading="loading" :data="data" @selection-change="handleSelectionChange"> -->
      <slot></slot>
    </el-table>



    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="LTGetList" />
  </div>
</template>

<script>
  export default {
    name: "LTTable",
    props: {
      data:{
        type:Array,
        default:[]
      }
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 显示搜索条件
        showSearch: true,
      }
    },
    created() {
      this.LTGetList();
    },
    methods: {
      /** 查询列表 */
      LTGetList() {
         this.loading = true;
         console.log(this.$parent)
         if(this.$listeners.getList){
           this.$emit('getList', this)
         }else{
           // this.total = this.data
           this.loading = false
         }
        // this.$emit('getList', this)
        // this.loading = true;
        // listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        //     this.roleList = response.rows;
        //     this.total = response.total;
        //     this.loading = false;
        //   }
        // );
      },
      loaded(total){
        this.total = total
         this.loading = false
      }
    }
  }
</script>

<style>
</style>
