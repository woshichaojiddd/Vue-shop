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
                    <el-row :key="item1.id" v-for="(item1,i) in scope.row.children" class="br_bottom" :class="i==0?'br_top':''">
                        <el-col :span="6">
                            <el-tag closable @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 循环二级权限 -->
                        <el-col :span="18">
                            <el-row :key="item2.id" v-for="(item2,i) in item1.children" :class="i==0?'':'br_top'">
                                <el-col :span="6">
                                    <el-tag  closable @close="removeTag(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 循环三级权限 -->
                                <el-col :span="18" >
                                    <el-tag closable @close="removeTag(scope.row,item3.id)" type="warning" :key="item3.id" v-for="item3 in item2.children">{{item3.authName}}</el-tag>
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
                <template slot-scope="scope">
                    <!-- 编辑权限 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <!-- 删除权限 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                    <!-- 分配权限 -->
                    <el-button @click="showSetrightDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini" >分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setrightDialogVisible" width="50%" @close="resetDefKeys">
        <!-- 树形控件显示权限 -->
        <!-- node-key="id" 将选择项的id值存储起来 -->
        <el-tree ref="treeRef" node-key="id" :data="rightList" :props="treeProps" :default-checked-keys="defKeys" default-expand-all show-checkbox  style="height:400px;overflow-y:scroll"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setrightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRightBtn">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    return {
        // 角色列表
        rolesList: [],
        // 分配权限对话框的显示与隐藏
        setrightDialogVisible: false,
        // 权限数据列表
        rightList: [],
        // 树形控件参数设置
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        // 树形控件默认选中的节点
        defKeys: [],
        // 树形控件已选中权限的角色id
        roleId: 0
    }
  },

  methods: {
      // 获取角色列表信息
      async getRolses() {
          const res = await this.axios.get('roles')
        //   console.log(res);
          this.rolesList = res.data
      },
      // 删除权限标签
      removeTag(row,rightId) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
          console.log(res);
          if(res.meta.status == 200) {
              this.$message.success('删除成功!');
              row.children = res.data
          } else {
             this.$message.error(res.data.msg); 
          }         
        }).catch(() => {
          this.$message.info('已取消删除');          
        });
      },
      // 显示分配权限对话框,获取权限数据以及获取已选id数组
      async showSetrightDialog(role) {
          // 获取权限数据列表
          var res = await this.axios.get('/rights/tree')
          console.log(res);
          if(res.meta.status == 200) {
              this.rightList = res.data
              // 获取数据后显示树状结构
              this.setrightDialogVisible = true
              // 调用获取已选三级id数据的函数
              this.getAllKyes(role)
              // 获取对应的角色id
              this.roleId = role.id
          } else {
              this.$message.error(res.data.msg);
          }
          
      },
      // 拿到已有权限三级id且转化为数组的数据函数 递归函数
      getAllKyes(row) {
          row.children.forEach(item=> {
              if(!item.children) {
               return this.defKeys.push(item.id)   
              }
              this.getAllKyes(item)
          })
      },
      // 关闭对话框时 清空defKeys
      resetDefKeys() {
          this.defKeys = []
     },
     // 角色授权提交功能
     async setRightBtn() {
        // console.log(this.roleId);
        // 获取已选三级节点id数组
        // console.log(this.$refs.treeRef.getCheckedKeys());
        // 获取半选节点的id数组
        // console.log(this.$refs.treeRef.getHalfCheckedKeys());
        // 将半选节点和已选三级节点数组合并转化为字符串
        var idStr = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
        // console.log(idStr);
        // 发送请求 数据传送后台
        var res = await this.axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
        // console.log(res);
        if(res.meta.status == 200) {
            this.setrightDialogVisible = false
            this.getRolses()
        } else {
           this.$message.error(res.data.msg); 
        }        
     }
  },

  created () {
      //渲染页面
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
