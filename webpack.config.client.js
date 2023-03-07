const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const typescriptPlugin = require('@babel/plugin-transform-typescript');

const configUtil = require('./webpack.config.util.js');

module.exports = {
	name: 'client',
	mode: configUtil.mode,
	target: 'web',
	devtool: 'inline-source-map',
	entry: {
		AccountApp: path.resolve('./src/apps/account/client.jsx'),
		WorkspaceApp: path.resolve('./src/apps/workspace/client.tsx'),
	},
	output: {
		path: path.resolve(__dirname, 'dist/client'),
		filename: configUtil.isDev ? '[name].js' : '[name].[hash:8].js',
		chunkFilename: configUtil.isDev ? '[name].js' : '[name].[hash:8].js',
		publicPath: '/',
	},
	resolve: configUtil.resolve,
	module: {
		rules: [
			{
				test: /\.(jsx|js|tsx|ts)$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src'),
				use: [
					{
						loader: 'babel-loader',
						options: {
							//presets: ['@babel/preset-typescript'],
							cacheDirectory: true,
							//plugins: [typescriptPlugin],
						},
					},
				],
			},
			configUtil.extractCssRule,
			configUtil.extractNodeCssRule,
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(configUtil.mode),
		}),
		new MiniCssExtractPlugin({
			filename: configUtil.isDev ? '[name].css' : '[name].[contenthash].css',
		}),
		new ManifestPlugin(),
	],
};