//商品祥情
import request from "@/utils/request";

export const findGoods = (id) => {
    return request('/goods', 'get', { id })
}

/**
 * 
 * @param {商品id} id 
 * @param {查询数量} limit 
 */
export const findRelevantGoods = (id, limit = 16) => {
    return request('/goods/relevant', 'get', { id, limit })
}

export const findGoodsHot = (id, type, limit = 3) => {
    return request('/goods/hot', 'get', { id, type, limit })
}

export const findGoodsCommentInfo = (id) => {
    return request(`/goods/${id}/evaluate`, 'get')
}

export const findGoodsCommentList = (id, reqParams) => {
    return request(` /goods/${id}/evaluate/page`, 'get', reqParams)
}