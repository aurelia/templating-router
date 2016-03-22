'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata', 'aurelia-pal'], function (_export, _context) {
  var Container, inject, ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable, CompositionTransaction, Router, Origin, DOM, _dec, _dec2, _class, _desc, _value, _class2, _descriptor, SwapStrategies, swapStrategies, RouterView;

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewLocator = _aureliaTemplating.ViewLocator;
      customElement = _aureliaTemplating.customElement;
      noView = _aureliaTemplating.noView;
      BehaviorInstruction = _aureliaTemplating.BehaviorInstruction;
      bindable = _aureliaTemplating.bindable;
      CompositionTransaction = _aureliaTemplating.CompositionTransaction;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      SwapStrategies = function () {
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

        SwapStrategies.prototype.with = function _with(viewSlot, previousView, callback) {
          var promise = Promise.resolve(callback());

          if (previousView !== undefined) {
            return Promise.all([viewSlot.remove(previousView, true), promise]);
          }

          return promise;
        };

        SwapStrategies.prototype.after = function after(viewSlot, previousView, callback) {
          return Promise.resolve(viewSlot.removeAll(true)).then(callback);
        };

        return SwapStrategies;
      }();

      swapStrategies = new SwapStrategies();

      _export('RouterView', RouterView = (_dec = customElement('router-view'), _dec2 = inject(DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction), _dec(_class = noView(_class = _dec2(_class = (_class2 = function () {
        function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction) {
          _classCallCheck(this, RouterView);

          _initDefineProp(this, 'swapOrder', _descriptor, this);

          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          this.viewLocator = viewLocator;
          this.compositionTransaction = compositionTransaction;
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
          var _this = this;

          var component = viewPortInstruction.component;
          var childContainer = component.childContainer;
          var viewModel = component.viewModel;
          var viewModelResource = component.viewModelResource;
          var metadata = viewModelResource.metadata;

          var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
          if (viewStrategy) {
            viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
          }

          return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
            if (!_this.compositionTransactionNotifier) {
              _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
            }

            viewPortInstruction.controller = metadata.create(childContainer, BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));

            if (waitToSwap) {
              return;
            }

            _this.swap(viewPortInstruction);
          });
        };

        RouterView.prototype.swap = function swap(viewPortInstruction) {
          var _this2 = this;

          var work = function work() {
            var previousView = _this2.view;
            var viewSlot = _this2.viewSlot;
            var swapStrategy = void 0;

            swapStrategy = _this2.swapOrder in swapStrategies ? swapStrategies[_this2.swapOrder] : swapStrategies.after;

            swapStrategy(viewSlot, previousView, function () {
              return Promise.resolve(viewSlot.add(viewPortInstruction.controller.view)).then(function () {
                if (_this2.compositionTransactionNotifier) {
                  _this2.compositionTransactionNotifier.done();
                  _this2.compositionTransactionNotifier = null;
                }
              });
            });

            _this2.view = viewPortInstruction.controller.view;
          };

          viewPortInstruction.controller.automate(this.overrideContext, this.owningView);

          if (this.compositionTransactionOwnershipToken) {
            return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
              _this2.compositionTransactionOwnershipToken = null;
              work();
            });
          }

          work();
        };

        return RouterView;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class) || _class) || _class));

      _export('RouterView', RouterView);
    }
  };
});