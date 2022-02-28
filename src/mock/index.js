import Mock from "mockjs";
import qs from 'qs'
import t1 from '@/assets/images/1.jpg'
import t2 from '@/assets/images/2.jpg'
import t3 from '@/assets/images/3.jpg'
import t4 from '@/assets/images/4.jpg'
import t5 from '@/assets/images/5.jpg'
import t6 from '@/assets/images/6.jpg'
import t7 from '@/assets/images/7.jpg'
import t8 from '@/assets/images/8.jpg'
//基本配置
Mock.setup({
    timeout: '500-1000'
})

//拦截接口 /my/test
//1.接口地址路劲规则，需要匹配到它
//2.请求方式
//3.返回数据（函数返回数据）
Mock.mock(/\/my\/test/, 'get', () => {
    const arr = []
    for (let i = 0; i < 4; i++) {
        arr.push()
    }
    return { msg: '获取参数成功', result: arr }
})

Mock.mock(/\/member\/collect/, 'get', (config) => {
    const counts = 35
    const queryString = config.url.split('?')[1]
    const queryObject = qs.parse(queryString)
    const item = []
    const imgs = [t1, t2, t3, t4, t5, t6, t7, t8]
    for (let i = 0; i < 0 + queryObject.pageSize; i++) {
        let a = Mock.mock('@integer(0,7)')
        let img = imgs[a]
        item.push(Mock.mock({
            id: '@id',
            name: '@ctitle(10,20)',
            description: '@ctitle(4,10)',
            price: '@float(100,200,2,2)',
            //imgs['@integer(0,7)']
            picture: img
        }))
    }
    return {
        msg: '获取收藏商品成功',
        result: {
            counts,
            pageSize: 0 + queryObject.pageSize,
            page: 0 + queryObject.page,
            item
        }
    }
})