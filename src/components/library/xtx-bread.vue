<script>
import {h}from'vue'
export default {
  name: 'XtxBread',
  render(){
    //返回值就算组件内容
    //vue2 的h函数是传参进来 vue3的h函数要导入进来
    //vue3 第一个参数标签名字 第二个参数 标签属性对象 第三个参数子节点
    /* 
       1.创建父容器
       2.获取默认插槽内容、
       3.i标签应该由render函数来创建
       4.遍历插槽中的item标签 并且最后一个item不加i标签
       5.把遍历的item标签渲染到xtx-bread标签中
    */ 
   //所有子节点 （是个数组）
   const items=this.$slots.default()
   const dymanicItems=[]
   items.forEach((item,i) => {
      dymanicItems.push(item)
      if(i<items.length-1){
      dymanicItems.push(h('i',{class:'iconfont icon-xiangyoujiantou'}))
      }
   });
    return h('div',{class:'xtx-bread'},dymanicItems)
  }
}
</script>

<style  lang='less'>
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
    //ul li:last-of-child ul子元素中最后一个是li元素
    //ul li:last-of-type ul子元素中最后一个li元素
    /* &:last-of-type{

    } */
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>