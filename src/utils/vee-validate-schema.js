export default {
    /* 用户名校验 */
    account(newVla) {
        if (!newVla) return '请输入用户名'
            //字母开头 6-20字符之间
        if (!/^[a-zA-z]\w{5,19}$/.test(newVla)) return '字母开头且6-20个字符'
        return true
    },
    /* 密码校验 */
    password(newVla) {
        if (!newVla) return '请输入密码'
            //6-24个字符
        if (!/^\w{6,24}$/.test(newVla)) return '密码格式6-24字符'
        return true
    },
    /* 手机号校验 */
    mobile(newVal) {
        if (!newVal) return '请输入手机号'
            //1开头 3-9之间 9个数字
        if (!/^1[3-9]\d{9}/.test(newVal)) return '手机号格式不正确'
        return true
    },
    /* 短信校验 */
    code(newVal) {
        if (!newVal) return '请输入短信验证码'
            //6个数字
        if (!/^\d{6}$/.test(newVal)) return '短信验证码6个数字'
        return true
    },
    isAgree(newVal) {
        if (!newVal) return '请勾选登入协议'
        return true
    }
}