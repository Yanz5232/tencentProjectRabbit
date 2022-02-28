<template>
  <div class="checkout-address">
    <div class="text">
      <!-- 没有默认地址的时候显示 -->
      <div v-if='!showAddress' class="none">您需要先添加收货地址才可提交订单。</div>
      <!-- 默认地址 -->
      <ul v-if='showAddress'>
        <li><span>收<i />货<i />人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation}}{{showAddress.address}}</li>
      </ul>
      <a @click="editAddAddress(showAddress)" href="javascript:;">修改地址</a>
    </div>
    <!-- 底部按钮 -->
    <div class="action">
      <XtxButton @click="changeAddress" class="btn">切换地址</XtxButton>
      <XtxButton @click="editAddAddress()"  class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 选择地址对话框 -->
  <XtxDialog title="切换收获地址" v-model:visible="visible">
    <div @click="getAddress(item)" :class="{active:item.id==showAddress.id}" class="text item" v-for="item in list" :key="item.id">
      <ul >
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
      </ul>
    </div>
    <template #footer >
      <XtxButton @click="visible=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="visible=false" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑组件 -->
  <AddressEdit @addSuccess='addSuccess' ref="editAddAddressRef"  :title="editTitle"></AddressEdit>
</template>
<script>
import AddressEdit from'./address-edit.vue'
import { ref } from 'vue';
export default {
  name: "CheckoutAddress",
  //在没有根元素的组件中 向外触发emit事件 要把事件写到emits里
  emits:['changeId','addSuccess'],
  props: {
    list: {
      type: Array,
      default:()=>[]
    },
  },
  components:{
    AddressEdit
  },
  setup(props,{emit}){
    const showAddress=ref(null)
    const editAddAddressRef=ref(null)
    const defaultAddress=props.list.find(item=>item.isDefault==0)
    if(defaultAddress){
       showAddress.value=defaultAddress
    }else{
      if(props.list.length){
        showAddress.value=props.list[0]
      }
    }
    emit('changeId',showAddress.value.id)
    const visible=ref(false)
    const changeAddress=()=>{
      visible.value?visible.value=false:visible.value=true
    }
    const getAddress=(item)=>{
      showAddress.value=item      /* vlaue有值在去取id */
      emit('changeId',showAddress.value?.id)
      visible.value=false
    }
    const editTitle=ref('添加地址')
    const editAddAddress=(address)=>{
      address?editTitle.value='修改收获地址':editTitle.value='添加收获地址'
       editAddAddressRef.value.open(address)
    }
    const addSuccess=(formData)=>{
       props.list.forEach(item=>{
         if(item.id==formData.id){
           for(let key in formData){
             item[key]=formData[key]
           }
           return
         }
       })
    }
    return {
      showAddress,
      visible,
      changeAddress,
      getAddress,
      editTitle,
      editAddAddressRef,
      editAddAddress,
      addSuccess
    }
  }
};
</script>
<style scoped lang="less">
.xtx-dialog{
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
     &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
      }
    }
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
     &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
      }
    }
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>