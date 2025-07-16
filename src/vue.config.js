module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      const scssRule = config.module.rule('scss')
      scssRule.uses.clear()
      scssRule.use('null-loader').loader('null-loader')
    }
    config.module
    .rule('rules')
    .test(/\.(png|jpe?g|gif|svg|cur)(\?.*)?$/)
    .use('url-loader')
      .loader('url-loader')
      .end()
  },
}
