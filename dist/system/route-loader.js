System.register(["aurelia-templating", "aurelia-router", "aurelia-path", "aurelia-metadata"], function (_export) {
  "use strict";

  var CompositionEngine, RouteLoader, Router, relativeToFile, Origin, _inherits, TemplatingRouteLoader;
  return {
    setters: [function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
    }, function (_aureliaRouter) {
      RouteLoader = _aureliaRouter.RouteLoader;
      Router = _aureliaRouter.Router;
    }, function (_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }, function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
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
        var TemplatingRouteLoader = function TemplatingRouteLoader(compositionEngine) {
          this.compositionEngine = compositionEngine;
        };

        _inherits(TemplatingRouteLoader, _RouteLoader);

        TemplatingRouteLoader.inject = function () {
          return [CompositionEngine];
        };

        TemplatingRouteLoader.prototype.loadRoute = function (router, config) {
          var childContainer = router.container.createChild(), instruction = {
            viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
            childContainer: childContainer,
            view: config.view
          }, childRouter;

          childContainer.registerHandler(Router, function (c) {
            return childRouter || (childRouter = router.createChild(childContainer));
          });

          return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
            instruction.executionContext = instruction.viewModel;
            instruction.router = router;
            return instruction;
          });
        };

        return TemplatingRouteLoader;
      })();
      _export("TemplatingRouteLoader", TemplatingRouteLoader);
    }
  };
});