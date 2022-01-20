<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :key="category.top.id" v-if="category.top" to='/'>{{category.top.name}}</XtxBreadItem>
    <Transition name="pop" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup(){
    const store=useStore()
    const route=useRoute()
    const category=computed(()=>{
      const cate={}
      store.state.category.list.forEach(item => {
        if(item.children){
         const sub=item.children.find(item2=>item2.id==route.params.id)
         if(sub){
           cate.top={id:item.id,name:item.name}
           cate.sub={id:sub.id,name:sub.name}
         }
        }
      });
      return cate
      
    })
    return{
      category
    }
  }
}
</script>

<style>

</style>