<template>
  <HomePanel ref="target" title="热门品牌" subTitle="国际今典 品质保证">
    <template #right>
      <a
        href="javascript:;"
        @click="left(-1)"
        :class="{ disabled: index == 1 }"
        class="iconfont icon-xiangzuojiantou prev"
      ></a>
      <a
        href="javascript:;"
        @click="left(1)"
        :class="{ disabled: index == 2 }"
        class="iconfont icon-xiangyoujiantou prev"
      ></a>
    </template>
    <div class="box" ref="box">
      <Transition name="fade">
        <ul v-if="result.length" class="list" :class="{ move: index == 2 }">
          <li v-for="item in result" :key="item.id">
            <Router-link to="/"><img :src="item.picture" alt="" /></Router-link>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton animated width='240px' height='305px' class="item" v-for="i in 5" :key='i' bg="#e4e4e4"></XtxSkeleton>
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from "vue";
import HomePanel from "./home-panel.vue";
import { useLazyData } from "@/hooks/index.js";
import { findBrand } from "@/api/home.js";
export default {
  components: {
    HomePanel,

  },
  setup() {
    const target = ref(null);
    const box = ref(null);
    const index = ref(1);
   
    //api 要的是函数 自己写个函数包起来就可以1了
    const result = useLazyData(target,()=> findBrand(10));

    const left = (n) => {
      if (index.value == 1 && n < 0) {
        return;
      }
      if (index.value == 2 && n > 0) {
        return;
      }
      index.value += n;
    };
    return {
      box,
      index,
      left,
      target,
      result,
    };
  },
};
</script>

<style lang="less" scoped>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.move {
  transform: translate(-1240px, 0px);
}
.skeleton{
  width: 100%;
  display: flex;
  .item{
    margin-right: 10px;
    &:nth-child(5n){
      margin-right: 0px;
    }
  }
}
</style>