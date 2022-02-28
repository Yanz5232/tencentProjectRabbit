<template>
  <div class="xtx-city" ref="target">
    <div class="select" >
      <span v-if="!fullLocation" class="placeholder"  :style="visible?{color:'turquoise'}:{color:'rgb(165, 153, 176)'}" @click="toggle">{{city}}</span>
      <span v-else class="value" :style="visible?{color:'turquoise'}:{color:'rgb(165, 153, 176)'}" @click="toggle">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <template v-if="!loading">
        <span class="ellipsis" @click="changeitem(item)" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
        <div v-else class="loading"></div>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props:{
    fullLocation:{
      type:String
    },
    city:{
      type:String,
      default:'请选择配送地址'
    }
  },
  setup (props,{emit}) {
    const visible=ref(false)
    const cityData=ref([])
    const loading=ref((false))
    const show=()=>{
      visible.value=true
      //是否显示正在加载组件
      loading.value=true
      getCityData().then(data=>{
        cityData.value=data.data;
        //是否显示正在加载组件
        loading.value=false
      })
      //清空之前选择
      changeResult.provinceCode=''
      changeResult.provincename=''
      changeResult.cityCode=''
      changeResult.cityname=''
      changeResult.countyCode=''
      changeResult.countyname=''
    }
    const close=()=>{
      visible.value=false
    }
    const toggle=()=>{
      visible.value ? close() : show() 
    }
    //点击组件外部元素关闭组件对话框
    const target=ref(null)//点击外头的回调函数
    onClickOutside(target,(ev)=>{
       close()
    })
    //实现计算属性：获取当前先睡的地区列表
    const currList=computed(()=>{
      //默认显示省一级
      let list=cityData.value
      if(changeResult.provinceCode && changeResult.provincename){
        list=list.find(p=>p.code==changeResult.provinceCode).areaList
      }
      if(changeResult.provinceCode && changeResult.provincename && changeResult.cityCode && changeResult.cityname){
        list=list.find(p=>p.code==changeResult.cityCode).areaList
      }
      return list
    })
    //定义省市区 数据
    const changeResult=reactive({
      provinceCode:'',
      provincename:'',
      cityCode:'',
      cityname:'',
      countyCode:'',
      countyname:'',
    })
    const changeitem=(item)=>{
      if(item.level==0){
        changeResult.provinceCode=item.code
        changeResult.provincename=item.name
      }
      if(item.level==1){
        changeResult.cityCode=item.code
        changeResult.cityname=item.name
      }
      if(item.level==2){
        changeResult.countyCode=item.code
        changeResult.countyname=item.name
        close()
        changeResult.fullLocation=`${changeResult.provincename} ${changeResult.cityname} ${changeResult.countyname}`
        emit('changeCitt',changeResult)
      }
    }
    return{
      visible,
      toggle,
      target,
      loading,
      currList,
      changeitem
    }
  }
}
//获取数据函数https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
const getCityData=()=>{
  //当本地没有缓存发请求获取数据
  //当本地有缓存 直接拿本地缓存的数据
  return new Promise((res,rej)=>{
     // 数据存在window上的cityData字段
     if(window.cityData){
       res(window.cityData)
     }else{
       axios.get('https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json').then(data=>{
         window.cityData=data
         res(data)
       })
     }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;  
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
      color: turquoise;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading{
      height: 290px;
      width: 100%;
      background: url('../../assets/images/loading.gif') no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>