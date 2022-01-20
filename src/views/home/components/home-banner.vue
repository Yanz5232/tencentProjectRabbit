<template>
  <div class="home-banner">
    <XtxCarousel :sliders="bannerList"></XtxCarousel>
  </div>
</template>

<script>
import { findBanner } from "@/api/home.js";
import { computed, reactive, ref } from "vue";
export default {
  setup() {
    //获取轮播图数组
    const bannerList = ref([]);
    findBanner().then((res) => {
      bannerList.value = res.result;
    });
    return {
      bannerList,
    };
  },
};
</script>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
.xtx-carousel {
  ::v-deep .prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>