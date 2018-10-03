const path = require('path');
const {AureliaPlugin} = require('aurelia-webpack-plugin');
// const webpackConfig = require('./test/webpack.test.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ["jasmine"],
    files: [
      { pattern: 'src/**.*', included: false,  },
      "test/setup.ts"
    ],
    preprocessors: {
      "test/setup.ts": ["webpack"]
    },
    webpack: {
      mode: "development",
      resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", "node_modules"],
        alias: {
          src: path.resolve(__dirname, "src")
        }
      },
      devtool: "cheap-module-eval-source-map",
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
        new AureliaPlugin({
          aureliaApp: undefined,
          noHtmlLoader: false,
          aureliaConfig: [
            "defaultBindingLanguage",
            "history",
            "defaultResources",
            "developmentLogging",
          ],
          // aureliaConfig: undefined,
          dist: 'es2015',
          noWebpackLoader: true,
        })
      ]
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["mocha", "progress"],
    webpackServer: { noInfo: config.noInfo },
    browsers: ["Chrome"],
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"],
        debug: true
      }
    },
    singleRun: false
  });
};
