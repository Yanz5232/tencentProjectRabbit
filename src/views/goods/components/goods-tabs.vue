<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{active:active}" href="javascript:;" @click="changeActive(1)">商品详情</a>
      <a :class="{active:!active}" href="javascript:;" @click="changeActive(2)">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 -->
    <component :is="active?'GoodsDetial':'Goodscomment'"></component>
  </div>
</template>
<script>
import { ref,inject } from 'vue'
import GoodsDetial from'./goods-detial.vue'
import Goodscomment from'./goods-comment.vue'
export default {
  name: 'GoodsTabs',
  components: { GoodsDetial,Goodscomment },
  setup () {
    const active=ref(true)
    const goods=inject('goods')
    const changeActive=(n)=>{
      n==1?active.value=true:active.value=false
      
    }
    return{
      active,
      changeActive,
      goods
    }
  }
}
</script>
<style scoped lang="less">
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>