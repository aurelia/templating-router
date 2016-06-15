'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata'], function (_export, _context) {
  "use strict";

  var inject, CompositionEngine, RouteLoader, Router, relativeToFile, Origin, _dec, _class, TemplatingRouteLoader;

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

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
      _export('TemplatingRouteLoader', TemplatingRouteLoader = (_dec = inject(CompositionEngine), _dec(_class = function (_RouteLoader) {
        _inherits(TemplatingRouteLoader, _RouteLoader);

        function TemplatingRouteLoader(compositionEngine) {
          

          var _this = _possibleConstructorReturn(this, _RouteLoader.call(this));

          _this.compositionEngine = compositionEngine;
          return _this;
        }

        TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
          var childContainer = router.container.createChild();
          var instruction = {
            viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
            childContainer: childContainer,
            view: config.view || config.viewStrategy,
            router: router
          };

          childContainer.getChildRouter = function () {
            var childRouter = void 0;

            childContainer.registerHandler(Router, function (c) {
              return childRouter || (childRouter = router.createChild(childContainer));
            });

            return childContainer.get(Router);
          };

          return this.compositionEngine.ensureViewModel(instruction);
        };

        return TemplatingRouteLoader;
      }(RouteLoader)) || _class));

      _export('TemplatingRouteLoader', TemplatingRouteLoader);
    }
  };
});