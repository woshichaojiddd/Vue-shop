<template>
  <div class="main_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
        <el-table :data="userList" border stripe style="width: 100%" >
          <el-table-column type="index" label="#" align="center">
            </el-table-column>
            <el-table-column prop="username" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" align="center">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" align="center">
            </el-table-column>
            <el-table-column prop="role_name" label="角色" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
            <!-- 作用域插槽 item.row 为每一项的数据 -->
                <template slot-scope="item">                
                    <el-switch v-model="item.row.mg_state"  active-color="#13ce66" inactive-color="#ff4949"  @change="editSwitch(item.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" align="center">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
            </el-table-column>
        </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="usersData.pagenum"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="usersData.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
            </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersData: {
        query: "",
        pagenum:  1,
        pagesize:  2
      },
      userList: [],
      totalPage: 0
    };
  },

  methods: {
    async getUsers() {
      const res = await this.axios.get("users", {
        params: this.usersData
      });
    //   console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取数据失败,请检查代码");
      this.userList = res.data.users;
    //   console.log(this.userList);  
      this.totalPage = res.data.total;
    },
    // switch修改状态
    async editSwitch(item) {
        // console.log(item);
        var res = await this.axios.put(`users/${item.id}/state/${item.mg_state}`)
        // console.log(res);
        
        
    },
    // 分页设置
    // 修改每页多少条后重新渲染页面
    handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.usersData.pagesize = val
        this.getUsers();

      },
    // 当前页变化时重新渲染页面
    handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.usersData.pagenum = val
        this.getUsers();
      }
  },

  created() {
    this.getUsers();
  }
};
</script>

<style lang='less' scoped>
.el-table {
    margin-top: 10px

}

.el-pagination {
    margin-top: 20px
}
</style>
