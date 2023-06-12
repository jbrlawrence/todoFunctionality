const path = require('path')

module.exports = {
	mode: "development",
	entry: {
		'bundle': './src/index.js',
		'bundle-auth': './src/auth.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: path.resolve(__dirname, 'dist')
	},
	watch: true
}


