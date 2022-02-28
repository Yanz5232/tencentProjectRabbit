<template>
  <div class="xtx-pagination">
    <a href="javascript:;" :class="{disabled:myCurrentPage==1}" @click="changePage(-1)" >上一页</a>
    <span v-if="pager.start>1">...</span>
    <a @click="page(i)" href="javascript:;" v-for="i in pager.btnArr" :key="i" :class="{active:myCurrentPage==i}">{{i}}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a href="javascript:;" :class="{disabled:myCurrentPage==pager.pageCount}" @click="changePage(1)">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
export default {
  name: "XtxPagination",
  props:{
   /* 总条数 */
   total:{
     type:Number,
     default:100
   },
   /* 每页多少个 */
   pageSize:{
     type:Number,
     default:10
   },
   /* 当前页码 */
   currenPage:{
     type:Number,
     default:1
   }
  },
  setup(props,{emit}) {
    /* 按钮个数 */
    const count = 5;
    /* 当前显示的页码 */
    const myCurrentPage = ref(9);
    /* 总条数 */
    const myTotal = ref(100);
    /* 每页显示多少个 */
    const myPageSize = ref(10);
    /* 其它数据（总页数，起始按钮，结束按钮）依赖以上数据可得到 */
    const pager = computed(() => {
      /* 总页数 */
      const pageCount = Math.ceil(myTotal.value / myPageSize.value);
      //按钮个数和当前页码 ===> 起始按钮 结束按钮 按钮数组
      //1.理想情况
      const offset=Math.floor(count/2)//向下取整  按钮个数除二 2
      let start=myCurrentPage.value-offset //当前显示的页码减二 -1
      let end=start+count-1 //3
      //2.如果起始页码小于1需要处理
      if(start<1){
        start=1 //1
        end=(start+count-1)>pageCount?pageCount:(start+count-1)
      }
      //如果结束页码大于页数 
      if(end>pageCount){
        end=pageCount
        start=(end-count+1)<1?1:(end-count+1)
      }
      const btnArr=[]
      for (let i=start;i<=end;i++){
        btnArr.push(i)
      }
      return {
        pageCount,
        btnArr,
        start,
        end
      };
    });
    const changePage=(n)=>{
       if(n<0){
         if(myCurrentPage.value>1){
           myCurrentPage.value=myCurrentPage.value+n
           emit('currentPage',myCurrentPage.value)
         }
       }else{
         if(myCurrentPage.value!=pager.value.pageCount){
           myCurrentPage.value=myCurrentPage.value+n
           emit('currentPage',myCurrentPage.value)
         }
       }
    }
    const page=(i)=>{
       myCurrentPage.value=i
       console.log(myCurrentPage.value);
       emit('currentPage',myCurrentPage)
    }
    /* 监听props的变化 更新组件内部的数据 */
    watch(props,()=>{
      myTotal.value=props.total
      myPageSize.value=props.pageSize
      myCurrentPage.value=props.currenPage
    },{immediate:true})
    return {
      pager,
      myCurrentPage,
      changePage,
      page
    };
  },
};
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>