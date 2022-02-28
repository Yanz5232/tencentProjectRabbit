<template>
  <Form ref="formRef" v-slot="{errors}" :validation-schema="schema" class="xtx-form">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-yonghu"></i>
        <Field :class="{err:errors.accountApi}" name='accountApi' v-model="userInfo.userName" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.accountApi" class="error">{{errors.accountApi}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-shouji"></i>
        <Field :class="{err:errors.mobile}" name='mobile' v-model="userInfo.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-yanzhengyanzhengma"></i>
        <Field :class="{err:errors.code}" name='code' v-model="userInfo.code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="code" class="code">{{times==0?'发送验证码':times}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-suoding"></i>
        <Field :class="{err:errors.password}" name='password' v-model="userInfo.password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-suoding"></i>
        <Field :class="{err:errors.isPassword}" name='isPassword' v-model="userInfo.isPassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.isPassword" class="error">{{errors.isPassword}}</div>
    </div>
    <a href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import schema1 from'@/utils/vee-validate-schema.js'
import {Form,Field} from'vee-validate'
import { getCurrentInstance, reactive, ref } from 'vue'
import { userQQLogin, userQQPathCode } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackPatch',
  props:['unionId'],
  components:{
    Form,
    Field
  },
  setup(){
    const userInfo=reactive({
      userName:null,
      mobile:null,
      code:null,
      password:null,
      isPassword:null
    })
    const schema=schema1
    const formRef=ref(null)
    const times=ref(0)
    const store=useStore()
    const router=useRouter()
    const {proxy}=getCurrentInstance()
    const code=async ()=>{
        if(schema.mobile(userInfo.mobile)==true){
          if(times.value==0){
            await userQQPathCode(userInfo.mobile)
            proxy.$message('success','验证码发送成功')
            times.value=60
            /* pause暂停 resume开始 */
            var {pause}=useIntervalFn(()=>{
              times.value--
              times.value==0?pause():null
            },1000)//回调函数 1秒执行一次 不立即开启
          }
        }else{
              formRef.value.setFieldError('mobile',schema.mobile(userInfo.mobile))
        }
    }
    const submit=async ()=>{
      const valid =await formRef.value.validate()
      if(valid){
        userQQPathLogin(props.unionId,userInfo.mobile,userInfo.code,userInfo.account,userInfo.password).then(res=>{
           const {id,account,avatar,mobile,nickname,token}=res.result
           //把信息存到vuex中
           store.commit('user/setUser',{id,account,avatar,mobile,nickname,token})
           store.dispatch('cart/mergeCart').then(res=>{
             //从哪来跳回哪里
             router.push(store.state.user.redirectUrl)
             proxy.$message('success','登入成功')
           })
           
        }).catch(()=>{
          proxy.$message('error','绑定失败')
        })
      }else{
        formRef.value.setFieldError('mobile',schema.mobile(userInfo.mobile))
        formRef.value.setFieldError('code',schema.code(userInfo.code))
      }
    }
    return{
      userInfo,
      schema,
      formRef,
      code,
      times,
      submit
    }
  },
}
</script>

<style scoped lang='less'>
@import url('../../../assets/styles/common.less');

.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>