<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input clearable @clear="getOrderList" placeholder="请输入内容" v-model="queryData.query" class="input-with-select" style="width:30%">
        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
      </el-input>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==0" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.order_pay==1" type="primary">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="发货时间">
          <template slot-scope="scope">
            {{scope.row.create_time | format}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editAddress"></el-button>
            <el-button type="danger" icon="el-icon-location-outline" circle size="mini" @click="showProcessDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 修改选择地址对话框 -->
    <el-dialog title="编辑地址" :visible.sync="editAdressDialogVisible" width="50%">
      <div>
        <el-cascader v-model="cascaderArr" :options="cityData" :props="props" @change="handleChange"></el-cascader>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="processDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in processList"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 引入城市数据
import cityData from './citydata.js'
export default {

  data () {
    return {
      // 获取订单列表数据参数
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      // 编辑地址对话框显示与隐藏
      editAdressDialogVisible: false,
      // 级联选择器参数
      props: {
        expandTrigger: 'hover',
        value: 'value',
        label:'label'
      },
      // 城市数据
      cityData,
      // 联级选择器绑定数据
      cascaderArr: [],
      processDialogVisible: false,
      // 物流信息数据
      processList: [],

    }
  },

  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const res = await this.axios.get('orders',{params: this.queryData})
      // console.log(res);
      if(res.meta.status == 200) {
        this.orderList = res.data.goods
        this.total = res.data.total
        // console.log(this.orderList);        
      }  
    },
    // 分页设置
    handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryData.pagesize = val
        this.getOrderList()
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryData.pagenum = val
        this.getOrderList()
      },
      // 编辑地址
      editAddress() {
        this.editAdressDialogVisible = true
      },
      // 联机选择器监听事件
      handleChange() {
        // console.log(this.cascaderArr);
        
      },
      // 显示物流进度对话框
      async showProcessDialog(row) {
        this.processDialogVisible = true
        // console.log(row);
        const res = await this.axios.get('/kuaidi/1106975712662')
        // console.log(res);
        if(res.meta.status == 200) {
          this.processList = res.data
          // console.log(this.processList);          
        }
        

      }
  },

  created () {
    this.getOrderList()
  }
}
</script>

<style lang='less' scoped>
.el-table {
  margin: 15px 0;
}
</style>
