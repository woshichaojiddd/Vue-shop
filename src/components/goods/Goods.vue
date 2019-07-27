<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="7">
                <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="queryData.query" class="input-with-select">
                    <!-- 搜索关键字功能  -->
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="5">
                <!-- 添加商品 -->
                <el-button type="primary" @click="goodsAdd">添加商品</el-button>
            </el-col>
        </el-row>
        <el-table :data="goodsList" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>  
            <el-table-column prop="goods_name" label="商品名称" width="500" >
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
            </el-table-column>
            <el-table-column label="创建时间" width="150">
                <template slot-scope="scope">
                    {{scope.row.upd_time | format}}
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="140">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <!-- 删除商品功能 -->
                    <el-button type="text" @click="removeGoods(scope.row)">
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </el-button>
                    
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
        
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
        queryData: {
            query: '',
            pagenum: 1,
            pagesize: 10
        },
        goodsList: [],
        total: 0
    }
  },

  methods: {
      // 获取列表数据
      async getGoodsList() {
          const res= await this.axios.get('goods',{
              params: this.queryData
          })
          console.log(res);
          if(res.meta.status == 200) {
            this.goodsList = res.data.goods
            this.total = res.data.total
          }else {
              this.$message.error(res.data.msg)
          }         
      },
      // 分页设置
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryData.pagesize = val
        this.getGoodsList()
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryData.pagenum = val
        this.getGoodsList()
      },
      // 删除商品
      removeGoods(row) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.axios.delete(`goods/${row.goods_id}`)
        //   console.log(res);
          if(res.meta.status == 200) {
              this.$message.success('删除成功!');
              this.getGoodsList()
          } else {
              this.$message.error(res.meta.msg)
          } 
        }).catch(() => {
          this.$message.info('已取消删除');          
        });
      },
      // 跳转到添加商品页
    goodsAdd() {
        this.$router.push('/goods/add')
    }

  },

  created () {
      this.getGoodsList()
  }
}
</script>

<style lang='less' scoped>
.el-table {
    margin: 15px 0;
}
.el-table .cell {
    font-size:12px
}
</style>
