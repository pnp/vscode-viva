//@ts-check

'use strict';

const path = require('path');

const config = [{
  target: 'web',
  entry: './src/webview/view/index.tsx',
  output: {
    filename: 'vscode-webview.js',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    fallback: { 
      "path": require.resolve("path-browserify")
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader'
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [],
  devServer: {
    compress: true,
    port: 9000,
    hot: true,
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }
}];

module.exports = (env, argv) => {
  for (const configItem of config) {
    configItem.mode = argv.mode;

    if (argv.mode === 'production') {
      configItem.devtool = "hidden-source-map";
    }
  }

  return config;
};