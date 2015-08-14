'use strict';

exports.__esModule = true;

var _aureliaRouter = require('aurelia-router');

var _routeLoader = require('./route-loader');

var _routerView = require('./router-view');

var _routeHref = require('./route-href');

function configure(config) {
  config.singleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources('./router-view', './route-href');
}

exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
exports.RouterView = _routerView.RouterView;
exports.RouteHref = _routeHref.RouteHref;
exports.configure = configure;