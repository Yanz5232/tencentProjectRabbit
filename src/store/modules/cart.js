//购物车
import { checkAllCart, deleteCart, findCart, findGoods, insertCart, updateCart } from "@/api/cart"
import { Promise } from "core-js"
import { mergeCart } from "@/api/cart"
export default {
    namespaced: true,
    state() {
        return {
            //购物车商品列表
            list: []
        }
    },
    getters: {
        /* 有效商品列表 */
        validList(state) {
            return state.list.filter(good => good.stock > 0 && good.isEffective)
        },
        /* 有效商品总件数 */
        validTotal(state, getters) {
            return getters.validList.reduce((p, good) => p + good.count, 0)
        },
        /* 有效商品总金额 */
        validMount(state, getters) {
            return getters.validList.reduce((p, good) => p + parseInt(good.nowPrice * 100) * good.count, 0) / 100
        },
        /* 无效商品列表 */
        inValidList(state, getters) {
            return state.list.forEach(item => item.stock <= 0 || item.isEffective)
        },
        /* 已选商品列表 */
        selectedtList(state, getters) {
            return getters.validList.filter(item => item.selected)
        },
        /* 已选商品总件数 */
        selectedTotal(state, getters) {
            return getters.selectedtList.reduce((p, good) => p + good.count, 0)
        },
        /* 已选商品总金额 */
        selectedMount(state, getters) {
            return getters.selectedtList.reduce((p, good) => p + parseInt(good.nowPrice * 100) * good.count, 0) / 100
        },
        /* 是否全选 */
        isCheckAll(state, getters) {
            if (getters.validList.length == 0) return false
            return getters.selectedtList.length === getters.validList.length
        }
    },
    mutations: {
        /* 添加购物车商品 */
        insertCart(state, object) {
            const sameIndex = state.list.findIndex(goods => goods.skuId === object.skuId)
            if (sameIndex > -1) {
                const count = state.list[sameIndex].count
                object.count += count
                    /* 删除原来商品 */
                state.list.splice(sameIndex, 1)
            }
            /* 追加新的 */
            state.list.unshift(object)
        },
        /* 修改购物车商品 */
        updateCart(state, goods) {
            const updateGood = state.list.find(item => item.skuId == goods.skuId)
            for (let key in goods) {
                if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
                    updateGood[key] = goods[key]
                }
            }
        },
        /* 删除购物车商品 */
        deleteCart(state, skuId) {
            const index = state.list.findIndex(item => item.skuId == skuId)
            state.list.splice(index, 1)
        },
        /* 设置购物车 */
        setCart(state, payload) {
            state.list = payload
        }
    },
    actions: {
        /* 合并购物车 */
        mergeCart(ctx) {
            const cartList = ctx.state.list.map(good => {
                return {
                    skuId: good.skuId,
                    selected: good.selected,
                    count: good.count
                }
            })
            cartList.splice(cartList.length - 1, 1)
            mergeCart(cartList).then(res => {
                ctx.commit('setCart', [])
            })
        },
        /* 修改规格 */
        updateCartSku(ctx, { oldSkuId, newSku }) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    const oldGoods = ctx.state.list.find(item => item.skuId == oldSkuId)
                    deleteCart([oldGoods.skuId]).then(res => {
                        return insertCart(newSku.skuId, oldGoods.count)
                    }).then(res => {
                        return findCart()
                    }).then(res => {
                        ctx.commit('setCart', res.result)
                        resolve()
                    })
                } else {
                    /* 未登入 */
                    const oldGoods = ctx.state.list.find(item => item.skuId == oldSkuId)
                    ctx.commit('deleteCart', oldSkuId)
                    const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
                    const newGoods = {...oldGoods, skuId, nowPrice, attrsText, stock }
                    ctx.commit('insertCart', newGoods)
                    resolve()
                }
            })
        },
        /* 批量删除无效商品 */
        batchDeleteInvalidCart(ctx) {
            ctx.getters.inValidList.forEach(item => {
                ctx.commit('deleteCart', item.skuId)
            })
        },
        /* 批量删除 */
        batchDeleteCart(ctx) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    const ids = ctx.getters.validList.map(item => {
                        if (item.selected) return item.skuId
                    })
                    deleteCart(ids).then(res => {
                        return findCart()
                    }).then(res => {
                        ctx.commit('setCart', res.result)
                        resolve()
                    })
                    resolve()
                } else {
                    /* 未登入 */
                    ctx.getters.validList.forEach(item => {
                        if (item.selected) ctx.commit('deleteCart', item.skuId)
                    })
                    resolve()
                }
            })
        },
        /* 全选与取消全选 */
        changeGoodsSelected(ctx, selected) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    const ids = ctx.getters.validList.map(item => item.skuId)
                    checkAllCart(selected, ids).then(res => {
                        return findCart()
                    }).then(res => {
                        ctx.commit('setCart', res.result)
                        resolve()
                    })
                } else {
                    /* 未登入 */
                    ctx.getters.validList.forEach(item => {
                        ctx.commit('updateCart', { skuId: item.skuId, selected })
                    })
                    resolve()
                }
            })
        },
        /* 修改购物车（选中状态 选中数量） */
        updateCart(ctx, payload) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    updateCart(payload).then(res => {
                        return findCart()
                    }).then(res => {
                        ctx.commit('setCart', res.result)
                        resolve()
                    })
                } else {
                    /* 未登入 */
                    ctx.commit('updateCart', payload)
                    resolve()
                }
            })
        },
        /* 加入购物车 */
        insertCart(ctx, object) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    insertCart(object.skuId, object.count).then(res => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    /* 未登入 */
                    ctx.commit('insertCart', object)
                    resolve()
                }
            })
        },
        /* 获取商品列表 */
        findCart(ctx) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    findCart().then(res => {
                        ctx.commit('setCart', res.result)
                    })
                } else {
                    /* 未登入 */
                    /* Promise.all(promise数组).then((dataList)=>{})有几个商品发送几次请求 等所有请求成功 一并去修改数据 */
                    // promise.race(promise数组).then((dara)=>{}) 同时发送请求最快的哪一个成功
                    const promiseAll = ctx.state.list.map(good => {
                        return findGoods(good.skuId)
                    })
                    Promise.all(promiseAll).then((dataList) => {
                        dataList.forEach((good, index) => {
                            good.result.skuId = ctx.state.list[index].skuId
                            ctx.commit('updateCart', good.result)
                        })
                        resolve()
                    })

                }
            })
        },
        /* 删除购物车 */
        deleteCart(ctx, payload) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.userInfo.token) {
                    /* 登入 */
                    console.log([payload]);
                    deleteCart([payload]).then(res => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    /* 未登入 */
                    ctx.commit('deleteCart', object.skuId)
                    resolve()
                }
            })

        }
    }
}