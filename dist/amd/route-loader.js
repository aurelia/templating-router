define(["exports", "aurelia-templating", "aurelia-router"], function (exports, _aureliaTemplating, _aureliaRouter) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var RouteLoader = _aureliaRouter.RouteLoader;
  var TemplatingRouteLoader = (function (RouteLoader) {
    var TemplatingRouteLoader = function TemplatingRouteLoader(resourceCoordinator) {
      this.resourceCoordinator = resourceCoordinator;
    };

    _extends(TemplatingRouteLoader, RouteLoader);

    TemplatingRouteLoader.inject = function () {
      return [ResourceCoordinator];
    };

    TemplatingRouteLoader.prototype.loadRoute = function (config) {
      return this.resourceCoordinator.loadViewModelType(config.moduleId);
    };

    return TemplatingRouteLoader;
  })(RouteLoader);

  exports.TemplatingRouteLoader = TemplatingRouteLoader;
});