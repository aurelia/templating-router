define(['exports', 'aurelia-router', './route-loader', './router-view'], function (exports, _aureliaRouter, _routeLoader, _routerView) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function install(aurelia) {
    aurelia.withSingleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).withSingleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalizeResources('./router-view');
  }

  exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
  exports.RouterView = _routerView.RouterView;
  exports.install = install;
});