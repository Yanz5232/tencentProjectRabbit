<template>
  <div>
    <XtxTabs v-model="activename" @tabClick="tabClick">
      <XtxTabsPanel
        v-for="(item, i) in orderStatus"
        :key="i"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        v-for="item in orderList"
        :key="item.id"
        :order="item"
        @on-cancel='onCancel'
        @on-delete='onDelete'
        @on-confiirm='onConfiirm'
        @on-logistics='onLogistics'
      ></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      v-if="total > 0"
      :currenPage="reqParams.page"
      :pageSize='reqParams.pageSize'
      :total='total'
      @currentPage='currentPage'
    ></XtxPagination>
  </div>
    <OrderCancel ref="orderCancelCom"></OrderCancel>
    <OrderLogistics ref='orderLogisticsRef' ></OrderLogistics>
</template>

<script>
import OrderItem from "./components/order-item.vue";
import OrderCancel from'./components/order-cancel.vue'
import { getCurrentInstance, reactive, ref, watch } from "vue";
import { confirmOrder, deleteOrder, findOrderList } from "@/api/order";
import { orderStatus } from "@/api/constants.js"
import OrderLogistics from'./components/order-logistics.vue'
export default {
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup() {
    const activename = ref("all");
    const orderList = ref([]);
    const loading = ref(false);
    const total = ref(0);
    const {proxy}=getCurrentInstance()
    const reqParams = reactive({
      page: 1,
      pageSize:4,
      orderState: 0,
    });
    const tabClick = (object) => {
      reqParams.page = 1;
      reqParams.orderState = object.i;
    };
    const orders=()=>{
      loading.value = true;
        findOrderList(reqParams).then((res) => {
          orderList.value = res.result.items;
           total.value=res.result.counts
          loading.value = false;
        });
    }
    watch(reqParams,() => {
        orders()
      },
      { immediate: true }
    );
    const currentPage=(e)=>{
        reqParams.page=e.value
    }
    const onDelete=(order)=>{
        proxy.$confirm('亲，您确认要删除这个商品吗').then(res=>{
            deleteOrder(order.id).then(res=>{
              proxy.$message('success','删除成功')
              orders()
            })
        }).catch(()=>{
             
        }) 
    }
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
    
    return {
      activename,
      tabClick,
      orderList,
      orderStatus,
      loading,
      total,
      reqParams,
      currentPage,
      ...useCancel(),
      onDelete,
      onConfiirm,
      ...useOnLogistics() 
    };
  },
};
//取消订单逻辑
export const useCancel=()=>{
  const orderCancelCom=ref(null)
  const onCancel=(order)=>{
     orderCancelCom.value.open(order)
  }
  return {
    onCancel,
    orderCancelCom
  }
}
//查看物流逻辑
const useOnLogistics=()=>{
  const orderLogisticsRef=ref(null)
  const onLogistics=(order)=>{
     orderLogisticsRef.value.open(order)
  }
  return{
    onLogistics,
    orderLogisticsRef
  }
}

</script>

 <style lang="less" scoped>
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>