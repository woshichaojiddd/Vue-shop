<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-row>
        <tree-table :data="cateList" :columns="columns" show-index index-text="#" border :show-row-hover="false" :expand-type="false" :selection-type="false">
            <!-- 具名插槽 -->
            <template slot="isok" slot-scope="scope">
                <i v-if="scope.row.cat_deleted==false" class="el-icon-success" style="color:rgb(32, 178, 170)"></i>
                <i v-else-if="scope.row.cat_deleted==true" class="el-icon-error" style="color:red"></i>
            </template>
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                <el-tag v-if="scope.row.cat_level==1" type="success">二级</el-tag>
                <el-tag v-if="scope.row.cat_level==2" type="warning">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
    </tree-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30]"
      :current-page.sync="queryData.pagenum"
      :page-size="queryData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <!-- 添加分类表单 -->
        <el-form :model="addCateData" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateData.cat_name"></el-input>
            </el-form-item>
            <el-cascader
            v-model="cateList"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange">
            </el-cascader>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    return {
        // 商品分类请求数据参数
        queryData: {
            type: 3,
            pagenum: 1,
            pagesize: 10
        },
        //商品分类数据
        cateList: [],
        // 商品分类数据总条数
        total: 0,
        // 表格各列的配置
        columns: [{
            label: '分类名称',
            prop: 'cat_name'
        },{
            label: '是否有效',
            type: 'template',
            template: 'isok'
        },{
            label: '排序',
            type: 'template',
            template: 'order'
        },{
            label: '操作',
            type: 'template',
            template: 'opt',
            width: '190px'
        }],
        // 添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类数据参数
        addCateData: {
            cat_pid: '',
            cat_name: '',
            cat_level: ''
        },
        rules: '',
        // 添加分类选择框数据
        options:[{
            value:'cat_id',
            label:'cat_name',
            children:[{
                value:'cat_id',
                label:'cat_name',
            }]
        }]
    }
  },

  methods: {
      // 获取商品数据
      async getgoods() {
        const res = await this.axios.get('categories',{
          params:this.queryData})
        //   console.log(res);
          if(res.meta.status == 200) {
            this.cateList = res.data.result
            console.log(this.cateList); 
            this.total = res.data.total
          }
      },
      handleSizeChange(val) {
          this.queryData.pagesize = val
          this.getgoods()
      },
      handleCurrentChange(val) {
          this.queryData.pagenum = val
          this.getgoods()
      },
      // 显示添加分类对话框
      async showAddCateDialog() {
          this.addCateDialogVisible = true
          // 获取渲染数据 根据id查询分类
          
      },
      handleChange() {

      }

  },

  created () {
      this.getgoods()
  }
}
</script>

<style lang='less' scoped>
.zk-table {
    margin: 20px 0
}
</style>
