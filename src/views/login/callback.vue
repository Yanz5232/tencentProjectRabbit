<template>
  <LoginHeader>联合登入</LoginHeader>
  <!-- loading组件 -->
  <section class="container" v-if="isBind">
    <div class="unbind" >
      <div class="loading"></div>
    </div> 
  </section>
  <!-- 注册组件 -->
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId='unionId' />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId='unionId'/>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
import LoginHeader from "./components/loginHeader.vue";
import LoginFooter from "./components/loginFooter.vue";
import CallbackBind  from'./components/callback-bind.vue'
import CallbackPatch from'./components/callback-patch.vue'
import { getCurrentInstance, ref } from 'vue';
import QC from'qc'
import { userQQLogin } from '@/api/user';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup(){
    const hasAccount=ref(true)
    const isBind=ref(true)
    const store=useStore()
    const router=useRouter()
    const {proxy}=getCurrentInstance()
    const unionId=ref(null)
    //判断qq有没有登入
    if(QC.Login.check()){
      //第三方qq的唯一标识
      QC.Login.getMe((openId)=>{
        unionId.value=openId
         //请求小兔鲜后台做QQ登入 如果等登入成功就跳转致首页
        userQQLogin(openId).then(res=>{
            const {id,account,avatar,mobile,nickname,token}=res.result
           //把信息存到vuex中
           store.commit('user/setUser',{id,account,avatar,mobile,nickname,token})
           store.dispatch('cart/mergeCart').then(res=>{
             router.push(store.state.user.redirectUrl)
             proxy.$message('success','QQ登录成功')
           })
        }).catch((e)=>{
          isBind.value=false
        })
      })
    }
    return{
      hasAccount,
      isBind,
      unionId
    }
  }
};
</script>

<style lang='less' scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>