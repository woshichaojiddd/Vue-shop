<template>
  <div class="main_container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 绑定query实现搜索关键字功能 clearable清空 -->
          <el-input clearable @clear="getUsers" v-model="usersData.query" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <!-- 作用域插槽 item.row 为每一项的数据 -->
          <template slot-scope="item">
            <el-switch v-model="item.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="editSwitch(item.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="180" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="item">
            <!-- 修改用户信息 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDiolg(item.row.id)"></el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(item.row.id)"></el-button>
            <!-- 分配用户角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDistriDiolg(item.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersData.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="usersData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"  @close="calncelBtn">
      <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editCancel">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog title="分配用户角色" :visible.sync="distriDialogVisible" width="50%">
      <p>当前的用户: {{distriData.username}}</p>
      <p>当前的角色: {{distriData.role_name}}</p>
      <p>分配新角色: 
        <el-select v-model="distriData.rid" slot="prepend" placeholder="请选择">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distriDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    

  </div>
</template>

<script>
import { callbackify } from 'util';
export default {
  data() {
    // 验证邮箱功能
    var checkEmail = (rule, value, callback) => {
      const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(reg.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确格式的邮箱'))
    }
    // 校验手机号
    var checkMobile = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if(reg.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确格式的手机号'))
    } 
    return {
      // 用户信息请求参数
      usersData: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      totalPage: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      distriDialogVisible: false,
      // 添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
          ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户信息页表单数据
      editForm: {
        mobile: '',
        email: ''
      },
      // 分配用户角色的数据
      distriData: {
        username: '',
        role_name: '',
        rid: ''
      }
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
        console.log(this.userList);
      this.totalPage = res.data.total;
    },
    // switch修改状态
    async editSwitch(item) {
      // console.log(item);
      var res = await this.axios.put(`users/${item.id}/state/${item.mg_state}`);
      // console.log(res);
    },
    // 分页设置
    // 修改每页多少条后重新渲染页面
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.usersData.pagesize = val;
      this.getUsers();
    },
    // 当前页变化时重新渲染页面
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.usersData.pagenum = val;
      this.getUsers();
    },
    // 添加用户页面取消按钮功能 (在提示框绑定close回调函数)
    calncelBtn() {
      this.$refs.ruleForm.resetFields();
    },
    // 添加用户页面确定按钮功能 (提交与设置页面隐藏 提交前要验证)
    submitBtn() {
      this.$refs.ruleForm.validate(async (valid) => {
        if(!valid) return
        const res = await this.axios.post('users',this.addForm)
        // console.log(res);
        if(res.meta.status == 201) {
          this.$message.success('创建成功')
          this.addDialogVisible = false
          this.getUsers()
        } else  {
          this.$message.error(res.meta.msg)
        }        
      })
    },
    // 修改用户信息 发送请求渲染修改页面
    async showEditDiolg(id) {
      const res = await this.axios.get('users/'+id)
      if(res.meta.status == 200) {
        this.editDialogVisible = true
        // console.log(res);  
        this.editForm.username = res.data.username
        this.editForm.email = res.data.email
        this.editForm.mobile = res.data.mobile
        this.editForm.id = res.data.id
      }
    },
    // 取消重置功能
    editCancel() {
      this.$refs.editForm.resetFields();
    },
    // 修改用户信息  提交
    editBtn() {
      this.$refs.editForm.validate(async (flag) => {
        if(!flag) return
        const res = await this.axios.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile} )
        // console.log(res);
        if(res.meta.status == 200) {
          this.$message.success('更新成功')
          this.editDialogVisible = false
          this.getUsers()
        } else {
          this.$message.error(res.meta.msg)
        }       
      })
    },
    // 删除用户
    open(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送请求删除数据
        var res = await this.axios.delete('users/'+ id)
        // console.log(res);
        if(res.meta.status == 200) {
          this.$message.success('删除成功!')
          this.getUsers()
        } else {
          this.$message.error(res.meta.msg)
        }  
      }).catch(() => {
        this.$message.success('已取消删除');          
      });
    },
    // 分配用户角色
    showDistriDiolg(data) {
      this.distriDialogVisible = true
      console.log(data);
      this.distriData.username = data.username
      this.distriData.role_name = data.role_name
      // 请求下拉框角色信息

      
    },
  },

  created() {
    this.getUsers();
  }
};
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 10px;
}

.el-pagination {
  margin-top: 20px;
}
p {
  margin: 10px 0;
}
</style>
