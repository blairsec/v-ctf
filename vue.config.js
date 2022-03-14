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
        allowedHosts: 'all',
        host: '0.0.0.0',
        port: 8080
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
