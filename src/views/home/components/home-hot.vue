<template>
  <div ref="homeHot" class="home-New">
    <homePanel title="人气爆款" subTitle="人气爆款 不容错过">
      <Transition name='fade'>
      <!-- 商品内容 -->
      <ul v-if="findHotList.length" class="goods-list">
        <li v-for="item in findHotList" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img v-lazy="item.picture" alt="" />
            <p class="name ellipsis">{{ item.title }}</p>
            <p class="price">&yen;{{ item.alt }}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton v-else bg='#f0f9f4' ></HomeSkeleton>
      </Transition>
    </homePanel>
  </div>
</template>

<script>
import HomeSkeleton from'./home-skeleton.vue'
import homePanel from "./home-panel.vue";
import { findHot } from "@/api/home.js";
import { ref } from "vue";
import {useLazyData} from'@/hooks/'
export default {
  components: {
    homePanel,
    HomeSkeleton
  },
  setup() {
    let  findHotList = ref([]);
    const homeHot=ref(null)
    const result=useLazyData(homeHot,findHot)
    return {
      findHotList:result,
      homeHot
    };
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px ;
      text-align: center;
    }
    .desc{
      color: #999;
      font-size: 18px;
    }
  }
}
</style>