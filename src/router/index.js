import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index.js'
import layout from '@/views/layout.vue'
import home from '@/views/home/index.vue'
import categoryIndex from '@/views/category/index.vue'
import categorySub from '@/views/category/sub.vue'
import goods from '@/views/goods/goods.vue'
import login from '@/views/login/index.vue'
import loginCallback from '@/views/login/callback.vue'
import cart from '@/views/cart/index.vue'
import checkout from '@/views/member/pay/checkout.vue'
import Pay from '@/views/member/pay/index.vue'
import payResult from '@/views/member/pay/result.vue'
import memberLayout from '@/views/member/layout.vue'
import memberHome from '@/views/member/home/index.vue'
import memberOrder from '@/views/member/order/index.vue'
import memberOrderDetail from '@/views/member/order/detail.vue'
import { h } from 'vue'
import { RouterView } from 'vue-router'
const routes = [
    /* 一级路由布局容器 */
    {
        path: '/',
        component: layout,
        /* 二级路由布局容器 */
        children: [{
            path: '',
            component: home
        }, {
            path: 'category/:id',
            component: categoryIndex
        }, {
            path: 'category/sub/:id',
            component: categorySub
        }, {
            path: 'product/:id',
            component: goods
        }, {
            path: '/member/checkout',
            component: checkout
        }, {
            path: '/pay/callback',
            component: payResult
        }, {
            path: '/member',
            component: memberLayout,
            children: [

                { path: '/member', component: memberHome },

                {
                    path: '/member/order',
                    component: { render: () => h(RouterView) },
                    children: [
                        { path: '', component: memberOrder },
                        { path: ':id', component: memberOrderDetail }
                    ]
                }
            ]
        }]
    },
    { path: '/login', component: login },
    { path: '/login/callback', component: loginCallback },
    { path: '/cart', component: cart },
    { path: '/member/pay', component: Pay },

]

//createRouter({})创建路由实例
const router = createRouter({
    //使用hash的路由模式
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        /* vue2是 x y  */
        /* vue3是 left top  */
        return { left: 0, top: 0 }
    }
})
router.beforeEach((to, from, next) => {
    //需要登入的路由 地址都是以/member开头
    const { userInfo } = store.state.user
        /* profile里有token 和 路由地址是以member开头 */
    if (!userInfo.token && to.path.startsWith('/member')) {
        next('/login?redirectUrl=' + to.fullPath)
    }
    next()
})
export default router