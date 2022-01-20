<template>
  <div class='goods-sort'>
    <div class="sort">
      <a @click="changeSort(null)" :class="{'active':sortParams.sortField==null}" href="javascript:;">默认排序</a>  
      <a @click="changeSort('publishTime')" :class="{'active':sortParams.sortField=='publishTime'}" href="javascript:;">最新商品</a>
      <a @click="changeSort('orderNum')" :class="{'active':sortParams.sortField=='orderNum'}" href="javascript:;">最高人气</a>
      <a @click="changeSort('evaluateNum')" :class="{'active':sortParams.sortField=='evaluateNum'}" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i :class="{'active':sortParams.sortField=='price'&&sortParams.sortMethod=='asc'}" class="arrow up" />
        <i :class="{'active':sortParams.sortField=='price'&&sortParams.sortMethod=='desc'}" class="arrow down" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeChecked" v-model:checkedChange="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeChecked" v-model:checkedChange="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'GoodsSort',
  setup(props,{emit}){
    const sortParams=reactive({
      inventory:false,
      onlyDiscount:false,
      sortField:null,
      sortMethod:null//控制降序升序
    })
    const changeSort=(sortField)=>{
      if(sortField=='price'){
        sortParams.sortField=sortField
        //第一次点排序的时候默认下
        if(sortParams.sortMethod==null){
          sortParams.sortMethod='desc'
        }else{
          sortParams.sortMethod=sortParams.sortMethod=='desc'?'asc':'desc'
        }
      }else{
        //点击同一个按钮不执行
        if(sortParams.sortField==sortField)return
        sortParams.sortField=sortField
        sortParams.sortMethod=null
      }
      emit('sortChange',sortParams)
    }
    const changeChecked=()=>{
        emit('sortChange',sortParams)
    }
    return{
      sortParams,
      changeSort,
      changeChecked
    }
  }
}
</script>
<style scoped lang='less'>
.goods-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>