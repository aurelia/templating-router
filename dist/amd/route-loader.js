define(["exports", "aurelia-templating", "aurelia-router"], function (exports, _aureliaTemplating, _aureliaRouter) {
  "use strict";

  var _inherits = function (child, parent) {
    if (typeof parent !== "function" && parent !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof parent);
    }
    child.prototype = Object.create(parent && parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (parent) child.__proto__ = parent;
  };

  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var RouteLoader = _aureliaRouter.RouteLoader;
  var TemplatingRouteLoader = (function () {
    var _RouteLoader = RouteLoader;
    var TemplatingRouteLoader = function TemplatingRouteLoader(resourceCoordinator) {
      this.resourceCoordinator = resourceCoordinator;
    };

    _inherits(TemplatingRouteLoader, _RouteLoader);

    TemplatingRouteLoader.inject = function () {
      return [ResourceCoordinator];
    };

    TemplatingRouteLoader.prototype.loadRoute = function (config) {
      return this.resourceCoordinator.loadViewModelInfo(config.moduleId);
    };

    return TemplatingRouteLoader;
  })();

  exports.TemplatingRouteLoader = TemplatingRouteLoader;
});