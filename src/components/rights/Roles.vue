<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-button type="primary">添加角色</el-button>
         <el-table :data="rolesList" border style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 循环一级权限 行row 列col   -->
                    <el-row :key="item.id" v-for="(item,i) in scope.row.children" class="br_bottom" :class="i==0?'br_top':''">
                        <el-col :span="6">
                            <el-tag >{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 循环二级权限 -->
                        <el-col :span="18">
                            <el-row :key="item2.id" v-for="(item2,i) in item.children" :class="i==0?'':'br_top'">
                                <el-col :span="6">
                                    <el-tag type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 循环三级权限 -->
                                <el-col :span="18" >
                                    <el-tag type="warning" :key="item3.id" v-for="item3 in item2.children">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" align="center">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" >
            </el-table-column>
            <el-table-column label="操作" width="290">
                <template slot-scope="item">
                    <!-- 编辑权限 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <!-- 删除权限 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                    <!-- 分配权限 -->
                    <el-button type="warning" icon="el-icon-setting" size="mini" >分配权限</el-button>
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
        rolesList: []
    }
  },

  methods: {
      async getRolses() {
          const res = await this.axios.get('roles')
          console.log(res);
          this.rolesList = res.data
      }
  },

  created () {
      this.getRolses()
  }
}
</script>

<style lang='less' scoped>
.el-table {
    margin-top: 20px;
    .el-tag {
        margin: 8px;
    }
}
.br_bottom {
    border-bottom: 1px solid #eee;
}
.br_top {
    border-top: 1px solid #eee;
}
.el-row {
    display: flex;
    align-items: center;
}

</style>
