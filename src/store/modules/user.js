//用户模块

export default {
    namespaced: true,
    state() {
        return {
            //用户信息
            userInfo: {
                //用户id
                id: '1',
                //用户头像
                avatar: '',
                //用户名称
                nickname: '',
                //用户账户
                account: '',
                //用户手机号
                mobile: '',
                //用户token
                token: ''
            }
        }
    },
    mutations: {
        setUser(state, payload) {
            state.userInfo = payload
        }
    }
}