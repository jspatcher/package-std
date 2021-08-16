const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    index: './src/index.ts',
    "index.jspatpkg": './src/index.jspatpkg.ts',
    "index.jsdsppkg.main": './src/index.jsdsppkg.main.ts',
    "index.jsdsppkg.aw": './src/index.jsdsppkg.aw.ts'
  },
  resolve: {
    fallback: {
      "util": require.resolve("util")
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  node: {
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "",
    libraryTarget: 'commonjs',
    chunkFilename: 'js/[chunkhash].js'
  },
  module: {
    rules: [{
        test: /\.worklet\.(ts|js)$/,
        use: [{
          loader: 'worklet-loader',
          options: {
            name: 'js/[fullhash].worklet.js'
          }
        }],
        exclude: /node_modules/
      }, {
        test: /\.(ts|js)x?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  // watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
};
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.output.filename = '[name].js';
  }
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
    config.output.filename = '[name].min.js';
  }
  return config;
};