<template>
  <div class="head-container">
    <div class="head-container">
      <el-input
        v-model="deptName"
        placeholder="请输入部门名称"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px"
      />
    </div>
    <div class="head-container">
      <el-tree
        ref="tree"
        :data="deptList"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        default-expand-all
        append-to-body="true"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'LeftDept',
  components: { Treeselect },
  props: {
    // 部门数据list
    deptList: {
      type: Array,
      default: () => []
    },
    // 部门选中后触发父组件查询方法
    handleQuery: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      deptName: undefined,
      getDeptName: undefined,
      deptId: undefined,
      deptOptions: []
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.deptId = data.id
      this.getDeptName = data.label
      this.handleQuery()
    }
  }
}
</script>
