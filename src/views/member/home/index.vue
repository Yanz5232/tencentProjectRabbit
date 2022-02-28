<template>
  <div class="member-home">
    <!-- 概览组件 -->
    <HomeOverview></HomeOverview>
    <!-- 收藏 -->
    <HomePanel title="我的收藏" v-if="goods">
      <GoodsItem v-for="item in goods" :key="item.id" :goods='item'></GoodsItem>
    </HomePanel>
    <!-- 组件 -->
    <HomePanel title="我的足迹" v-if="goods">
      <GoodsItem v-for="i in 4" :key="i" :goods='goods'></GoodsItem>
    </HomePanel>
    <!-- 猜你 -->
    <GoodsRelevant></GoodsRelevant>
  </div>
</template>
<script>
import HomeOverview from "./components/home-overview.vue";
import HomePanel from "./components/home-panel.vue";
import GoodsRelevant from "@/views/goods/components/goodsRelevant.vue";
import GoodsItem from'@/views/category/components/goods-item.vue'
import {findCollect} from'@/api/member.js'
import { ref } from 'vue';
export default {
  name: "MemberHome",
  components: {
    HomeOverview,
    HomePanel,
    GoodsRelevant,
    GoodsItem
  },
  setup () {
    const goods=ref(null)
    findCollect(1,4).then(res=>{
      goods.value=res.result.item
      console.log(goods.value);

    })
    return { goods }
  }
};
</script>
<style scoped lang="less">
.member-home {
  :deep(.xtx-carousel .carousel-btn.next) {
    right: 1px;
    top: 92px;
  }
  :deep(.xtx-carousel .carousel-btn.prev){
    left: 1px;
    top: 92px;
  }
}
 :deep(.goods-list) {
    display: flex;
    justify-content: space-around;
    padding-top: 20px;
  }
</style>