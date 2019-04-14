const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
  	plugins: [
  		new CopyWebpackPlugin([{ from: 'src/theme/favicon.png', to: 'public/favicon.png' }])
  	],
  	devServer: {
  		disableHostCheck: true
  	}
  },
  css: {
  	loaderOptions: {
  		sass: {
  			precision: 10
  		}
  	}
  }
}