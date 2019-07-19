import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/iview.js'
import './assets/css/global.css'
// 导入阿里图标
import './assets/fonts/iconfont.css'

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




Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')