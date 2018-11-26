const { AureliaPlugin } = require('aurelia-webpack-plugin');
const { resolve } = require('path');

module.exports = function configure(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['test/**/*.ts'],
    preprocessors: {
      ['test/**/*.ts']: ['webpack']
    },
    webpack: {
      mode: 'development',
      entry: { setup: './test/setup.ts' },
      resolve: {
        extensions: ['.ts', '.js'],
        modules: [
          resolve(__dirname, 'node_modules')
        ],
        alias: {
          src: resolve(__dirname, 'src'),
          test: resolve(__dirname, 'test')
        }
      },
      devtool: 'cheap-module-eval-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_modules/
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          }
        ]
      },
      plugins: [new AureliaPlugin()]
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    reporters: ['mocha', 'progress'],
    webpackServer: { noInfo: config.noInfo },
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
        debug: true
      }
    },
    singleRun: false
  });
};
