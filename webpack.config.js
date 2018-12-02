var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/public/index.html',
  filename: 'index.html',
  inject: 'body'
});


module.exports = {
  devServer: {
    port: 8080,
    proxy: { "/api/**": { target: 'http://localhost:3001', secure: false }}
  },
  entry: __dirname + '/src/client/index.jsx',
  resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/react']
        }
      }, {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [HTMLWebpackPluginConfig]
};
