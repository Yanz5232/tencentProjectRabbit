<template>
  <div class="top-category">
     <div class="container">
      <!-- 面包屑 -->
      <!-- out-in当前元素先进性过度，完成之后新元素过度进入 -->
      <!-- in-out新元素先进性过度，完成之后当前元素过度离开 -->
      <XtxBread>
        <XtxBreadItem path='/'>首页</XtxBreadItem>
        <Transition name='fade-right' mode="out-in">
          <XtxBreadItem path='/' :key="topCategory.id" v-if="topCategory">{{topCategory.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders='sliders' style="height:500px"></XtxCarousel>
      <!-- 所有二级分类 -->
      <div class="sub-list" v-if="topCategory && topCategory.children">
        <h3>全部分类</h3> 
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 各个分类推荐商品 -->
      <div class="ref-goods" v-for="sub in subList" :key='sub.id'>
        <div class="head">
          <h3>- {{sub.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <xtxMore :path='`/category/sub/${sub.id}`'></xtxMore>
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods='goods'></GoodsItem>
        </div>
      </div>
     </div>
  </div>
</template>

<script>
import {findBanner,findTopCategory} from'@/api/home.js'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from'./components/goods-item.vue'

export default {
    setup(){
      //轮播图
      const sliders=ref([])
      findBanner().then(res=>sliders.value=res.result)
      //面包屑导航+所有子分类 ===>vuex
      const route=useRoute()
      const store=useStore()
      const topCategory=computed(()=>{
        //获得当前分类id
        const id=route.params.id
        //获取所有分类的数据
        const category=store.state.category.list
        //返回当前分类的数据
        return category.find(item=>item.id==id)
      })
      //获取各个子类目下的推荐商品
      const subList=ref([])
      const getSubList=()=>{
        findTopCategory(route.params.id).then(res=>{
        subList.value=res.result.children
      })
      }
      watch(()=>route.params.id,(newVal)=>{
        if(newVal && `/category/${newVal}`==route.path){
          getSubList()
        }
      },{immediate:true})
      return{
        sliders,
        topCategory,
        subList,
      }
    },
    components:{
      GoodsItem
    }
}
</script>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods{
    background-color: #fff;
    margin-top: 20px;
    position: relative;
  }
  .head{
    .xtx-more{
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag{
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}

</style>