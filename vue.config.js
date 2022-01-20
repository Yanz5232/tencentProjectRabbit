const path = require('path')

module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: {},
    pluginOptions: {
        //自动往每个vue组件中引入样式文件
        'style-resources-loader': {
            //样式文件为less文件
            preProcessor: 'less',
            //哪些文件自动引入
            patterns: [
                path.join(__dirname, './src/assets/css/mixins.less'),
                path.join(__dirname, './src/assets/css/variables.less'),
            ]
        }
    },
    //图片转为base64配置
    chainWebpack: config => {
        config.module.rule('images').use('url-loader').loader('url-loader').tap(options => Object.assign(options, { limit: 10000 }))
    }
}