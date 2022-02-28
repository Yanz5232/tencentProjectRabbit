<template>
  <Form ref="formRef" :validation-schema="schema" v-slot="{errors}" class="xtx-form">
    <div class="user-info">
      <img :src="userInfo.userImg" alt="" />
      <p>Hi，{{ userInfo.userName }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-shouji"></i>
        <Field :class="{err:errors.mobile}" class="input" v-model="form.mobile" name='mobile' type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-anquanbaozhang-xianxing"></i>
        <Field :class="{err:errors.code}" name='code' v-model="form.code"  class="input" type="text" placeholder="短信验证码" />
        <span @click="code" class="code">{{times==0?'发送验证码':times}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import schema1 from'@/utils/vee-validate-schema.js'
import {Form ,Field} from'vee-validate'
import QC from'qc'
import { getCurrentInstance, reactive, ref } from 'vue'
import { QQLogin, userMobileLogin } from '@/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'CallbackBind',
  props: ['unionId'],
  components:{
    Form ,
    Field
  },
  setup(props){
    const schema=schema1
    const formRef=ref(null)
    const store=useStore()
    const form=reactive({
      mobile:null,
      code:null,
    })
    const userInfo=reactive({
      userImg:null,
      userName:null
    })
    if(QC.Login.check()){
      QC.api('get_user_info').success(res=>{
        userInfo.userImg=res.data.figureurl_1
        userInfo.userName=res.data.nickname
      })
    }
    const {proxy}=getCurrentInstance()
    const times=ref(0)
    const router=useRouter()
    const code=async ()=>{
        if(schema.mobile(form.mobile)==true){
          if(times.value==0){
            await userMobileLogin(form.mobile)
            proxy.$message('success','验证码发送成功')
            times.value=60
            /* pause暂停 resume开始 */
            var {pause}=useIntervalFn(()=>{
              times.value--
              times.value==0?pause():null
            },1000)//回调函数 1秒执行一次 不立即开启
          }
        }else{
              formRef.value.setFieldError('mobile',schema.mobile(form.mobile))
        }
    }
    const submit=async ()=>{
      const valid =await formRef.value.validate()
      if(valid){
        QQLogin(props.unionId,form.mobile,form.code).then(res=>{
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
        formRef.value.setFieldError('mobile',schema.mobile(form.mobile))
        formRef.value.setFieldError('code',schema.code(form.code))
      }
    }
    return{
      userInfo,
      schema,
      form,
      code,
      times,
      formRef,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
@import url('../../../assets/styles/common.less');
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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