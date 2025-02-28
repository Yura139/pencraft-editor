const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production"

  return {
    entry: isProduction ? "./src/example/App.tsx" : "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: isProduction ? "/pencraft-editor/" : "/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      port: 3000,
      hot: true,
      open: true,
    },
  }
}
