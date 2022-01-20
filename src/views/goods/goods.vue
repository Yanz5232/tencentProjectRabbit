<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :path="`/category/${goods.categories[1].id}`" v-if="goods">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :path="`/category/sub/${goods.categories[0].id}`" v-if="goods">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem to="/" v-if="goods">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info" >
        <div class="media">
          <GoodsImgs :images="goods.mainPictures"></GoodsImgs>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <GoodsName :goods="goods"></GoodsName>
          <GoodsSku @change='change' :specs='goods.specs' :skus="goods.skus" :skuId='"1369155862131642369"'></GoodsSku>
          <XtxNumbox v-model="count" :maxNum='goods.inventory' :label='"数量"' ></XtxNumbox>
          <XtxButton type='primary'>加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant v-if="goods" :goodsId="goodsId"/>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot></GoodsHot>
          <GoodsHot :hotType="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import GoodsRelevant from './components/goodsRelevant.vue'
import { useRoute } from 'vue-router'
import {findGoods} from'@/api/product.js'
import GoodsImgs from'./components/goodsImg.vue'
import GoodsSales from'./components/goodsSales.vue'
import GoodsName from'./components/goodsName.vue'
import GoodsSku from'./components/goodsSku.vue'
import GoodsTabs from'./components/goods-tabs.vue' 
import GoodsHot from'./components/goods-hot.vue'
import GoodsWarn from'./components/goods-warn.vue'
export default {
  name: 'XtxGoodsPage',
  components: {  GoodsRelevant,GoodsImgs,GoodsSales,GoodsName,GoodsSku,GoodsTabs,GoodsHot,GoodsWarn },
  setup(){
      const goodsId=ref()
      const goods=useGoods()
      const change=(obj)=>{
        goods.value.price=obj.price
        goods.value.oldPrice=obj.oldPrice
        goods.value.inventory=obj.inventory
        console.log(goods);
      }
      //选择的数量
      const count=ref(1)
      const route=useRoute()
      goodsId.value=route.params.id
      //提供goods数据给后代组件使用
      provide('goods',goods)
      return{
        goods,
        change,
        count,
        goodsId
      }
  }
}
const useGoods=()=>{
  const goods=ref(null)
  const route=useRoute()
  //监听路由id变化拿不同的数据
  watch(()=>route.params.id,(newVal)=>{
    if(newVal){
      findGoods(route.params.id).then(data=>{
        goods.value=null
        nextTick(()=>{
           data.result.specs.forEach((item,index) => {
              item.id=index
              item.values.forEach(item2=>{
                item2.selected=false
                item2.disabled=false
              })
           });
           goods.value=data.result
        })
      })
    }
  },{immediate:true})
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media{
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec{
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>