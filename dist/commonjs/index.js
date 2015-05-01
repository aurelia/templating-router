'use strict';

exports.__esModule = true;

var _Router$AppRouter$RouteLoader = require('aurelia-router');

var _TemplatingRouteLoader = require('./route-loader');

var _RouterView = require('./router-view');

var _RouteHref = require('./route-href');

function configure(aurelia) {
  aurelia.withSingleton(_Router$AppRouter$RouteLoader.RouteLoader, _TemplatingRouteLoader.TemplatingRouteLoader).withSingleton(_Router$AppRouter$RouteLoader.Router, _Router$AppRouter$RouteLoader.AppRouter).globalizeResources('./router-view', './route-href');
}

exports.TemplatingRouteLoader = _TemplatingRouteLoader.TemplatingRouteLoader;
exports.RouterView = _RouterView.RouterView;
exports.RouteHref = _RouteHref.RouteHref;
exports.configure = configure;