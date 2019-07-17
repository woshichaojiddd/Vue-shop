import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'



Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: Login
    }, {
        path: '/home',
        component: Home
    }]
})

// 挂载路由导航守卫
// 访问的是登录页面 可以直接进去  访问的不是登录页面 则登录可进 未登录不可进 跳转到登录页
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const token = sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router