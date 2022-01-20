<template>
  <div class='xtx-checkbox' @click="change">
    <i class="iconfont icon-checkboxchecked" v-if="checked"></i>
    <i class="iconfont icon-checkbox-weixuan" v-else></i>
    <span if='$slots.default'><slot /></span>
  </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
//v-model ===> :modelValue + @update:modelValue
export default {
  name:'XtxCheckbox',
  props:{
    checkedChange:{
      type:Boolean,
      default:false
    }
  },
  setup(props,{emit}){
    //普通写法
 /* const checked=ref(false)
    const change=()=>{
        checked.value=!checked.value
        //通知父组件改变数据
        emit('update:modelValue',checked.value)
    }
    watch(()=>props.modelValue,()=>{
        checked.value=props.modelValue
    },{immediate:true}) */
    //使用useVModel实现双向数据绑定v-model指令
    //使用useVModel来包装props里的modelValue属性数据
    //使用checked.value 就是使用父组件数据
    //给checked.value赋值 会触发emit('update:modelvalue','数据')
    const checked=useVModel(props,'checkedChange',emit)
    const change=()=>{
      const newVal=!checked.value
      checked.value=newVal
      //通知父组件
      emit('change',newVal)
    }
    return{
       checked,
       change
    }
  }
}
</script>

<style lang="less" scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>