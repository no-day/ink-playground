const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: 'bundle.[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm', '.css'],
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Parity ink! Playground',
      template: './src/index.html',
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, '../../crates/playground'),
      extraArgs: '--target web -- -Z build-std=panic_abort,std',
      outDir: path.resolve(__dirname, './pkg'),
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['rust'],
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
  devServer: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
