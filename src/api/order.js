import request from "@/utils/request";

export const getOrder = () => {
    return request('/member/order/pre', 'get')
}

export const Addaddress = (form) => {
    return request('/member/address', 'post', form)
}

export const editAddress = (form) => {
    return request(`/member/address/${form.id}`, 'put', form)
}

export const submitOrder = (form) => {
    return request('/member/order', 'post', form)
}

export const findOrderDetail = (orderId) => {
    return request('/member/order/' + orderId, 'get')
}

export const findOrderList = ({ page = 1, pageSize = 4, orderState = 0 }) => {
    return request('/member/order/', 'get', { page, pageSize, orderState })
}

export const cancelOrder = (orderId, cancelReason) => {
    return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

export const deleteOrder = (orderId) => {
    return request(`/member/order`, 'delete', { ids: [orderId] })
}

export const confirmOrder = (orderId) => {
    return request(`/member/order/${orderId}/receipt`, 'put')
}

export const logisticsOrder = (orderId) => {
    return request(`/member/order/${orderId}/logistics`, 'get')
}

export const createOrder = (id) => {
    return request('/member/order/repurchase/' + id, 'get', )
}