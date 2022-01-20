import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtxMessage')
document.body.appendChild(div)
export default (type, text) => {
    //渲染组件
    //1.导入消息提示组件
    //2.将消息提示组件编译为虚拟节点
    //createVNode(组件,属性对象)
    const vnode = createVNode(XtxMessage, { type, text })
    let tiems = null
        //3.准备一个装载消息提示组件的容器
        //4.将虚拟接待你在渲染早容器中
        //render(虚拟DOM节点,虚拟节点渲染的容器)
    render(vnode, div)
    clearTimeout(tiems)
    tiems = setTimeout(() => {
        render(null, div)
    }, 1500)
}