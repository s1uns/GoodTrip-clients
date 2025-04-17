const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "development",
	target: "web",
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "images/[name][ext]",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],
	devServer: {
		static: path.resolve(__dirname, "dist"),
		port: 1337,
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts|jsx|js)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { runtime: "automatic" }],
							"@babel/preset-typescript",
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
};
