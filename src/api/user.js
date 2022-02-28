import request from "@/utils/request";

export const userAccountLogin = ((account, password) => {
    return request('/login', 'post', { account, password })
})

export const userMobileLogin = ((mobile) => {
    return request('/login/code', 'get', { mobile })
})

export const userMobileLoginMeg = ((mobile, code) => {
    return request('/login/code', 'post', { mobile, code })
})

export const userQQLogin = ((unionId, source = 1) => {
    return request('/login/social', 'post', { unionId, source })
})

export const QQLogin = ((unionId, mobile, code) => {
    return request('/login/social/bind', 'post', { unionId, mobile, code })
})

export const userAccountCheck = ((account) => {
    return request('/register/check', 'get', { account })
})

export const userQQPathCode = ((mobile) => {
    return request('/register/code', 'get', { mobile })
})

export const userQQPathLogin = ((unionId, mobile, code, account, password) => {
    return request(`/login/social/${unionId}/complement`, 'post', { mobile, code, account, password })
})