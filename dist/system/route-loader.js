System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata'], function (_export) {
  var inject, CompositionEngine, RouteLoader, Router, relativeToFile, Origin, _classCallCheck, _createClass, _get, _inherits, TemplatingRouteLoader;

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
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
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      TemplatingRouteLoader = (function (_RouteLoader) {
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
              viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
              childContainer: childContainer,
              view: config.view || config.viewStrategy
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
          }
        }]);

        _export('TemplatingRouteLoader', TemplatingRouteLoader = inject(CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader);

        return TemplatingRouteLoader;
      })(RouteLoader);

      _export('TemplatingRouteLoader', TemplatingRouteLoader);
    }
  };
});