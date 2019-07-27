<template>
  <el-card>
    <div id="main" style="width: 800px;height:400px;"></div>
  </el-card> 
</template>

<script>
// 引入图标插件echarts
import echarts from 'echarts'
export default {

  data () {
    return {
    }
  },

  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const res = await this.axios.get('reports/type/1')
        // console.log(res);
        

        // 指定图表的配置项和数据
        var option = {
                // 将后台请求的数据与基础参数数据合并
                ...res.data,
                title: {
                    text: '用户来源'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
            };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
  },

  mounted() {
    this.initEcharts()
  },

  created () {
  }
}
</script>

<style lang='less' scoped>

</style>
