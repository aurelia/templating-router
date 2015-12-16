'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaRouter = require('aurelia-router');

var _aureliaPal = require('aurelia-pal');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaPath = require('aurelia-path');

var logger = LogManager.getLogger('route-href');

var RouteHref = (function () {
  function RouteHref(router, element) {
    _classCallCheck(this, _RouteHref);

    this.router = router;
    this.element = element;
  }

  RouteHref.prototype.bind = function bind() {
    this.isActive = true;
    this.processChange();
  };

  RouteHref.prototype.unbind = function unbind() {
    this.isActive = false;
  };

  RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  };

  RouteHref.prototype.processChange = function processChange() {
    var _this = this;

    return this.router.ensureConfigured().then(function () {
      if (!_this.isActive) {
        return;
      }

      var href = _this.router.generate(_this.route, _this.params);
      _this.element.setAttribute(_this.attribute, href);
    })['catch'](function (reason) {
      logger.error(reason);
    });
  };

  var _RouteHref = RouteHref;
  RouteHref = _aureliaDependencyInjection.inject(_aureliaRouter.Router, _aureliaPal.DOM.Element)(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.bindable({ name: 'route', changeHandler: 'processChange' })(RouteHref) || RouteHref;
  RouteHref = _aureliaTemplating.customAttribute('route-href')(RouteHref) || RouteHref;
  return RouteHref;
})();

exports.RouteHref = RouteHref;

var SwapStrategies = (function () {
  function SwapStrategies() {
    _classCallCheck(this, SwapStrategies);
  }

  SwapStrategies.prototype.before = function before(viewSlot, previousView, callback) {
    var promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return promise.then(function () {
        return viewSlot.remove(previousView, true);
      });
    }

    return promise;
  };

  SwapStrategies.prototype['with'] = function _with(viewSlot, previousView, callback) {
    var promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return Promise.all(viewSlot.remove(previousView, true), promise);
    }

    return promise;
  };

  SwapStrategies.prototype.after = function after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  };

  return SwapStrategies;
})();

var swapStrategies = new SwapStrategies();

var RouterView = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(RouterView, [{
    key: 'swapOrder',
    decorators: [_aureliaTemplating.bindable],
    initializer: null,
    enumerable: true
  }], null, _instanceInitializers);

  function RouterView(element, container, viewSlot, router, viewLocator) {
    _classCallCheck(this, _RouterView);

    _defineDecoratedPropertyDescriptor(this, 'swapOrder', _instanceInitializers);

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.router.registerViewPort(this, this.element.getAttribute('name'));
  }

  RouterView.prototype.bind = function bind(bindingContext) {
    this.container.viewModel = bindingContext;
  };

  RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
    var _this2 = this;

    var component = viewPortInstruction.component;
    var childContainer = component.childContainer;
    var viewModel = component.viewModel;
    var viewModelResource = component.viewModelResource;
    var metadata = viewModelResource.metadata;

    var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy) {
      viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
      viewPortInstruction.controller = metadata.create(childContainer, _aureliaTemplating.BehaviorInstruction.dynamic(_this2.element, viewModel, viewFactory));

      if (waitToSwap) {
        return;
      }

      _this2.swap(viewPortInstruction);
    });
  };

  RouterView.prototype.swap = function swap(viewPortInstruction) {
    var previousView = this.view;
    var viewSlot = this.viewSlot;
    var swapStrategy = undefined;

    swapStrategy = this.swapOrder in swapStrategies ? swapStrategies[this.swapOrder] : swapStrategies.after;

    swapStrategy(viewSlot, previousView, addNextView);
    this.view = viewPortInstruction.controller.view;

    function addNextView() {
      viewPortInstruction.controller.automate();
      return viewSlot.add(viewPortInstruction.controller.view);
    }
  };

  var _RouterView = RouterView;
  RouterView = _aureliaDependencyInjection.inject(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router, _aureliaTemplating.ViewLocator)(RouterView) || RouterView;
  RouterView = _aureliaTemplating.noView(RouterView) || RouterView;
  RouterView = _aureliaTemplating.customElement('router-view')(RouterView) || RouterView;
  return RouterView;
})();

exports.RouterView = RouterView;

var TemplatingRouteLoader = (function (_RouteLoader) {
  _inherits(TemplatingRouteLoader, _RouteLoader);

  function TemplatingRouteLoader(compositionEngine) {
    _classCallCheck(this, _TemplatingRouteLoader);

    _RouteLoader.call(this);
    this.compositionEngine = compositionEngine;
  }

  TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild();
    var instruction = {
      viewModel: _aureliaPath.relativeToFile(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId),
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.getChildRouter = function () {
      var childRouter = undefined;

      childContainer.registerHandler(_aureliaRouter.Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(_aureliaRouter.Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  };

  var _TemplatingRouteLoader = TemplatingRouteLoader;
  TemplatingRouteLoader = _aureliaDependencyInjection.inject(_aureliaTemplating.CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
  return TemplatingRouteLoader;
})(_aureliaRouter.RouteLoader);

exports.TemplatingRouteLoader = TemplatingRouteLoader;

function configure(config) {
  config.singleton(_aureliaRouter.RouteLoader, TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources('./router-view', './route-href');
}

exports.TemplatingRouteLoader = TemplatingRouteLoader;
exports.RouterView = RouterView;
exports.RouteHref = RouteHref;
exports.configure = configure;