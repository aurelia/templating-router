'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Router$AppRouter$RouteLoader = require('aurelia-router');

var _TemplatingRouteLoader = require('./route-loader');

var _RouterView = require('./router-view');

function install(aurelia) {
  aurelia.withSingleton(_Router$AppRouter$RouteLoader.RouteLoader, _TemplatingRouteLoader.TemplatingRouteLoader).withSingleton(_Router$AppRouter$RouteLoader.Router, _Router$AppRouter$RouteLoader.AppRouter).globalizeResources('./router-view');
}

exports.TemplatingRouteLoader = _TemplatingRouteLoader.TemplatingRouteLoader;
exports.RouterView = _RouterView.RouterView;
exports.install = install;