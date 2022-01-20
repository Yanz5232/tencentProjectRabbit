<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterList.brands && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="changeBrand(item.id)"
          :class="{'active':item.id===filterList.brands.selectedBrand}"
          href="javascript:;"
          v-for="item in filterList.brands"
          :key="item.id"
          >{{ item.name }}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterList.saleProperties" :key="item.id">
      <div class="head">{{item.name}}</div>
      <div class="body">
        <a
          @click="changeProp(item,item2.id)"
          :class="{'active':item2.id===item.selectedAttr}"
          href="javascript:;"
          v-for="item2 in item.properties"
          :key="item2.id"
          >{{ item2.name }}</a>
      </div>
    </div>
  </div>
  <!-- 筛选区骨架 -->
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="39px"  />
    <XtxSkeleton class="item" width="800px" height="39px"  />
    <XtxSkeleton class="item" width="600px" height="39px"  />
    <XtxSkeleton class="item" width="600px" height="39px"  />
    <XtxSkeleton class="item" width="600px" height="39px"  />
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { findSubCategoryFilter } from "@/api/home.js";
export default {
  name: "SubFilter",
  setup(props,{emit}) {
    const route = useRoute();
    const filterList = ref([]);
    const filterLoading=ref(false)
    watch(() => route.params.id,(newVal) => {
      filterLoading.value=true
        if (newVal && `/category/sub/${newVal}` == route.path) {
          console.log(newVal);
          findSubCategoryFilter(route.params.id).then((res) => {
            res.result.brands.selectedBrand=null
            res.result.brands.unshift({ id: null, name: "全部" });
            res.result.saleProperties.forEach((item) => {
              item.selectedAttr=null
              item.properties.unshift({ id: null, name: "全部" });
            });
            filterList.value = res.result;
            filterLoading.value=false
          });
        }
      },{immediate:true}
    );
    //获取筛选参数函数
    const getFilterParams=()=>{
      const obj={
        brandId:null,
        attrs:[]
      }
      obj.brandId=filterList.value.selectedBrand
      filterList.value.saleProperties.forEach(item=>{
        if(item.selectedAttr){
          const prop=item.properties.find(prop=>prop.id==item.selectedAttr)
          obj.attrs.push({groupName:item.name,propertyName:prop.name})
        }
      })
      //参考数据：{brand:'',attrs:[{groupName:'',propertyName:''},...]}
      if(obj.attrs.length==0) obj.attrs=null
      return obj
    }
    //记录你选择的当前品牌
    const changeBrand=(brandId)=>{
      if(filterList.value.brands.selectedBrand==brandId) return
      filterList.value.brands.selectedBrand=brandId
      emit('filterChange',getFilterParams())
    }
    //记录选择的销售属性
    const changeProp=(item,id)=>{
      if(item.selectedAttr==id) return
      item.selectedAttr=id
      emit('filterChange',getFilterParams())
    }
    return {
      filterList,
      filterLoading,
      changeBrand,
      changeProp
    };
  },
};
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    padding: 10px 0;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>