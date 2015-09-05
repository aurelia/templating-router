System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata'], function (_export) {
  'use strict';

  var inject, CompositionEngine, RouteLoader, Router, relativeToFile, Origin, TemplatingRouteLoader;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      TemplatingRouteLoader = (function (_RouteLoader) {
        _inherits(TemplatingRouteLoader, _RouteLoader);

        function TemplatingRouteLoader(compositionEngine) {
          _classCallCheck(this, _TemplatingRouteLoader);

          _RouteLoader.call(this);
          this.compositionEngine = compositionEngine;
        }

        TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
          var childContainer = router.container.createChild();
          var instruction = {
            viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
            childContainer: childContainer,
            view: config.view || config.viewStrategy
          };

          childContainer.getChildRouter = function () {
            var childRouter = undefined;

            childContainer.registerHandler(Router, function (c) {
              return childRouter || (childRouter = router.createChild(childContainer));
            });

            return childContainer.get(Router);
          };

          return this.compositionEngine.createViewModel(instruction).then(function (ins) {
            ins.bindingContext = ins.viewModel;
            ins.router = router;
            return ins;
          });
        };

        var _TemplatingRouteLoader = TemplatingRouteLoader;
        TemplatingRouteLoader = inject(CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
        return TemplatingRouteLoader;
      })(RouteLoader);

      _export('TemplatingRouteLoader', TemplatingRouteLoader);
    }
  };
});