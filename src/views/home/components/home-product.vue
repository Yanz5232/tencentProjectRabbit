<template>
  <div ref='target' class="home-product">
    <HomePanel  :title="item.name" v-for="item in productList" :key="item.id">
      <!-- 右上角 -->
      <template v-slot:right>
        <div class="sub">
          <RouterLink :to="`category/sub/${item3.id}`" v-for="item3 in item.children" :key="item3.id">{{item3.name}}</RouterLink>
        </div>
        <XtxMore :path='`/category/${item.id}`'/>
      </template>
      <!-- 主题内容 -->
      <div class="box">
        <!-- 左侧长条图 -->
        <RouterLink class="cover" :to="`/category/${item.id}`">
          <img
            v-lazy="item.picture" 
            alt=""
          />
          <strong class="label">
            <span>{{item.name}}</span>
            <span>{{item.saleInfo}}</span>
          </strong>
        </RouterLink>
        <!-- 8个商品 -->
        <ul class="goods-list">
          <!-- 遍历一个个小商品 -->
          <li v-for="item2 in item.goods" :key="item2.id">
            <HomeGoods :img='item2.picture' :name='item2.name' :desc="item2.desc" :price="item2.price" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from "./home-panel.vue";
import HomeGoods from "./home-goods.vue";
import {useLazyData} from'@/hooks/index.js'
import {findProduct} from'@/api/home.js'
import { ref } from 'vue';
export default {
  name: "HomeProduct",
  components: { HomePanel, HomeGoods },
  setup(){
    const productList=ref([])
    const target=ref(null)
    const result=useLazyData(target,findProduct)
     return{
       result,
       productList:result,
       target
     }
  }
};
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>