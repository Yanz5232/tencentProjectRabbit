import { createStore } from 'vuex'
/* 导入vuex持久化插件 */
import vuexPersistedstate from 'vuex-persistedstate'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

//createStore创建仓库
export default createStore({
    //模块
    modules: {
        user,
        cart,
        category
    },
    plugins: [
        //配置vue持久化插件 默认存储在localStorage
        vuexPersistedstate({
            //本地存储的名字
            key: 'erabbit-client-pc-124-store',
            //需要缓存的模块
            paths: ['user', 'cart']
        })
    ]
})

/* export default createStore({
    //存数据
    state: {
        user: 'yyy'
    },
    //计算属性
    getters: {
        newUser(state) {
            return state.user + 'www'
        }
    },
    //修改方法
    mutations: {
        updateUser(state) {
            state.user = 'zzz'
        }
    },
    //异步请求区
    actions: {
        updateUser(ctx) {
            setTimeout(() => {
                ctx.commit('updateUser')
            }, 1000)
        }
    },
    //模块
    modules: {}
}) */