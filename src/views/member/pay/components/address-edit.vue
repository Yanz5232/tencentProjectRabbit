<template>
  <XtxDialog :title="title" v-model:visible="visible">
    <!-- 表单 -->
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity :fullLocation='formData.fullLocation' @changeCitt='changeCity' city='请选择收获地址' placeholder="请选择所在地区" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <template #footer>
      <XtxButton
        @click="visible=false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { getCurrentInstance, reactive,ref } from "vue";
import { Addaddress, editAddress } from '@/api/order';
export default {
  props: {
    title: {
      type: String,
    },
  },
  setup(props,{emit}) {
    const visible = ref(false);
    const types=ref(null)
    const open = (address) => {
      visible.value = true;
      if(address){
        types.value=1/* 修改地址 */
        for(let key in address){
          formData[key]=address[key]
        }
      }else{
        types.value=2/* 添加地址 */
        for(let key in formData){
          if(key!='isDefault') formData[key]=null
        }
      }
      
    };
    const formData=reactive({
      receiver:null,
      contact:null,
      provinceCode:null,
      cityCode:null,
      countyCode:null,
      address:null,
      postalCode:null, 
      addressTags:null,
      isDefault:1,
      /* 城市表单完整地址 */
      fullLocation:null,
    })
    const changeCity=(result)=>{
      formData.provinceCode=result.provinceCode
      formData.cityCode=result.cityCode
      formData.countyCode=result.countyCode
      formData.fullLocation=result.fullLocation
    }
    const {proxy}=getCurrentInstance()
    const submit=()=>{
      if(types.value==2){
        Addaddress(formData).then(res=>{
          proxy.$message('success','添加地址成功')
          visible.value=false
          const jsonStr=JSON.stringify(formData)
          emit('addSuccess',JSON.parse(jsonStr))
        })
      }else{
        editAddress(formData).then(res=>{
          proxy.$message('success','修改地址成功')
          visible.value=false
          const jsonStr=JSON.stringify(formData)
          emit('addSuccess',JSON.parse(jsonStr))
        })
      }
      
    }
    return {
      visible,
      open,
      formData,
      changeCity,
      submit
    }
  },
};
</script>

<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}

.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-form-item {
  display: flex;
  margin: 1rem 0rem;
  justify-content: center;
  align-items: center;
  .label {
    width: 10rem;
    text-align: right;
    color: rgb(160, 159, 160);
  }
  .field {
    input {
      display: inline-block;
      height: 50px;
      border: rgb(180,180,180) 1px solid;
      width: 320px;
      padding: 0 10px;
      transition: 0.5s;
      &:focus{
        border: 1px solid rgb(39, 161, 226);
        box-shadow: 0px 0px 10px 1px rgb(39, 161, 226) ;
      }
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>