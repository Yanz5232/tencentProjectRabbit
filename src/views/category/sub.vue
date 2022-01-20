<template>
  <div class="sub">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @filterChange='filterChange'></SubFilter>
      <!-- 商品面板（排序+列表） -->
      <div class="goods-list">
        <SubSort @sortChange='sortChange'></SubSort>
        <!-- 商品列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItem :goods="item"></GoodsItem>
          </li>
        </ul>
        <!-- 无线加载组件 -->
        <XtxInfiniteLoading
          :finished="finished"
          :loading="loading"
          @infinite="getData"
        ></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import SubBread from "./components/sub-bread.vue";
import SubFilter from "./components/sub-filter.vue";
import SubSort from "./components/sub-sort.vue";
import GoodsItem from "./components/goods-item.vue";
import { findSubCategoryGoods } from "@/api/home";
import { useRoute } from "vue-router";
export default {
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem,
  },
  setup() {
    const route = useRoute();
    /* 是否加载数据 */
    const loading = ref(false);
    /* 谁否没数据 */
    const finished = ref(false);
    /* 请求列表数据 */
    const goodsList = ref([]);
    /* 请求体 */
    let goodsInfo = {
      page: 1,
      pagesize: 5,
    };
    const getData = () => {
      loading.value = true;
      goodsInfo.categoryId = route.params.id;
      findSubCategoryGoods(goodsInfo).then(({ result }) => {
        if (result.items.length > 0) {
          goodsList.value.push(...result.items);
          //把页码改成下一页的页码
          goodsInfo.page++
        } else {
          finished.value = true;
        }
        loading.value = false;
      });
    };
    //梗概二级分类重新加载数据
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/sub/${newVal}` == route.path) {
          goodsList.value={}
          loading.value=false
          goodsInfo = {
            page: 1,
            pagesize: 5,
          };
        }
      }
    );
    //改变筛选数据 重新请求
    const sortChange=(sortParams)=>{
       finished.value=false
       goodsInfo={...goodsList,...sortParams}
       goodsList.page=1
    }
    const filterChange=(info)=>{
      finished.value=false
       goodsInfo={...goodsList,...info}
       goodsList.page=1
       goodsList.value=[]
    }
    return {
      getData,
      loading,
      finished,
      goodsList,
      sortChange,
      filterChange
    };
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>