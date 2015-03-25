System.register(["aurelia-dependency-injection", "aurelia-templating", "aurelia-router", "aurelia-metadata"], function (_export) {
  var Container, ViewSlot, ViewStrategy, Router, Metadata, Origin, _prototypeProperties, _classCallCheck, RouterView;

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaTemplating) {
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewStrategy = _aureliaTemplating.ViewStrategy;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      RouterView = _export("RouterView", (function () {
        function RouterView(element, container, viewSlot, router) {
          _classCallCheck(this, RouterView);

          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          router.registerViewPort(this, element.getAttribute("name"));
        }

        _prototypeProperties(RouterView, {
          metadata: {
            value: function metadata() {
              return Metadata.customElement("router-view").noView();
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element, Container, ViewSlot, Router];
            },
            writable: true,
            configurable: true
          }
        }, {
          process: {
            value: function process(viewPortInstruction, waitToSwap) {
              var _this = this;

              var component = viewPortInstruction.component,
                  viewStrategy = component.view,
                  childContainer = component.childContainer,
                  viewModel = component.executionContext,
                  viewModelResource = component.viewModelResource,
                  metadata = viewModelResource.metadata;

              if (!viewStrategy && "getViewStrategy" in viewModel) {
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
            },
            writable: true,
            configurable: true
          },
          swap: {
            value: function swap(viewPortInstruction) {
              viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
              this.viewSlot.swap(viewPortInstruction.behavior.view);

              if (this.view) {
                this.view.unbind();
              }

              this.view = viewPortInstruction.behavior.view;
            },
            writable: true,
            configurable: true
          }
        });

        return RouterView;
      })());
    }
  };
});