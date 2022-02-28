<template>
    <div class="member-order-detail" v-if="order">
        
        <!-- 头部 -->
        <DetailAction :order='order'></DetailAction>
        <!-- 进度 -->
        <DetailSetp :order='order'></DetailSetp>
        <!-- 物流 -->
        <suspense>
            <template #default>
              <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order='order'></DetailLogistics>
            </template>
            <template #fallback> 
                 loading....
            </template>
        </suspense>
        <!-- 信息 -->
        <DetailInfo :order='order'></DetailInfo>
    </div>
</template>

<script>
import { ref } from 'vue'
import DetailAction from'./components/detail-action.vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailSetp from'./components/detail-step.vue'
import DetailLogistics from'./components/detail-logistics.vue'
import DetailInfo from'./components/detail.info.vue'
export default {
   components:{
       DetailAction,
       DetailSetp,
       DetailLogistics,
       DetailInfo
   },
   setup(){
       const route= useRoute()
       const order=ref()
       findOrderDetail(route.params.id).then(res=>{
           order.value=res.result
       })
       return{
           order
       }
   }
}
</script>

<style scoped lang='less'>
.member-order-detail{
    height: 100%;
    background: white;
    
}
</style>