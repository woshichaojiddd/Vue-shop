import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/iview.js'
import './assets/css/global.css'
// 导入阿里图标
import './assets/fonts/iconfont.css'

// 导入树状表格组件件
import treeTable from 'vue-table-with-tree-grid'

// 导入富文本插件且使用
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 设置树状结构组件
Vue.component("tree-table", treeTable)

// 导入axios
import axios from 'axios'

// 设置接口基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use((config) => {
    // console.log(config);
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})

// 相应拦截器 优化返回数据
axios.interceptors.response.use((res) => {
    return res.data
})

// 在vue原型上挂载axios方法 这样vue的每个组件都可以调用axios方法
Vue.prototype.axios = axios

// 定义日期格式转化的过滤器
Vue.filter('format', function(time) {
    const date = new Date(time)
        // padStart()字符串的方法  填充作用
    const y = (date.getFullYear() + '').padStart(2, 0)
    const m = (date.getMonth() + 1 + '').padStart(2, 0)
    const d = (date.getDate() + 1 + '').padStart(2, 0)
    const h = (date.getHours() + 1 + '').padStart(2, 0)
    const mm = (date.getMinutes() + 1 + '').padStart(2, 0)
    const s = (date.getSeconds() + 1 + '').padStart(2, 0)
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
})




Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')