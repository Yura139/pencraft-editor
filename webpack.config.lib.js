const path = require("path")

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
    clean: true,
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    // Виключаємо всі можливі проблемні залежності
    "agent-base": "commonjs agent-base",
    "https-proxy-agent": "commonjs https-proxy-agent",
    eslint: "commonjs eslint",
    "eslint-config-airbnb": "commonjs eslint-config-airbnb",
    typedoc: "commonjs typedoc",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json",
            },
          },
        ],
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
  optimization: {
    minimize: true,
  },
}
