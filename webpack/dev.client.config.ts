const commonDev = {
	/*** removable example of socket.io use, @see server/server.ts && client/app.ts ***/
	devServer: {
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3000',
				secure: false
			}
		}
	},
	/*********************************************************************************/
	devtool: 'source-map',
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
		{
			test: /\.scss$/,
			use: [{
				loader: 'style-loader' // creates style nodes from JS strings
			}, {
				loader: 'css-loader' // translates CSS into CommonJS
			}, {
				loader: 'sass-loader' // compiles Sass to CSS
			}]
		}]
	}
};

module.exports = [
	Object.assign({}, commonDev, {
		entry: ['./server/server.ts'],
		output: {
			filename: './dist/server.js'
		},
		target: 'node',
		externals: require('webpack-node-externals')()
	}),
	Object.assign({}, commonDev, {
		entry: ['./client/app.ts', './client/styles.scss'],
		output: {
			filename: './public/script/bundle.js'
		}
	})
];
