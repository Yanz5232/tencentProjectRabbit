<template>
<Transition>
 <div class="xtx-confirm" v-show="visible">
    <div class="wrapper">
      <div class="header">
        <h3>{{title}}</h3>
        <a href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <div class="footer">
        <XtxButton @click="cancel" size="mini" type="gray">取消</XtxButton>
        <XtxButton @click="submit" size="mini" type="primary">确认</XtxButton>
      </div>
    </div>
  </div>
</Transition>
 
</template>
<script>
import XtxButton from'./xtx-button.vue'
import { ref } from '@vue/reactivity'
import { onMounted } from 'vue'
export default {
  name: 'XtxConfirm',
  components:{
    XtxButton
  },
  props:{
    title:{
      type:String,
      default:'温馨提示'
    },
    text:{
      type:String
    },
    cancelCallback:{
      type:Function
    },
    submitCallback:{
      type:Function
    }
  },
  setup(props){
    /* 对话框默认隐藏 */
    const visible=ref(false)
    onMounted(()=>{
      visible.value=true
    })
    /* 取消 */
    const cancel=()=>{
      props.cancelCallback()
    }
    /* 确认 */
    const submit=()=>{
      props.submitCallback()
    }
    return{
      cancel,
      submit,
      visible
    }
  }
}
</script>
<style scoped lang="less">
.v-enter-from{
   opacity: 0;
} 
.v-enter-active{
  transition: 1s;
} 
.v-enter-to{
  opacity: 1;
}
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0,0,0,.5);
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>