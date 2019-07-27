<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert :closable="false" title="添加商品信息" type="info" center show-icon>
      </el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" align-center :space="200">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps> 
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsForm" label-width="100px" class="demo-ruleForm" label-position="top"> 
        <!-- before-leave 切换标签之前的钩子 -->
        <el-tabs v-model="activeIndex" @tab-click="handleClick" tab-position="left" :before-leave="tabBeforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader v-model="cascaderArr" :options="cateList" :props="props" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
      activeIndex: 0,
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: ''
      },
      // 级联选择器的选择数据
      cascaderArr: [],
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品种类', trigger: 'blur' }
        ]
      },
      // 下拉框商品分类数据
      cateList: [],
      // 下拉框参数设置
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'

      }
    }
  },

  methods: {
    // 获取下拉框商品分类数据
    async getCateList () {
      const res = await this.axios.get('categories')
      console.log(res);
      this.cateList = res.data
    },
    //下拉框值变化监听
    handleChange(cascaderArr) {
        console.log(cascaderArr);
        // 只允许选三级子节点
        if(this.cascaderArr.length !== 3) {
          return this.cascaderArr = []
        }
    },
    handleClick() {

    },
    // 切换标签栏的钩子 n表示跳转后的标签 o表示跳转前的标签
    tabBeforeLeave(n,o) {
      // 从第一个标签跳转且三级选项为空
      if(o == 0 && this.cascaderArr.length == 0){
        this.$message.error('请选择三级分类')
        return false
      }  
    }
  },

  created () {
    this.getCateList ()
  }
}

</script>

<style lang='less' scoped>
.el-steps {
  margin: 15px 0;
}
</style>
