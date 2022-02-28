<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
   name:'XtxTabs',
   props:{
     modelValue:{
       type:[String,Number],
       default:''
     }
   },
   setup(props,{emit}){
     const activeName=useVModel(props,'modelValue',emit)
     provide('activeName',activeName)
     const changeActive=(name,i)=>{
       activeName.value=name
       emit('tabClick',{name,i})
     }
     return{
       activeName,
       changeActive
     }
   },
   render(){
     //获取插槽内容
     const panels=this.$slots.default()
     const dynamicPanels=[]
     panels.map(item=>{
       if(item.props){
         dynamicPanels.push(item)
       }else{
         item.children.map(item2=>dynamicPanels.push(item2))
       }
     })
     
     //选项卡
     const nav=<nav>
                {dynamicPanels.map((item2,i)=><a onClick={()=>this.changeActive(item2.props.name,i)} class={{active:this.activeName==item2.props.name}} name={item2.props.name}>{item2.props.label}</a>)}
               </nav>
     return <div class='xtx-tabs'>{nav}{dynamicPanels}</div>
   }
}
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>