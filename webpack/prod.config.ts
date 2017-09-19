const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonProd = {
	resolve: {
		// Add '.ts' as a resolvable extension.
		extensions: ['.ts', '.js', '.css', '.scss']
	},
	module: {
		rules: [{
			test: /\.ts$/, loader: 'ts-loader'
		},
		{
			test: /\.mp3$/, loader: 'file-loader'
		},
		{ // sass / scss loader for webpack
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader']
			})
		}]
	},
	plugins: [
		new ExtractTextPlugin({ // define where to save the file
			filename: './public/styles/bundle.css',
			allChunks: true
		}),
		new CopyWebpackPlugin([
			{ from: './index.html', to: './dist/index.html' },
			{ from: './public', to: './dist/public' }
		], {
			copyUnmodified: true
		})
	]
};
module.exports = [
	Object.assign({}, commonProd, {
		entry: ['./server/server.ts'],
		output: {
			filename: './dist/server.js'
		},
		target: 'node',
		node: {
			__dirname: false,
			__filename: false
		},
		externals: require('webpack-node-externals')()
	}),
	Object.assign({}, commonProd, {
		entry: ['./client/app.ts', './client/styles.scss'],
		output: {
			filename: './public/script/bundle.js'
		}
	})
];
