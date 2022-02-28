<template>
  <div class="app-topnav">
     <div class="container">
       <ul>
         <template v-if="userInfo.token">
            <li><router-link to="/member"><i class="iconfont icon-yonghu"></i>{{userInfo.account}}</router-link></li>
            <li><a @click="loginOut" href="javascript:;">退出登入</a></li>
         </template>
         <template v-else>
            <li><router-link to="/login">请先登入</router-link></li>
            <li><a href="javascript:;">免费注册</a></li>
         </template>
         <li><a href="javascript:;">我的订单</a></li>
         <li><a href="javascript:;">会员中心</a></li>
         <li><a href="javascript:;">帮助中心</a></li>
         <li><a href="javascript:;">关于我们</a></li>
         <li><a href="javascript:;"><i class="iconfont icon-shouji"></i>手机版</a></li>
       </ul>

     </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: "navbar",
  setup() {
    //获取用户的登入信息
    const store=useStore()
    const router=useRouter()
    const userInfo=computed(()=>{
      return store.state.user.userInfo
    })
    //退出登入事件
    const loginOut=()=>{
      store.commit('user/setUser',{})
      store.commit('cart/setUser',[])
      router.push('login')
    }
    return{
      userInfo,
      loginOut
    }
  },
};
</script>

<style lang="less" scoped>
.app-topnav{
  background: #333;
  ul{
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li{
      a{
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i{
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover{
          color: @xtxColor;
        }
      }
      ~ li{
        a{
          border-left: 2px solid #666;
        }
      }
    }
  }
}
//这里 ~ 的作用是给当前li的全部兄弟li的子元素a设置border-left: 2px solid #666;
</style>