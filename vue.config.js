//配置合并
module.exports = {
  configureWebpack: {
    resolve: {
      // extensions:{} 配置后缀
      // 配置别名
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',

      }
    }
  }
};