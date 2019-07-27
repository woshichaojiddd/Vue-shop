import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/users/Users.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/rights/Roles.vue'
import Categories from './components/goods/Categories.vue'
import Params from './components/goods/Params.vue'
import Goods from './components/goods/Goods.vue'
import GoodsAdd from './components/goods/GoodsAdd.vue'




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
        redirect: './welcome'
    }, {
        path: '/home',
        component: Home,
        children: [{
            path: '/welcome',
            component: Welcome
        }, {
            path: '/users',
            component: Users
        }, {
            path: '/rights',
            component: Rights
        }, {
            path: '/roles',
            component: Roles
        }, {
            path: '/categories',
            component: Categories
        }, {
            path: '/params',
            component: Params
        }, {
            path: '/goods',
            component: Goods
        }, {
            path: '/goods/add',
            component: GoodsAdd
        }]
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