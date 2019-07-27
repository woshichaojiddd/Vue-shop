<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
        </el-alert>
        <!-- 选择商品分类 -->
        <div style="margin:15px 0">
            <span style="font-size:16px;margin-right:10px">选择商品分类:</span>
            <el-cascader v-model="cascaderId" :options="cascaderList" :props="cascaderProps" @change="cascaderHandleChange" style="width:250px">
            </el-cascader>
        </div>
        <!-- 表格标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 动态参数 -->
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addParams'>添加参数</el-button>
                <!-- 参数表格 -->
                <el-table :data="manyTableList" border style="width: 100%">
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key='i' @close="handleClose(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <el-input
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="参数名称" >
                    </el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="props">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click='editParams(props.row)'>修改</el-button>
                            <!-- 删除消息提示框 -->
                            <el-button type="text" @click="open(props.row)">
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-button>                           
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 静态属性 -->
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addParams'>添加属性</el-button>
                <!-- 参数表格 -->
                <el-table :data="onlyTableList" border style="width: 100%" stripe>
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key='i' @close="handleClose(i,scope.row)">
                                {{item}}
                            </el-tag>
                            <el-input
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" >
                    </el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="props">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click='editParams(props.row)'>修改</el-button>
                            <!-- 删除参数提示框 -->
                            <el-button type="text" @click="open(props.row)">
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加参数与属性对话框 -->
    <el-dialog :title="activeName=='only'?'添加静态属性':'添加动态参数'" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsDialogClose">
    <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsForm" label-width="100px">
        <el-form-item :label="activeName=='only'?'静态属性':'动态参数'" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsBtn">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="activeName=='only'?'修改静态属性':'修改动态参数'" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsDialogClose">
    <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsForm" label-width="100px">
        <el-form-item :label="activeName=='only'?'静态属性':'动态参数'" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsBtn">确 定</el-button>
    </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {

  data () {
    return {
        // 选择分类框数据
        cascaderList: [],
        // 设置参数
        cascaderProps:{
            expandTrigger: 'hover',
            label: 'cat_name',
            value: 'cat_id',
        },
        // 选择节点对应的value值
        cascaderId: [],
        // 表格标签选中表格
        activeName: 'many',
        // 表格绑定动静态数据
        manyTableList: [],
        onlyTableList: [],
        // 添加属性与参数对话框的显示与隐藏
        addParamsDialogVisible: false,
        // 添加属性与动态表单数据
        addParamsForm: {
            attr_name: ''
        },
        // 添加属性与动态表单验证
        addParamsRules: {
            attr_name: [
                { required: true, message: '请输入名称', trigger: 'blur' }
            ]
        },

        // 修改参数对话框的显示与隐藏
        editParamsDialogVisible: false,
        // 修改动静态参数表单数据
        editParamsForm: {
            attr_name: '',
            // 属性id
            attrId: ''
        },
        // 修改对话框验证
        editParamsRules: {
            attr_name: [
                { required: true, message: '请输入名称', trigger: 'blur' }
            ]
        },
        
    }
  },

  methods: {
      // 获取选择分类数据
      async getCate() {
          const res = await this.axios.get('categories')
        //   console.log(res);
          this.cascaderList = res.data
          
      },
      // 发送请求获取参数列表数据
      // 为了让每一行的添加标签键有单独功能 需要给每一行单独添加inputVisible和inputValue值
    async getParamsList() {
        const res = await this.axios.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        //   console.log(res);
          if(res.meta.status == 200) {
               // 将获取数据中的attr_val中的字符串转化为数组
                  res.data.forEach(item=> {
                      item.attr_vals=item.attr_vals?item.attr_vals.split(','):[]
                      item.inputVisible = false
                      item.inputValue = ''
                  })
              if(this.activeName == 'many'){                 
                this.manyTableList = res.data
              } else {
                 this.onlyTableList = res.data 
              }
          } else {
              this.$message.error(res.meta.msg)
          }
    },
      // 商品分类监听事件
      cascaderHandleChange () {
        // console.log(this.cascaderId);
        // 只允许选择三级分类
        if(this.cascaderId.length !==3) {
            this.cascaderId = []
            this.onlyTableList = []
            this.manyTableList = []
            return  
        }
        this.getParamsList()
          
      },
      // 表格标签切换事件
      async handleClick() {
        // console.log(this.activeName);
        // console.log(this.cateId);
        // 发送请求获取参数列表数据
        if(this.cateId == null) return
        this.getParamsList()          
      },
      // 添加属性与参数显示框
      addParams() {
          this.addParamsDialogVisible = true
      },
      // 关闭添加属性对话框清除数据
      addParamsDialogClose() {
          this.$refs.addParamsForm.resetFields()
      },
      // 添加属性与参数提交数据发送请求
      addParamsBtn() {
          this.$refs.addParamsForm.validate(async (flag) => {
              if(!flag) return
            //   console.log(this.cascaderId[2]);
            //   console.log(this.addParamsForm.attr_name);
            //   console.log(this.activeName);
            const res = await this.axios.post(`categories/${this.cateId}/attributes`,{
                attr_name: this.addParamsForm.attr_name,
                attr_sel: this.activeName,
            })
            // console.log(res);
            if(res.meta.status == 201) {
                this.$message.success('添加参数成功')
                this.addParamsDialogVisible = false
                // 刷新表格
                this.getParamsList()
            } else {
                this.$message.error(res.meta.msg)
            }           
          })         
      },

      // 修改属性与参数显示框
      editParams(row) {
          this.editParamsDialogVisible = true
        //   console.log(row);
          this.editParamsForm.attr_name = row.attr_name
          this.editParamsForm.attrId = row.attr_id
      },
      // 关闭修改属性对话框清除数据
      editParamsDialogClose() {
          this.$refs.editParamsForm.resetFields()
      },
      // 添加属性与参数提交数据发送请求
      editParamsBtn() {
        this.$refs.editParamsForm.validate(async flag=> {
            if(!flag) return
            const res = await this.axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attrId}`,{
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
            })
            // console.log(res);
            if(res.meta.status == 200) {
            this.$message.success('修改参数成功')
            this.editParamsDialogVisible = false 
            // 刷新表格
            this.getParamsList()
            } else {
                 this.$message.error(res.meta.msg) 
             }             
          })
      },

      // 显示删除参数
      open(row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            // 发送删除参数请求
            const res = await this.axios.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
            // console.log(res);
            if(res.meta.status == 200) {
                this.$message.success('删除成功!');
                // 刷新表格
                this.getParamsList()
            }else {
               this.$message.error(res.meta.msg); 
            }
            
        }).catch(() => {
          this.$message.info('已取消删除');          
        });
      },

      // 按下添加标签按钮时输入框显示
      showInput(row) {
         row.inputVisible = true 
         // 自动获取焦点 $nextTick方法作用:就是当页面上元素被重新渲染之后 才会执行回调函数中的代码
         this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      // 标签变化时向后台发送请求
      async editParamsAttr(row) {
          const res = await this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
              attr_name: row.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(',')
          })
          console.log(res);
          if(res.meta.status == 200) {
              this.$message.success('更新成功')
              row.inputValue = ''
              row.inputVisible = false
          }else {
              this.$message.error(res.meta.msg)             
          }
      },
      // 按下enter键或者失去标签时绑定的函数
      handleInputConfirm(row) {
          console.log(row.inputValue);
          if(row.inputValue.trim().length == 0) {
              row.inputValue = ''
              row.inputVisible = false
              return
          }
          row.attr_vals.push(row.inputValue)
          // 输入框不为空时提交添加数据
          this.editParamsAttr(row)
      },
      // 删除标签
      handleClose(index,row) {         
           row.attr_vals.splice(index,1)
           this.editParamsAttr(row)
      }
  },

  computed: {
      // 设置按钮的显示与禁用
      isBtnDisabled() {
          if(this.cascaderId.length == 3) return false
          return true
      },
      // 获取三级id
      cateId() {
          if(this.cascaderId.length == 3) return this.cascaderId[2]
          return null
      }
  },
  created () {
      this.getCate()
  }
}
</script>

<style lang='less' scoped>
.el-table {
    margin-top: 15px
}
.el-tag {
    margin-right: 10px;
}
.el-input {
    width: 120px;
}
</style>
