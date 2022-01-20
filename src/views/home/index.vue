<template>
  <div class="home-top">
    <!-- 首页头部 -->
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew></HomeNew>
  <!-- 人气推荐 -->
  <HomeHot></HomeHot>
  <!-- 品牌组件 -->
  <HomeBrand></HomeBrand>
  <!-- 商品区块 -->
  <HomeProduct></HomeProduct>
  <!-- 最新专题 -->
  <HomeSpecial></HomeSpecial>
</template>

<script>
import HomeCategory from "./components/homeCategory.vue";
import HomeSpecial from'./components/home-special.vue'
import HomeBanner from "./components/home-banner.vue";
import HomePanel from "./components/home-panel.vue";
import { reactive, ref } from 'vue';
import HomeNew from'./components/home-new.vue'
import HomeHot from'./components/home-hot.vue'
import HomeBrand from'./components/home-brand.vue'
import HomeProduct from'./components/home-product.vue'
export default {
  name: "home",
  setup() {
    const show =ref(true)
    return{
      show
    }
  },
  components: {
    HomeCategory,
    HomeBanner,
    HomePanel,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  },
};
</script>

<style lang="less" scoped>

</style>