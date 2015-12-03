System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata', 'aurelia-pal'], function (_export) {
  'use strict';

  var Container, inject, ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable, Router, Origin, DOM, swapStrategies, RouterView;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

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
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      swapStrategies = {
        'default': 'before',

        before: function before(viewSlot, previousView, callback) {
          var promise = Promise.resolve(callback());

          if (previousView !== undefined) {
            return promise.then(function () {
              return viewSlot.remove(previousView, true);
            });
          }

          return promise;
        },

        'with': function _with(viewSlot, previousView, callback) {
          if (previousView !== undefined) {
            viewSlot.remove(previousView, true);
          }

          return callback();
        },

        after: function after(viewSlot, previousView, callback) {
          return Promise.resolve(viewSlot.removeAll(true)).then(callback);
        }
      };

      RouterView = (function () {
        var _instanceInitializers = {};

        _createDecoratedClass(RouterView, [{
          key: 'swapOrder',
          decorators: [bindable],
          initializer: function initializer() {
            return swapStrategies[swapStrategies['default']];
          },
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
            viewPortInstruction.controller = metadata.create(childContainer, BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));

            if (waitToSwap) {
              return;
            }

            _this.swap(viewPortInstruction);
          });
        };

        RouterView.prototype.swap = function swap(viewPortInstruction) {
          var previousView = this.view;
          var viewSlot = this.viewSlot;
          var swapStrategy = this.swapOrder in swapStrategies ? swapStrategies[this.swapOrder] : swapStrategies[swapStrategies['default']];

          swapStrategy(viewSlot, previousView, addNextView);
          this.view = viewPortInstruction.controller.view;

          function addNextView() {
            viewPortInstruction.controller.automate();
            return viewSlot.add(viewPortInstruction.controller.view);
          }
        };

        var _RouterView = RouterView;
        RouterView = inject(DOM.Element, Container, ViewSlot, Router, ViewLocator)(RouterView) || RouterView;
        RouterView = noView(RouterView) || RouterView;
        RouterView = customElement('router-view')(RouterView) || RouterView;
        return RouterView;
      })();

      _export('RouterView', RouterView);
    }
  };
});