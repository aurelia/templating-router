"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Container = require("aurelia-dependency-injection").Container;
var CustomElement = require("aurelia-templating").CustomElement;
var ViewSlot = require("aurelia-templating").ViewSlot;
var ViewStrategy = require("aurelia-templating").ViewStrategy;
var UseView = require("aurelia-templating").UseView;
var NoView = require("aurelia-templating").NoView;
var Router = require("aurelia-router").Router;
var Origin = require("aurelia-metadata").Origin;
var RouterView = (function () {
  function RouterView(element, container, viewSlot, router) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    router.registerViewPort(this, element.getAttribute("name"));
  }

  _prototypeProperties(RouterView, {
    annotations: {
      value: function () {
        return [new CustomElement("router-view"), new NoView()];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    inject: {
      value: function () {
        return [Element, Container, ViewSlot, Router];
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    process: {
      value: function (viewPortInstruction, waitToSwap) {
        var _this = this;
        var component = viewPortInstruction.component,
            viewStrategy = component.view,
            viewModelInfo = component.viewModelInfo,
            childContainer = component.childContainer,
            viewModel = component.executionContext;

        if (!viewStrategy && "getViewStrategy" in viewModel) {
          viewStrategy = viewModel.getViewStrategy();
        }

        if (viewStrategy) {
          viewStrategy = ViewStrategy.normalize(viewStrategy);
          viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
        }

        return viewModelInfo.type.load(childContainer, viewModelInfo.value, viewStrategy).then(function (behaviorType) {
          viewPortInstruction.behavior = behaviorType.create(childContainer, { executionContext: viewModel });

          if (waitToSwap) {
            return;
          }

          _this.swap(viewPortInstruction);
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    swap: {
      value: function (viewPortInstruction) {
        this.viewSlot.swap(viewPortInstruction.behavior.view);

        if (this.view) {
          this.view.unbind();
        }

        this.view = viewPortInstruction.behavior.view;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return RouterView;
})();

exports.RouterView = RouterView;