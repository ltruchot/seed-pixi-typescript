module.exports = {
	entry: ['./server/server.ts'],
	output: {
		filename: './dist/server.js'
	},
	target: 'node',
	externals: require('webpack-node-externals')(),
	devtool: 'source-map',
	resolve: {
		// Add '.ts' as a resolvable extension.
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{
			test: /\.ts$/, loader: 'ts-loader'
		}]
	}
};
