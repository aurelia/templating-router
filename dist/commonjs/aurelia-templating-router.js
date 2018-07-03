'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.RouteHref = exports.RouterView = exports.TemplatingRouteLoader = undefined;

var _aureliaRouter = require('aurelia-router');

var _routeLoader = require('./route-loader');

var _routerView = require('./router-view');

var _routeHref = require('./route-href');

function configure(config) {
  config.singleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources(_routerView.RouterView, _routeHref.RouteHref);

  config.container.registerAlias(_aureliaRouter.Router, _aureliaRouter.AppRouter);
}

exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
exports.RouterView = _routerView.RouterView;
exports.RouteHref = _routeHref.RouteHref;
exports.configure = configure;