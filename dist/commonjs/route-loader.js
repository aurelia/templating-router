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

var CompositionEngine = require("aurelia-templating").CompositionEngine;
var RouteLoader = require("aurelia-router").RouteLoader;
var Router = require("aurelia-router").Router;
var relativeToFile = require("aurelia-path").relativeToFile;
var Origin = require("aurelia-metadata").Origin;
var TemplatingRouteLoader = (function () {
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

exports.TemplatingRouteLoader = TemplatingRouteLoader;