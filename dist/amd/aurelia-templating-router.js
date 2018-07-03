define(['exports', 'aurelia-router', './route-loader', './router-view', './route-href'], function (exports, _aureliaRouter, _routeLoader, _routerView, _routeHref) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.RouteHref = exports.RouterView = exports.TemplatingRouteLoader = undefined;


  function configure(config) {
    config.singleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources(_routerView.RouterView, _routeHref.RouteHref);

    config.container.registerAlias(_aureliaRouter.Router, _aureliaRouter.AppRouter);
  }

  exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
  exports.RouterView = _routerView.RouterView;
  exports.RouteHref = _routeHref.RouteHref;
  exports.configure = configure;
});