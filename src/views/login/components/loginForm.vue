<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formRef" class="form" :validation-schema="schema" v-slot="{errors}" autocomplete="off"><!-- 关闭浏览器的默认提示账号 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名或手机号" />
          </div>
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码"/>
          </div>
           <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" v-model="form.mobile" name='mobile' type="text" placeholder="请输入手机号" />
          </div>
           <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type="password" placeholder="请输入验证码"/>
            <span @click="send" class="code">{{times==0?'发送验证码':times+'秒后'}}</span>
          </div>
           <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as='XtxCheckbox' name='isAgree' v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
         <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click='login' href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <!-- <span id='qqLoginBtn'></span> -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { ref,reactive, watch, getCurrentInstance, onUnmounted, onMounted } from "vue"
import {Form ,Field} from'vee-validate'
import schema1 from'@/utils/vee-validate-schema.js'
import {userAccountLogin, userMobileLogin, userMobileLoginMeg} from'@/api/user.js'
import { useStore } from "vuex"
import {useRoute, useRouter } from "vue-router"
import { useIntervalFn } from "@vueuse/core"
export default ({
  name:'LoginForm',
  components:{
    Form,
    Field
  },
  setup() {
    const formRef=ref(null)
    const isMsgLogin=ref(false)
    const form=reactive({
      isAgree:true,
      account:null,
      password:null,
      mobile:null,
      code:null
    })
    //vee-validate 校验基本步骤
    //1.导入 Form Field 组件 讲form 和 input 进行替换 需加上name用来 指定 将来的校验规则函数
    //2.Field 需要进行数据绑定 字段名最好和后台接口需要的一致 
    //3.定义校验规则函数 Form组件的validation-schema 接受定义好的校验规则
    const schema=schema1
   
    //切换表单切换元素
    watch(isMsgLogin,()=>{
      form.isAgree=true,
      form.account=null,
      form.password=null,
      form.mobile=null,
      form.code=null
      //清除表单的校验结果
      formRef.value.resetForm()
    })
    const store=useStore()
    const router=useRouter()
    const route=useRoute()
    /* 拿到当前组件实例 */
    const {proxy}=getCurrentInstance()
    const times=ref(0)
    //发送验证码单击事件
    const send=async ()=>{
      if(times.value==0){
         if(schema.mobile(form.mobile)==true){
          await userMobileLogin(form.mobile)
          proxy.$message('success','短信验证码发送成功')
          times.value=60
          /* pause暂停 resume开始 */
          var {pause}=useIntervalFn(()=>{
            times.value--
            times.value==0?pause():null
          },1000)//回调函数 1秒执行一次 不立即开启
        }else{
          formRef.value.setFieldError('mobile',schema.mobile(form.mobile))
        }
      }
    }
    const login=async ()=>{
       //Form 组件提供了一个 validate函数作为整体表单校验 返回的是一个promise
       const valid =await formRef.value.validate()
       //通过表单校验
       if(valid){
         try{
           let data=null
           if(isMsgLogin.value){
             //手机号登入
             const {mobile,code}=form
             data=await userMobileLoginMeg(mobile,code)                
           }else{
             //账号登入
             const {account,password}=form
             data=await userAccountLogin(account,password)
           }
           const {id,account,avatar,mobile,nickname,token}=data.result
           //把信息存到vuex中
           store.commit('user/setUser',{id,account,avatar,mobile,nickname,token})
           store.dispatch('cart/mergeCart').then(res=>{
             //从哪来跳回哪里
             router.push(route.params.redirectUrl || '/')
             proxy.$message('success','登入成功')
           })
           
         }catch(e){
           if(e.response.data){
              console.log(11);
              proxy.$message('error',e.response.data.message||'登入失败')
           }
         }
       }
    }
    return{
      isMsgLogin,
      form,
      schema,
      formRef,
      login,
      send,
      times
    }
  },
})
</script>

<style scoped lang='less'>
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>