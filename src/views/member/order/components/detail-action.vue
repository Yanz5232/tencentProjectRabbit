<template>
  <div class="detail-action" v-if="order">
    {{order.id}}
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <XtxButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton @click="onCancel(order)" type="gray" size="small">取消订单</XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton @click="addShopping(order.id)" type="primary" size="small">再次购买</XtxButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">{{order.id}}
        <XtxButton @click="onConfiirm(order)" type="primary" size="small">确认收货</XtxButton>
        <XtxButton @click="addShopping(order.id)" type="plain" size="small">再次购买</XtxButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton @click="addShopping(order.id)" type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton @click="addShopping(order.id)" type="primary" size="small">再次购买</XtxButton>
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
    </div>
      <OrderCancel ref="orderCancelCom"></OrderCancel>
  </div>
</template>
<script>
import { orderStatus } from "@/api/constants.js";
import OrderCancel from'./order-cancel.vue'
import {useCancel} from'../index.vue'
import { confirmOrder } from '@/api/order';
import { getCurrentInstance } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
export default {
  name: "OrderDetailAction",
  props: {
    order: {},
  },
  components:{
    OrderCancel
  },
  setup() {
    const router=useRouter()
    const {proxy}=getCurrentInstance()
    const onConfiirm=(order)=>{
      proxy.$confirm('确认收获后讲打款给商家，请确认收到货').then(res=>{
        confirmOrder(order.id).then(res=>{
          proxy.$message('success','确认收货成功')
          order.orderState=4
          orders()
        })
      }).catch(()=>{
        proxy.$message('success','取消收货成功')
      })
    }
    const addShopping=(id)=>{
      console.log(id);
      router.push(`/member/checkout?orderId=${id}`)
    }
    return {
      orderStatus,
      ...useCancel(),
      onConfiirm,
      addShopping
    };
  },
};
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>