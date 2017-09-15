const nodeExternals = require('webpack-node-externals');

const common = {
	devtool: 'source-map',
	resolve: {
		// Add '.ts' as a resolvable extension.
		extensions: ['.ts', '.js', '.css', '.scss']
	},
	module: {
		rules: [
		// all files with a '.ts'  extension will be handled by `ts-loader`
			{
				test: /\.ts$/, loader: 'ts-loader'
			},
			{
				test: /\.mp3$/, loader: 'file-loader'
			},
			{
			test: /\.scss$/,
				use: [{
						loader: 'style-loader' // creates style nodes from JS strings
				}, {
						loader: 'css-loader' // translates CSS into CommonJS
				}, {
						loader: 'sass-loader' // compiles Sass to CSS
				}]
			}
		]
	}
};

const frontend = {
		entry: ['./client/client.ts', './client/styles.scss'],
		output: {
				filename: './public/script/bundle.js'
		}
};

const backend = {
		entry: [
				'./server/server.ts'
		],
		output: {
				filename: './dist/server.js'
		},
		target: 'node',
		externals: [nodeExternals()]
};

module.exports = [
	Object.assign({} , common, frontend),
	Object.assign({} , common, backend)
];
