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
        <el-tabs v-model="activeIndex" @tab-click="tabsHandleClick" tab-position="left" :before-leave="tabBeforeLeave">
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
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item1,i) in item.attr_vals" :key='i' :label="item1" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本框 -->
            <quill-editor v-model="addGoodsForm.goods_introduce">
            </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods" style="margin-top:15px">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="预览" :visible.sync="imgPreviewDialogVisible" width="50%">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
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
        attrs: [],
        pics: [],
        goods_introduce: '',
        goods_cat: ''
      },
      // 级联选择器的选择数据
      cascaderArr: [1,3,6],
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
      },
      // 商品参数
      manyList: [],
      // 静态属性
      onlyList: [],
      // 上传图片参数
      fileList: [],
      // 设置图片上传请求头
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 图片预览对话框的显示与隐藏
      imgPreviewDialogVisible: false,
      // 预览图片路径
      imgUrl: ''
    }
  },

  methods: {
    // 获取下拉框商品分类数据
    async getCateList () {
      const res = await this.axios.get('categories')
      // console.log(res);
      this.cateList = res.data
    },
    //下拉框值变化监听
    handleChange(cascaderArr) {
        // console.log(cascaderArr);
        // 只允许选三级子节点
        if(this.cascaderArr.length !== 3) {
          return this.cascaderArr = []
        }
    },
    // 切换标签栏的钩子 n表示跳转后的标签 o表示跳转前的标签
    tabBeforeLeave(n,o) {
      // 从第一个标签跳转且三级选项为空
      if(o == 0 && this.cascaderArr.length == 0){
        this.$message.error('请选择三级分类')
        return false
      }  
    },
    // 监听切换标签栏
    async tabsHandleClick() {
      // 当选择第二栏(索引为1)时.获取商品参数数据
      if(this.activeIndex == '1') {
        const res = await this.axios.get(`categories/${this.cascaderArr[2]}/attributes`,{
          params: {
            sel: 'many'
          }
        })
        // 将attr_vals转化为数组 若无数据则为空
        res.data.forEach(item=> {
          item.attr_vals = item.attr_vals?item.attr_vals.split(','):[]
        })      
        if(res.meta.status == 200) {
          this.manyList = res.data
          // console.log(this.manyList);
        }
        }
        // 当选择第三栏(索引为2)时.获取商品属性数据
        if(this.activeIndex == '2') {
          const res = await this.axios.get(`categories/${this.cascaderArr[2]}/attributes`,{
          params: {
            sel: 'only'
          }
        })     
        if(res.meta.status == 200) {
          this.onlyList = res.data
          // console.log(this.onlyList);         
        }      
      }
    },

    // 上传图片 点击删除时的事件监听
    handleRemove(file) {
        // console.log(file);
        // 获取删除图片的暂存路径
        const picPath = file.response.data.tmp_path
        // 对比pics中的值 当路径一致时获取索引 然后删除对应项
        const index = this.addGoodsForm.pics.findIndex(item=>{
          return item.pic == picPath
        })
        // console.log(index);
        this.addGoodsForm.pics.splice(index,1)
        // console.log(this.addGoodsForm.pics);
        
        
    },
    // 点击图片名称时触发的函数(预览)
    handlePreview(file) {
        // console.log(file);
        this.imgPreviewDialogVisible = true
        this.imgUrl = file.response.data.url
    },
    // 上传成功会触发的钩子函数
    handleSuccess(res) {
      // console.log(res);
      if(res.meta.status == 200) {
        this.$message.success('上传图片成功')
        this.addGoodsForm.pics.push({
          pic: res.data.tmp_path
        }) 
        console.log(this.addGoodsForm.pics);
        
      }
    },
    // 添加商品按钮绑定事件(获取参数)
    addGoods() {      
      this.addGoodsForm.goods_cat = this.cascaderArr.join(',')
      this.manyList.forEach(item=> {
        this.addGoodsForm.attrs.push({
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(',')
          })
      })
      this.onlyList.forEach(item=> {
        this.addGoodsForm.attrs.push({
          attr_id:item.attr_id,
          attr_value:item.attr_vals
          })
      })
      console.log(this.addGoodsForm);
      // 提交请求前校验数据
      // 发送添加商品请求
      this.$refs.addGoodsForm.validate(async flag=> {
        if(!flag) return this.$message.error('请填写必要的表单')
        const res = await this.axios.post('goods',this.addGoodsForm)
        console.log(res);
        if(res.meta.status == 201) {
          this.$message.success('创建商品成功')
          this.$router.push('/goods')
        } else {
          this.$message.error(res.meta.msg)
        }
      })  
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
.el-checkbox {
  margin:0 5px;
}
</style>
