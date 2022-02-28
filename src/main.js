import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入自己组件库
import ui from './components/library'
//重置样式库
import 'normalize.css'
//mockjs
import '@/mock/index.js'

//引入自己的公共样式
import './assets/css/myPublic.less'
createApp(App).use(store).use(router).use(ui).mount('#app')