//home下的api接口

import request from "@/utils/request";
/* 获取品牌函数 */
export const findBrand = (limit = 6) => { //limit默认6
    return request('/home/brand', 'get', { limit })
}

/* 获取轮播图数据 */
export const findBanner = () => {
    return request('/home/banner', 'get')
}

/* 获取新鲜好物 */
export const findNew = () => {
    return request('/home/new', 'get')
}

/* 获取人气推荐 */
export const findHot = () => {
    return request('/home/hot', 'get')
}

/* 获取热门品牌 */
export const findBrandList = (limit = 5) => {
    return request('/home/brand', 'get', { limit })
}

/* 获取商品模块 */
export const findProduct = () => {
    return request('/home/goods', 'get')
}

/* 获取最新专题 */
export const findSpecial = () => {
    return request('/home/special', 'get')
}

/* 根据id获取顶级分类信息 里面的children属性就是各个字分类*/
export const findTopCategory = (id) => {
    return request('/category', 'get', { id })
}

export const findSubCategoryFilter = (id) => {
    return request('/category/sub/filter', 'get', { id })
}


export const findSubCategoryGoods = (params) => {
    return request('/category/goods', 'post', { params })
}