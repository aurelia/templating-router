'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Container$inject = require('aurelia-dependency-injection');

var _ViewSlot$ViewStrategy$customElement$noView = require('aurelia-templating');

var _Router = require('aurelia-router');

var _Metadata$Origin = require('aurelia-metadata');

var RouterView = (function () {
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

  exports.RouterView = RouterView = customElement('router-view')(RouterView) || RouterView;
  exports.RouterView = RouterView = noView(RouterView) || RouterView;
  exports.RouterView = RouterView = inject(Element, Container, ViewSlot, Router)(RouterView) || RouterView;
  return RouterView;
})();

exports.RouterView = RouterView;