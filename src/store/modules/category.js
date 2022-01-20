import { topCategory } from '@/api/constants.js'
import { findAllCategory } from '@/api/category.js'
//分类

export default {
    namespaced: true,
    state() {
        return {
            list: topCategory.map(item => {
                return {
                    name: item,
                }
            })
        }
    },
    mutations: {
        //修改分类
        setList(state, payload) {
            state.list = payload
        },
        //显示当前分类的二级分类
        showList(state, id) {
            //找到当前分类
            const newList = state.list.find(item => item.id == id)
            newList.open = true
        },
        //隐藏当前分类的二级分类
        hideList(state, id) {
            //找到当前分类
            const newList = state.list.find(item => item.id == id)
            newList.open = false
        }
    },
    actions: {
        //获取分类
        getList({ commit }) {
            findAllCategory().then(async(res) => {
                await res.result.forEach(element => {
                    element.open = false
                });
                commit('setList', res.result)
            })
        }
    }

}