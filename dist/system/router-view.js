System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata'], function (_export) {
  var Container, inject, ViewSlot, ViewStrategy, customElement, noView, Router, Metadata, Origin, _classCallCheck, _createClass, RouterView;

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewStrategy = _aureliaTemplating.ViewStrategy;
      customElement = _aureliaTemplating.customElement;
      noView = _aureliaTemplating.noView;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      RouterView = (function () {
        function RouterView(element, container, viewSlot, router) {
          _classCallCheck(this, RouterView);

          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          router.registerViewPort(this, element.getAttribute('name'));
        }

        _createClass(RouterView, [{
          key: 'process',
          value: function process(viewPortInstruction, waitToSwap) {
            var _this = this;

            var component = viewPortInstruction.component,
                viewStrategy = component.view,
                childContainer = component.childContainer,
                viewModel = component.executionContext,
                viewModelResource = component.viewModelResource,
                metadata = viewModelResource.metadata;

            if (!viewStrategy && 'getViewStrategy' in viewModel) {
              viewStrategy = viewModel.getViewStrategy();
            }

            if (viewStrategy) {
              viewStrategy = ViewStrategy.normalize(viewStrategy);
              viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
            }

            return metadata.load(childContainer, viewModelResource.value, viewStrategy, true).then(function (viewFactory) {
              viewPortInstruction.behavior = metadata.create(childContainer, {
                executionContext: viewModel,
                viewFactory: viewFactory,
                suppressBind: true
              });

              if (waitToSwap) {
                return;
              }

              _this.swap(viewPortInstruction);
            });
          }
        }, {
          key: 'swap',
          value: function swap(viewPortInstruction) {
            viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
            this.viewSlot.swap(viewPortInstruction.behavior.view);

            if (this.view) {
              this.view.unbind();
            }

            this.view = viewPortInstruction.behavior.view;
          }
        }]);

        _export('RouterView', RouterView = customElement('router-view')(RouterView) || RouterView);

        _export('RouterView', RouterView = noView(RouterView) || RouterView);

        _export('RouterView', RouterView = inject(Element, Container, ViewSlot, Router)(RouterView) || RouterView);

        return RouterView;
      })();

      _export('RouterView', RouterView);
    }
  };
});