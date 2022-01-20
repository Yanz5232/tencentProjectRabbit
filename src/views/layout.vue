<template>
  <div >
    <!-- 顶部通栏 -->
      <navbar></navbar>
    <!-- 头部组件 -->
    <appHeader></appHeader>
    <!-- 虚拟头部组件 -->
    <appHeaderSticky></appHeaderSticky>
    <!-- 内容容器 -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 底部组件 -->
    <appHeaderFooter></appHeaderFooter>
  </div>
</template>

<script>
import home from'@/views/home/index.vue'
import navbar from'../components/navbar.vue'
import appHeader from'../components/header.vue'
import appHeaderSticky from'../components/header-sticky.vue'
import appHeaderFooter from'@/components/headerFooter.vue'
import { useStore } from 'vuex';
export default {
  name: "Layout",
  setup() {
    const store=useStore()
    store.dispatch('category/getList')
  },
  components:{
    home,
    navbar,
    appHeader,
    appHeaderSticky,
    appHeaderFooter
   
  }
};
</script>

<style lang="less" scoped>

</style>