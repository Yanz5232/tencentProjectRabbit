//提供常用的函数
import { useIntersectionObserver } from "@vueuse/core"
import { ref } from "vue"
/* 数据懒加载函数 */
export const useLazyData = (target, apiFn) => {
    const data = ref([])

    //stop停止观察
    const { stop } = useIntersectionObserver(
        //监听的目标元素
        target,
        //是否进入可视区 true 和 false
        ([{ isIntersecting }],
            //我观察的元素
            observerElement) => {
            if (isIntersecting) {
                stop()
                    //调用api函数获取数据
                apiFn().then(res => {
                    data.value = res.result
                })
            }
        },
        //配置选项
        { //相交的比例大于0 就当已经在可视区 直接加载
            threshold: 0
        }
    )
    return data
}