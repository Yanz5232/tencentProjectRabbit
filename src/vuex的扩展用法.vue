<template>
  <div id="nav">
    {{ $store.state.user }}
    {{ $store.getters.newUser }}
    <button @click="updateUser">调用getters里的方法</button>
  </div>
</template>
<script>
import { useStore } from "vuex";
export default {
  setup() {
    //定义vuex库
    const vuex = useStore();
    //使用vuex的state数据
    console.log(vuex.state.user);
    //使用vuex的getters数据
    console.log(vuex.getters.newUser);
    const updateUser = () => {
      //调用vuex的修改方法
      /* vuex.commit("updateUser"); */
      //调用vuex的拿数据方法
      vuex.dispatch('updateUser')
    };
    return {
      updateUser,
    };
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
