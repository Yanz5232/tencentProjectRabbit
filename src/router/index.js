import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/views/layout.vue'
import home from '@/views/home/index.vue'
import categoryIndex from '@/views/category/index.vue'
import categorySub from '@/views/category/sub.vue'
import goods from '@/views/goods/goods.vue'
import login from '@/views/login/index.vue'
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
        }]
    },
    { path: '/login', component: login }
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

export default router