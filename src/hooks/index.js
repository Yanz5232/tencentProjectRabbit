//提供常用的函数
import { useIntersectionObserver } from "@vueuse/core"
import { ref, onUnmounted } from "vue"
import dayjs from "dayjs"
import { useIntervalFn } from '@vueuse/core'
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

export const usePayTime = () => {
    /* 倒计时 */
    const time = ref(0)
    const timeText = ref('')
    const { pause, resume } = useIntervalFn(() => {
        time.value--
            timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        if (time.value <= 0) pause()
    }, 1000, false)
    onUnmounted(() => {
        pause()
    })

    /* 开启定时器 */
    const start = (countdown) => {
        time.value = countdown
        timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        resume()
    }
    return {
        start,
        timeText
    }
}