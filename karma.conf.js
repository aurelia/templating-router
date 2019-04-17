const { AureliaPlugin } = require('aurelia-webpack-plugin');
const { resolve } = require('path');

module.exports = function configure(config) {
  const browsers = config.browsers;
  config.set({
    frameworks: ['jasmine'],
    files: ['test/**/*.spec.ts'],
    preprocessors: {
      ['test/**/*.spec.ts']: ['webpack', 'sourcemap']
    },
    webpack: {
      mode: 'development',
      entry: './test/setup.ts',
      resolve: {
        extensions: ['.ts', '.js'],
        modules: [
          resolve(__dirname, 'node_modules')
        ],
        alias: {
          src: resolve(__dirname, 'src'),
          test: resolve(__dirname, 'test'),
          'aurelia-templating-router': resolve(__dirname, 'src/aurelia-templating-router')
        }
      },
      devtool: browsers.includes('ChromeDebugging') ? 'eval-source-map' : 'inline-source-map',
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
      plugins: [new AureliaPlugin({ aureliaApp: undefined })]
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    reporters: ['mocha'],
    webpackMiddleware: {
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: false,
        publicPath: false
      }
    },
    webpackServer: { noInfo: true },
    browsers: Array.isArray(browsers) && browsers.length > 0 ? browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: [
          '--remote-debugging-port=9333'
        ],
        debug: true
      }
    },
    mochaReporter: {
      ignoreSkipped: true
    },
    singleRun: false
  });
};
