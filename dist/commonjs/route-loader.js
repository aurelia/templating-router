"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var CompositionEngine = require("aurelia-templating").CompositionEngine;

var _aureliaRouter = require("aurelia-router");

var RouteLoader = _aureliaRouter.RouteLoader;
var Router = _aureliaRouter.Router;

var relativeToFile = require("aurelia-path").relativeToFile;

var Origin = require("aurelia-metadata").Origin;

var TemplatingRouteLoader = exports.TemplatingRouteLoader = (function (RouteLoader) {
  function TemplatingRouteLoader(compositionEngine) {
    _classCallCheck(this, TemplatingRouteLoader);

    this.compositionEngine = compositionEngine;
  }

  _inherits(TemplatingRouteLoader, RouteLoader);

  _prototypeProperties(TemplatingRouteLoader, {
    inject: {
      value: function inject() {
        return [CompositionEngine];
      },
      writable: true,
      configurable: true
    }
  }, {
    loadRoute: {
      value: function loadRoute(router, config) {
        var childContainer = router.container.createChild(),
            instruction = {
          viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
          childContainer: childContainer,
          view: config.view
        },
            childRouter;

        childContainer.registerHandler(Router, function (c) {
          return childRouter || (childRouter = router.createChild(childContainer));
        });

        return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
          instruction.executionContext = instruction.viewModel;
          instruction.router = router;
          return instruction;
        });
      },
      writable: true,
      configurable: true
    }
  });

  return TemplatingRouteLoader;
})(RouteLoader);

Object.defineProperty(exports, "__esModule", {
  value: true
});