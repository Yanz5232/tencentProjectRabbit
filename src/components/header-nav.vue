<template>
  <div>
    <!-- 导航 -->
      <ul class="navs">
        <li class="home"><router-link to="/">首页</router-link></li>
        <li @mouseleave="hide(item.id)" @mousemove="show(item.id)" v-for="item in list" :key='item.id'>
          <router-link @click="hide(item.id)" :to="`/category/${item.id}`">{{item.name}}</router-link>
          <div class="layer" :class="{open:item.open}">
            <ul>
              <li v-for="item2 in item.children" :key="item2.id">
                <router-link @click="hide(item.id)" :to="`/category/sub/${item2.id}`">
                  <img v-lazy="item2.picture" alt="">
                  <p>{{item2.name}}</p>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup(){
    const store=useStore()
    //拿到vuex中的分类
    const list=computed(()=>store.state.category.list)
    const show=(id)=>store.commit('category/showList',id)
    const hide=(id)=>store.commit('category/hideList',id)

    return{
      list,
      show,
      hide
    }
  }
}
</script>

<style lang="less" scoped>
.navs {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    >li {
      margin-right: 40px;
      width: 38px;
      text-align: center;
      >a {
        font-size: 15px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
      }
      &:hover {
        >a {
          color: @xtxColor;
          border-bottom: 1px solid @xtxColor;
        }
        /* >.layer{
          height: 132px;
          opacity: 1;
        } */
      }
    }
}
.layer{
  &.open{
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 50px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow:0 0 5px #ccc;
  transition: all .2s .1s;
  z-index: 999;
  ul{
    display: flex;
    flex-wrap: wrap;
    padding: 0px 70px;
    align-items: center;
    height: 124px;
    li{
      width: 110px;
      text-align: center;
      img{
        width: 60px;
        height: 60px;
      }
      p{
        padding-top: 10px;
      }
      &:hover{
        p{
          color: @xtxColor;
        }
      }
    }
  }
}
</style>