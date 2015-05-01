'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _Container$inject = require('aurelia-dependency-injection');

var _ViewSlot$ViewStrategy$customElement$noView = require('aurelia-templating');

var _Router = require('aurelia-router');

var _Metadata$Origin = require('aurelia-metadata');

var RouterView = (function () {
  function RouterView(element, container, viewSlot, router) {
    _classCallCheck(this, _RouterView);

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.router.registerViewPort(this, this.element.getAttribute('name'));
  }

  var _RouterView = RouterView;

  _RouterView.prototype.bind = function bind(executionContext) {
    this.container.viewModel = executionContext;
  };

  _RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
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
      viewStrategy = _ViewSlot$ViewStrategy$customElement$noView.ViewStrategy.normalize(viewStrategy);
      viewStrategy.makeRelativeTo(_Metadata$Origin.Origin.get(component.router.container.viewModel.constructor).moduleId);
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
  };

  _RouterView.prototype.swap = function swap(viewPortInstruction) {
    viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
    this.viewSlot.swap(viewPortInstruction.behavior.view);

    if (this.view) {
      this.view.unbind();
    }

    this.view = viewPortInstruction.behavior.view;
  };

  RouterView = _Container$inject.inject(Element, _Container$inject.Container, _ViewSlot$ViewStrategy$customElement$noView.ViewSlot, _Router.Router)(RouterView) || RouterView;
  RouterView = _ViewSlot$ViewStrategy$customElement$noView.noView(RouterView) || RouterView;
  RouterView = _ViewSlot$ViewStrategy$customElement$noView.customElement('router-view')(RouterView) || RouterView;
  return RouterView;
})();

exports.RouterView = RouterView;