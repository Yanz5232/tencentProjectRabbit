<template>
  <div class="app-header-sticky" :class="{show:y>78}">
    <div class="container" v-show="y>78">
      <router-link class="logo" to="/"></router-link>
      <headerNav></headerNav>
      <div class="right">
        <router-link  to="/">品牌</router-link>
        <router-link  to="/">专题</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import headerNav from "./header-nav.vue";
import {useWindowScroll} from'@vueuse/core'
export default {
  setup() {
    /* js原生监听页面滚动 
    const y=ref(0) 
    onMounted(()=>{
      window.onscroll=()=>{
         y.value=document.documentElement.scrollTop
      }
    }) */

    const {y}=useWindowScroll()
    return{
      y
    }
  },
  components:{
    headerNav
  }
};
</script>

<style lang="less" scoped>
.app-header-sticky{
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
  transform: translateY(-100%);
  opacity: 0;
  &.show{
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }
  .container{
    display: flex;
    align-items: center;
  }
  .logo{
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat center 18px / contain;
    background-size: 160px auto;
  }
  .right{
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a{
      width: 38px;
      margin-right: 40px;
      font-size: 15px;
      line-height: 1;
      &:hover{
        color: @xtxColor;
      }
    }
  }
}
</style>