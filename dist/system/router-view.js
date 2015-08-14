System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata'], function (_export) {
  'use strict';

  var Container, inject, ViewSlot, ViewStrategy, customElement, noView, Router, Metadata, Origin, RouterView;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
      RouterView = (function () {
        function RouterView(element, container, viewSlot, router) {
          _classCallCheck(this, _RouterView);

          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          this.router.registerViewPort(this, this.element.getAttribute('name'));
        }

        RouterView.prototype.bind = function bind(executionContext) {
          this.container.viewModel = executionContext;
        };

        RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
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
              suppressBind: true,
              host: _this.element
            });

            if (waitToSwap) {
              return;
            }

            _this.swap(viewPortInstruction);
          });
        };

        RouterView.prototype.swap = function swap(viewPortInstruction) {
          viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
          this.viewSlot.swap(viewPortInstruction.behavior.view);

          if (this.view) {
            this.view.unbind();
          }

          this.view = viewPortInstruction.behavior.view;
        };

        var _RouterView = RouterView;
        RouterView = inject(Element, Container, ViewSlot, Router)(RouterView) || RouterView;
        RouterView = noView(RouterView) || RouterView;
        RouterView = customElement('router-view')(RouterView) || RouterView;
        return RouterView;
      })();

      _export('RouterView', RouterView);
    }
  };
});