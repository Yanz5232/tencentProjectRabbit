import confirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtxConfirm')
document.body.appendChild(div)

export default (text, title) => {
    return new Promise((resolve, reject) => {
        const cancelCallback = () => {
            render(null, div)
            reject(new Error('点击取消'))
        }
        const submitCallback = () => {
            render(null, div)
            resolve()
        }
        const vn = createVNode(confirm, { title, text, cancelCallback, submitCallback })
        render(vn, div)
    })
}