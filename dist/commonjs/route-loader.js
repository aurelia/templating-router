'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _inject = require('aurelia-dependency-injection');

var _CompositionEngine = require('aurelia-templating');

var _RouteLoader$Router = require('aurelia-router');

var _relativeToFile = require('aurelia-path');

var _Origin = require('aurelia-metadata');

var TemplatingRouteLoader = (function (_RouteLoader) {
  function TemplatingRouteLoader(compositionEngine) {
    _classCallCheck(this, _TemplatingRouteLoader);

    _RouteLoader.call(this);
    this.compositionEngine = compositionEngine;
  }

  _inherits(TemplatingRouteLoader, _RouteLoader);

  var _TemplatingRouteLoader = TemplatingRouteLoader;

  _TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild(),
        instruction = {
      viewModel: _relativeToFile.relativeToFile(config.moduleId, _Origin.Origin.get(router.container.viewModel.constructor).moduleId),
      childContainer: childContainer,
      view: config.view || config.viewStrategy
    };

    childContainer.getChildRouter = function () {
      var childRouter;

      childContainer.registerHandler(_RouteLoader$Router.Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(_RouteLoader$Router.Router);
    };

    return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
      instruction.executionContext = instruction.viewModel;
      instruction.router = router;
      return instruction;
    });
  };

  TemplatingRouteLoader = _inject.inject(_CompositionEngine.CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
  return TemplatingRouteLoader;
})(_RouteLoader$Router.RouteLoader);

exports.TemplatingRouteLoader = TemplatingRouteLoader;