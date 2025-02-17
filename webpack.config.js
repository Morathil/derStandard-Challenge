/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const IS_RELEASE = !!process.env.RELEASE

let entries = {
  app: path.resolve(__dirname, 'src/index.tsx')
}

let plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    filename: 'index.html',
    inject: 'body',
    chunks: ['app']
  })
]

module.exports = {
  mode: IS_RELEASE ? 'production' : 'development',
  devServer: {
    static: './dist',
    hot: true
  },
  entry: entries,
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src/'),
      views: path.resolve(__dirname, 'src/views/'),
      services: path.resolve(__dirname, 'src/services/')
    }
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  plugins: plugins
}
