<template>
  <div  class="home-New">
    <homePanel ref="homeNew" title="新鲜好物" subTitle="人气爆款 不容错过">
      <!-- 右上角 -->
      <template #right><xtxMore></xtxMore></template>
      <Transition name='fade'>
      <!-- 商品内容 -->
      <ul v-if="findNewList.length" class="goods-list">
        <li v-for="item in findNewList" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img v-lazy="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
       <HomeSkeleton bg='#f0f9f4' v-else></HomeSkeleton>
      </Transition>
    </homePanel>
  </div>
</template>

<script>
import homePanel from "./home-panel.vue";
import HomeSkeleton from'./home-skeleton.vue'
import { findNew } from "@/api/home.js";
import {  ref } from "vue";
import {useLazyData} from'@/hooks/'
export default {
  components: {
    homePanel,
    HomeSkeleton
  },
  setup() {
    const homeNew=ref(null)
    let findNewList = ref([]);
    const result= useLazyData(homeNew,findNew)
    return {
      homeNew,
      findNewList:result,
    };
  },
};
</script>

<style lang="less" scoped>

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0px 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>