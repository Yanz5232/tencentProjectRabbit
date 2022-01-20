<template>
  <div>
    <!-- 使用模块A的数据 -->
   <h1>{{ $store.state.moduleA.user }}</h1>
   <!-- 使用模块A的getters -->
   <h1>{{ $store.getters.newUser}}</h1>
    <!-- 使用模块B的数据 -->
   <h1>{{ $store.state.moduleB.user }}</h1>
   <!-- 使用模块B的getters -->
   <h1>{{ $store.getters['moduleB/newUser']}}</h1>
   <button @click="mutationsFn">mutationsFn</button>
   <button @click="actionFn">actionFn</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
  name: "app",
  setup() {
    const store=useStore()
    const mutationsFn=()=>{
     //Ｂ模块的修改
     store.commit('moduleB/updateUser')
    }
    const actionFn=()=>{
      //Ｂ模块的的异步函数
     store.dispatch('moduleB/updateUser')

    }
    return{
      mutationsFn,
      actionFn
    }
  },
};
</script>

<style>
</style>