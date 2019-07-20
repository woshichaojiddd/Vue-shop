<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-table :data="rightList" border style="width: 100%">
          <el-table-column type="index" align="center">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称" align="center">
          </el-table-column>
          <el-table-column prop="path" label="路径" align="center">
          </el-table-column>
          <el-table-column  prop="level" label="权限等级" align="center">
              <template slot-scope="item">
                <el-tag v-if="item.row.level == 0">一级</el-tag>
                <el-tag type="success" v-if="item.row.level == 1">二级</el-tag>
                <el-tag type="warning" v-if="item.row.level == 2">三级</el-tag>
              </template>             
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
        rightList: []
    }
  },

  methods: {
      // 获取权限列表
      async getRights() {
          const res = await this.axios.get('rights/list')
        //   console.log(res);
          this.rightList = res.data
          
      }
  },

  created () {
      this.getRights()
  }
}
</script>

<style lang='less' scoped>

</style>
