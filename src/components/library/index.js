//扩展vue原有的功能：全局组件 自定义指令 挂载原型方法 注意：没有全局过滤器
//这就是插件
//vue2.0插件写法要素：导出一个对象 有install函数 默认传入了vue构造函数 vue基础上扩展
//vue3.0插件写法要素：导出一个对象 有install函数 默认传入了app构造函数 app基础上扩展
/* import xtxSkeleton from './xtx-skeleton.vue'
import xtxCarousel from './xtx-carousel.vue'
import xtxMore from './xtx-more.vue' */
import defaultImg from '@/assets/images/200.jpg'
import message from './message'
/* import xtxBread from './xtx-bread.vue'
import xtxBreadItem from './xtx-bread-item.vue' */

//加载当前目录下所有的的.vue文件
const imporFn = require.context('./', false, /\.vue$/)

export default {
    install(app) {
        //在app上进行扩展 app提供 component directive 函数
        //如果要挂载原型 app.config.globalProperties 方式
        /* app.component(xtxSkeleton.name, xtxSkeleton)
        app.component(xtxCarousel.name, xtxCarousel)
        app.component(xtxMore.name, xtxMore)
        app.component(xtxBread.name, xtxBread)
        app.component(xtxBreadItem.name, xtxBreadItem) */

        //遍历批量注册
        imporFn.keys().forEach(item => {
            //导入组件
            const component = imporFn(item).default
            app.component(component.name, component)
        })
        defineDirective(app)

        app.config.globalProperties.$message = message
    }
}
//定义指令
const defineDirective = (app) => {
    //图片懒加载指令  v-lazy
    app.directive('lazy', {
        //DOM是否被创建好 el就是当前使用指令的DOM
        mounted(el, binding) {
            //创建一个观察这对象，来观察当前使用指令的元素是否进入可视区、
            //第一个参数回调函数 第二个参数配置选项
            const obServe = new IntersectionObserver(([{ isIntersecting }]) => {
                    if (isIntersecting) {
                        //停止观察使用指令DOM元素
                        obServe.unobserve(el)
                            //处理图片加载失败
                        el.onerror = () => {
                                el.src = defaultImg
                            }
                            //处理图片加载成功
                            /* el.onload = () => {
                                el.src = defaultImg
                            } */
                            //把指令的接受值保存起来并设置到图片的src属性上 binding.value 就是指令的值 
                        el.src = binding.value
                    }
                }, {})
                //观察使用指令DOM的元素
            obServe.observe(el)
        }
    })
}