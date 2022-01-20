import axios from 'axios'
//不是在组件里 直接导入store/index.js
import store from '@/store' //= 'http://pcapi-xiaotuxian-front-devtest.itheima.nef/"
import router from '@/router' //http://pcapi-xiaotuxian-front.itheima.net/
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
    baseURL,
    timeout: 5000
})

//请求拦截器  第一个 发送请求成功的时候触发  第二个 发送请求失败的时候触发
instance.interceptors.request.use((config) => {
    //拿到被vuex持久化插件保存的用户信息数据
    const userInfo = store.state.user.userInfo

    //判断用户的token是否存在
    if (userInfo.token) {
        //把token保存在浏览器请求头的Authorization里
        config.headers.Authorization = `Bearer ${userInfo.token}`
    }
    //必须把默认参数 config return出去
    return config
}, (err) => {
    //把错误信息return出去
    return Promise.reject(err)
})

//响应拦截器  第一个 访问成功做的事情  第二个 访问失败的时候做的事情
instance.interceptors.response.use((res) => {
    return res.data
}, (err) => {
    //401状态码 登入无效进入该函数
    if (err.response && err.response.status === 401) {
        //清空无线用户信息
        store.commit('user/setUser', {})

        //跳转到登入页 并且传入当前页面地址 给登入页码
        //组件里头 ’/user?a=10‘ 经过 $route.path 只能获取 /user 用 $route.fullPath获取完整地址 ’/user?a=10‘
        //js模块中 引入src/router router.currentRoute.fullPath 就是当前完整路由地址
        //router.currentRoute是Ref响应式数据 要router.currentRoute.value.fullPath
        //js原生方法 encodeURIComponent 进行对路劲转码
        const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
        router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
})

//导出请求工具函数 1.请求路劲 2.请求方式 3.提交的数据
export default (url, method, submitData) => {
    return instance({
        url,
        method,
        // 有时候method是Get GET 所以把他转成小写
        [method.toLowerCase() == 'get' ? 'params' : 'data']: submitData
    })
}