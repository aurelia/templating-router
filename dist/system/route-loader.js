'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata', './router-view'], function (_export, _context) {
  "use strict";

  var inject, CompositionEngine, useView, customElement, RouteLoader, Router, relativeToFile, Origin, RouterViewLocator, _dec, _class, TemplatingRouteLoader;

  

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

  function createDynamicClass(moduleId) {
    var _dec2, _dec3, _class2;

    var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

    var DynamicClass = (_dec2 = customElement(name), _dec3 = useView(moduleId), _dec2(_class2 = _dec3(_class2 = function () {
      function DynamicClass() {
        
      }

      DynamicClass.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicClass;
    }()) || _class2) || _class2);


    return DynamicClass;
  }
  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      useView = _aureliaTemplating.useView;
      customElement = _aureliaTemplating.customElement;
    }, function (_aureliaRouter) {
      RouteLoader = _aureliaRouter.RouteLoader;
      Router = _aureliaRouter.Router;
    }, function (_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }, function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function (_routerView) {
      RouterViewLocator = _routerView.RouterViewLocator;
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

          var viewModel = /\.html/.test(config.moduleId) ? createDynamicClass(config.moduleId) : relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId);

          var instruction = {
            viewModel: viewModel,
            childContainer: childContainer,
            view: config.view || config.viewStrategy,
            router: router
          };

          childContainer.registerSingleton(RouterViewLocator);

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