'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplatingRouteLoader = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaRouter = require('aurelia-router');

var _aureliaPath = require('aurelia-path');

var _aureliaMetadata = require('aurelia-metadata');

var _routerView = require('./router-view');



function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TemplatingRouteLoader = exports.TemplatingRouteLoader = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine), _dec(_class = function (_RouteLoader) {
  _inherits(TemplatingRouteLoader, _RouteLoader);

  function TemplatingRouteLoader(compositionEngine) {
    

    var _this = _possibleConstructorReturn(this, _RouteLoader.call(this));

    _this.compositionEngine = compositionEngine;
    return _this;
  }

  TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild();

    var viewModel = /\.html/.test(config.moduleId) ? createDynamicClass(config.moduleId) : (0, _aureliaPath.relativeToFile)(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId);

    var instruction = {
      viewModel: viewModel,
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.registerSingleton(_routerView.RouterViewLocator);

    childContainer.getChildRouter = function () {
      var childRouter = void 0;

      childContainer.registerHandler(_aureliaRouter.Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(_aureliaRouter.Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  };

  return TemplatingRouteLoader;
}(_aureliaRouter.RouteLoader)) || _class);


function createDynamicClass(moduleId) {
  var _dec2, _dec3, _class2;

  var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  var DynamicClass = (_dec2 = (0, _aureliaTemplating.customElement)(name), _dec3 = (0, _aureliaTemplating.useView)(moduleId), _dec2(_class2 = _dec3(_class2 = function () {
    function DynamicClass() {
      
    }

    DynamicClass.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicClass;
  }()) || _class2) || _class2);


  return DynamicClass;
}