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
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
        <!-- 添加分类表单 -->
        <el-form :model="addCateData" :rules="rules" ref="addCateRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateData.cat_name"></el-input>
            </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options用来指定数据源  props用来指定配置对象 -->
                    <!-- v-model选中之后对应每一项的绑定值 是个数组-->
                <el-cascader v-model="selectOptionArr" :options="parentCate" :props="cascaderProps" @change="handleChange" clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
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
            cat_pid: 0,
            cat_name: '',
            cat_level: 0
        },
        // 添加分类表单验证
        rules: {
            cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]},
        // 添加分类选择框数据
        parentCate:[],
        // 添加分类选择框配置对象
        cascaderProps:{
            expandTrigger: 'hover',
            label: 'cat_name',
            value: 'cat_id',
            checkStrictly: true
        },
        // 添加分类选择框选中的数据对应value值
        selectOptionArr: []
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
            // console.log(this.cateList); 
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
          // 获取渲染数据 只需获取到二级 
          const res = await this.axios.get('categories',{params:{type:2}})
          this.parentCate = res.data
        //   console.log(this.parentCate);          
      },
      // 添加分类选择框数据发生变化
      handleChange() {
        //   console.log(this.selectOptionArr);
          if(this.selectOptionArr.length > 0) {
          // 获得新增分类父id  为this.selectOptionArr的最后一项
          this.addCateData.cat_pid = this.selectOptionArr[this.selectOptionArr.length - 1]
          // 获取新增分类等级
          this.addCateData.cat_level = this.selectOptionArr.length
          } else {
              this.addCateData.cat_pid = 0
              this.addCateData.cat_level = 0
          }         
      },
      // 监听表单关闭事件
      addCateDialogClose() {
          this.$refs.addCateRef.resetFields()
          this.selectOptionArr = []
          this.addCateData.cat_pid = 0
          this.addCateData.cat_level = 0
      },
      // 提交添加的分类数据 重置表单数据
      addCate() {
        //   console.log(this.addCateData)
          this.$refs.addCateRef.validate(async (flag) => {
          if (!flag) return 
          const res = await this.axios.post('categories',this.addCateData)
        //   console.log(res);
          if(res.meta.status == 201) {
              this.$message.success('添加分类成功!')
              this.addCateDialogVisible = false
              this.getgoods()
          } else {
             this.$message.error(res.meta.msg) 
          }        
      })
      }         

  },

  created () {
      this.getgoods()
  }
}
</script>

<style lang='less' scoped>
.zk-table {
    margin: 20px 0;
}
.el-cascader {
    width: 347px;
}


</style>
