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
    chainWebpack: config => {
        //图片转为base64配置
        config.module.rule('images').use('url-loader').loader('url-loader').tap(options => Object.assign(options, { limit: 10000 }))

        //开启ip访问webpack开启的服务器
        config.devServer.disableHostCheck(true)
    },
    configureWebpack: {
        externals: {
            qc: 'QC'
        }
    }
}