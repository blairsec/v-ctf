const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
  	plugins: [
  		new CopyWebpackPlugin({
            patterns: [{ from: 'src/theme/favicon.png', to: 'public/favicon.png' }]
        })
  	],
  	devServer: {
  		disableHostCheck: true
  	}
  },
  css: {
  	loaderOptions: {
  		sass: {
            sassOptions: {
                precision: 10
            }
  		}
  	}
  }
}
