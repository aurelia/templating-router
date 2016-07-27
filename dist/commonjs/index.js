'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaTemplatingRouter = require('./aurelia-templating-router');

Object.keys(_aureliaTemplatingRouter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaTemplatingRouter[key];
    }
  });
});