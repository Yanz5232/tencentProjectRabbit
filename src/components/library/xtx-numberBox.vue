<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label }}</div>
    <div class="numbox">
      <a @click="changeCount(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="modelValue">
      <a @click="changeCount(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  setup(props,{emit}){
    //使用vueuse的useVmodel做数据绑定 修改count 通知父组件更新
     const count=useVModel(props,'modelValue',emit)
     const changeCount=(n)=>{
       //得到改变后的新值
       const newCount=count.value+n
       if(newCount<props.minNum || newCount>props.maxNum ) return
       //正常改值
       count.value=newCount
       emit('change',newCount)
     }
     return{
       changeCount
     }
  },
  props:{
    modelValue:{
      tyoe:Number,
      default:1
    },
    minNum:{
      tyoe:Number,
      default:1
    },
    maxNum:{
      type:Number,
      default:10
    },
    label:{
      type:String,
      default:''
    }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>