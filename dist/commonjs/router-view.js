"use strict";

var Container = require('aurelia-dependency-injection').Container;
var CustomElement = require('aurelia-templating').CustomElement;
var ViewSlot = require('aurelia-templating').ViewSlot;
var NoView = require('aurelia-templating').NoView;
var Router = require('aurelia-router').Router;


var defaultInstruction = { suppressBind: true };

var RouterView = (function () {
  var RouterView = function RouterView(element, container, viewSlot) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
  };

  RouterView.annotations = function () {
    return [new CustomElement("router-view"), new NoView()];
  };

  RouterView.inject = function () {
    return [Element, Container, ViewSlot];
  };

  RouterView.prototype.created = function (executionContext) {
    this.executionContext = executionContext;

    if ("router" in executionContext) {
      executionContext.router.registerViewPort(this, this.element.getAttribute("name"));
    }
  };

  RouterView.prototype.bind = function (executionContext) {
    if (this.executionContext == executionContext) {
      return;
    }

    if ("router" in executionContext) {
      executionContext.router.registerViewPort(this, this.element.getAttribute("name"));
    }
  };

  RouterView.prototype.getComponent = function (type, createChildRouter) {
    var childContainer = this.container.createChild();

    childContainer.registerHandler(Router, createChildRouter);
    childContainer.autoRegister(type.target);

    return type.create(childContainer, defaultInstruction);
  };

  RouterView.prototype.process = function (viewPortInstruction) {
    viewPortInstruction.component.bind(viewPortInstruction.component.executionContext);
    this.viewSlot.swap(viewPortInstruction.component.view);

    if (this.view) {
      this.view.unbind();
    }

    this.view = viewPortInstruction.component.view;
  };

  return RouterView;
})();

exports.RouterView = RouterView;