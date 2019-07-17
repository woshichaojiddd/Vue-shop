import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message
} from 'element-ui'

Vue.prototype.$message = Message

// 组件标签要让全局使用 直接用Vue.use()
// js方法要让全局使用 必须关在到Vue.prototype上
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)