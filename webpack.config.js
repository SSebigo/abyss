const path = require("path");

module.exports = {
  target: "electron-main",
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".json"] },
  node: {
    fs: "empty"
  },
  externals: {
    "fluent-ffmpeg": "fluent-ffmpeg"
  }
};
