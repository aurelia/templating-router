'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplatingRouteLoader = exports.RouterViewLocator = exports.RouterView = exports.RouteHref = undefined;

var _dec, _dec2, _dec3, _dec4, _class, _dec5, _class2, _desc, _value, _class3, _descriptor, _descriptor2, _descriptor3, _descriptor4, _dec6, _class5, _dec7, _class6;

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaTemplating = require('aurelia-templating');

var _aureliaRouter = require('aurelia-router');

var _aureliaPal = require('aurelia-pal');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaBinding = require('aurelia-binding');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaPath = require('aurelia-path');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = LogManager.getLogger('route-href');

var RouteHref = exports.RouteHref = (_dec = (0, _aureliaTemplating.customAttribute)('route-href'), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'route', changeHandler: 'processChange', primaryProperty: true }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'params', changeHandler: 'processChange' }), _dec4 = (0, _aureliaTemplating.bindable)({ name: 'attribute', defaultValue: 'href' }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
  RouteHref.inject = function inject() {
    return [_aureliaRouter.Router, _aureliaPal.DOM.Element];
  };

  function RouteHref(router, element) {
    _classCallCheck(this, RouteHref);

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
        return null;
      }

      var href = _this.router.generate(_this.route, _this.params);

      if (_this.element.au.controller) {
        _this.element.au.controller.viewModel[_this.attribute] = href;
      } else {
        _this.element.setAttribute(_this.attribute, href);
      }

      return null;
    }).catch(function (reason) {
      logger.error(reason);
    });
  };

  return RouteHref;
}()) || _class) || _class) || _class) || _class);
var RouterView = exports.RouterView = (_dec5 = (0, _aureliaTemplating.customElement)('router-view'), _dec5(_class2 = (0, _aureliaTemplating.noView)(_class2 = (_class3 = function () {
  RouterView.inject = function inject() {
    return [_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router, _aureliaTemplating.ViewLocator, _aureliaTemplating.CompositionTransaction, _aureliaTemplating.CompositionEngine];
  };

  function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    _classCallCheck(this, RouterView);

    _initDefineProp(this, 'swapOrder', _descriptor, this);

    _initDefineProp(this, 'layoutView', _descriptor2, this);

    _initDefineProp(this, 'layoutViewModel', _descriptor3, this);

    _initDefineProp(this, 'layoutModel', _descriptor4, this);

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  RouterView.prototype.created = function created(owningView) {
    this.owningView = owningView;
  };

  RouterView.prototype.bind = function bind(bindingContext, overrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  };

  RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
    var _this2 = this;

    var component = viewPortInstruction.component;
    var childContainer = component.childContainer;
    var viewModel = component.viewModel;
    var viewModelResource = component.viewModelResource;
    var metadata = viewModelResource.metadata;
    var config = component.router.currentInstruction.config;
    var viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] || {} : {};

    childContainer.get(RouterViewLocator)._notify(this);

    var layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
      if (!_this2.compositionTransactionNotifier) {
        _this2.compositionTransactionOwnershipToken = _this2.compositionTransaction.tryCapture();
      }

      if (layoutInstruction.viewModel || layoutInstruction.view) {
        viewPortInstruction.layoutInstruction = layoutInstruction;
      }

      viewPortInstruction.controller = metadata.create(childContainer, _aureliaTemplating.BehaviorInstruction.dynamic(_this2.element, viewModel, viewFactory));

      if (waitToSwap) {
        return null;
      }

      _this2.swap(viewPortInstruction);
    });
  };

  RouterView.prototype.swap = function swap(viewPortInstruction) {
    var _this3 = this;

    var layoutInstruction = viewPortInstruction.layoutInstruction;
    var previousView = this.view;

    var work = function work() {
      var swapStrategy = _aureliaTemplating.SwapStrategies[_this3.swapOrder] || _aureliaTemplating.SwapStrategies.after;
      var viewSlot = _this3.viewSlot;

      swapStrategy(viewSlot, previousView, function () {
        return Promise.resolve(viewSlot.add(_this3.view));
      }).then(function () {
        _this3._notify();
      });
    };

    var ready = function ready(owningView) {
      viewPortInstruction.controller.automate(_this3.overrideContext, owningView);
      if (_this3.compositionTransactionOwnershipToken) {
        return _this3.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
          _this3.compositionTransactionOwnershipToken = null;
          return work();
        });
      }

      return work();
    };

    if (layoutInstruction) {
      if (!layoutInstruction.viewModel) {
        layoutInstruction.viewModel = {};
      }

      return this.compositionEngine.createController(layoutInstruction).then(function (controller) {
        _aureliaTemplating.ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
        controller.automate((0, _aureliaBinding.createOverrideContext)(layoutInstruction.viewModel), _this3.owningView);
        controller.view.children.push(viewPortInstruction.controller.view);
        return controller.view || controller;
      }).then(function (newView) {
        _this3.view = newView;
        return ready(newView);
      });
    }

    this.view = viewPortInstruction.controller.view;

    return ready(this.owningView);
  };

  RouterView.prototype._notify = function _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  };

  return RouterView;
}(), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, 'swapOrder', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, 'layoutView', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, 'layoutViewModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, 'layoutModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class3)) || _class2) || _class2);

var RouterViewLocator = exports.RouterViewLocator = function () {
  function RouterViewLocator() {
    var _this4 = this;

    _classCallCheck(this, RouterViewLocator);

    this.promise = new Promise(function (resolve) {
      return _this4.resolve = resolve;
    });
  }

  RouterViewLocator.prototype.findNearest = function findNearest() {
    return this.promise;
  };

  RouterViewLocator.prototype._notify = function _notify(routerView) {
    this.resolve(routerView);
  };

  return RouterViewLocator;
}();

var EmptyClass = (_dec6 = (0, _aureliaTemplating.inlineView)('<template></template>'), _dec6(_class5 = function EmptyClass() {
  _classCallCheck(this, EmptyClass);
}) || _class5);
var TemplatingRouteLoader = exports.TemplatingRouteLoader = (_dec7 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine), _dec7(_class6 = function (_RouteLoader) {
  _inherits(TemplatingRouteLoader, _RouteLoader);

  function TemplatingRouteLoader(compositionEngine) {
    _classCallCheck(this, TemplatingRouteLoader);

    var _this5 = _possibleConstructorReturn(this, _RouteLoader.call(this));

    _this5.compositionEngine = compositionEngine;
    return _this5;
  }

  TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild();

    var viewModel = void 0;
    if (config.moduleId === null) {
      viewModel = EmptyClass;
    } else if (/\.html/i.test(config.moduleId)) {
      viewModel = createDynamicClass(config.moduleId);
    } else {
      viewModel = (0, _aureliaPath.relativeToFile)(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId);
    }

    var instruction = {
      viewModel: viewModel,
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.registerSingleton(RouterViewLocator);

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
}(_aureliaRouter.RouteLoader)) || _class6);


function createDynamicClass(moduleId) {
  var _dec8, _dec9, _class7;

  var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

  var DynamicClass = (_dec8 = (0, _aureliaTemplating.customElement)(name), _dec9 = (0, _aureliaTemplating.useView)(moduleId), _dec8(_class7 = _dec9(_class7 = function () {
    function DynamicClass() {
      _classCallCheck(this, DynamicClass);
    }

    DynamicClass.prototype.bind = function bind(bindingContext) {
      this.$parent = bindingContext;
    };

    return DynamicClass;
  }()) || _class7) || _class7);


  return DynamicClass;
}