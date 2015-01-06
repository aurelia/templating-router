System.register(["aurelia-templating", "aurelia-router"], function (_export) {
  "use strict";

  var ResourceCoordinator, RouteLoader, _inherits, TemplatingRouteLoader;
  return {
    setters: [function (_aureliaTemplating) {
      ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
    }, function (_aureliaRouter) {
      RouteLoader = _aureliaRouter.RouteLoader;
    }],
    execute: function () {
      _inherits = function (child, parent) {
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

      TemplatingRouteLoader = (function () {
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
      _export("TemplatingRouteLoader", TemplatingRouteLoader);
    }
  };
});