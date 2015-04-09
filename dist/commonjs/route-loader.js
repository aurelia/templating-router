'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _inject = require('aurelia-dependency-injection');

var _CompositionEngine = require('aurelia-templating');

var _RouteLoader$Router = require('aurelia-router');

var _relativeToFile = require('aurelia-path');

var _Origin = require('aurelia-metadata');

var TemplatingRouteLoader = (function (_RouteLoader) {
  function TemplatingRouteLoader(compositionEngine) {
    _classCallCheck(this, TemplatingRouteLoader);

    _get(Object.getPrototypeOf(TemplatingRouteLoader.prototype), 'constructor', this).call(this);
    this.compositionEngine = compositionEngine;
  }

  _inherits(TemplatingRouteLoader, _RouteLoader);

  _createClass(TemplatingRouteLoader, [{
    key: 'loadRoute',
    value: function loadRoute(router, config) {
      var childContainer = router.container.createChild(),
          instruction = {
        viewModel: _relativeToFile.relativeToFile(config.moduleId, _Origin.Origin.get(router.container.viewModel.constructor).moduleId),
        childContainer: childContainer,
        view: config.view || config.viewStrategy
      },
          childRouter;

      childContainer.registerHandler(_RouteLoader$Router.Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
        instruction.executionContext = instruction.viewModel;
        instruction.router = router;
        return instruction;
      });
    }
  }]);

  exports.TemplatingRouteLoader = TemplatingRouteLoader = inject(CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
  return TemplatingRouteLoader;
})(_RouteLoader$Router.RouteLoader);

exports.TemplatingRouteLoader = TemplatingRouteLoader;