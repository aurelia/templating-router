"use strict";

var Container = require('aurelia-dependency-injection').Container;
var CustomElement = require('aurelia-templating').CustomElement;
var ViewSlot = require('aurelia-templating').ViewSlot;
var NoView = require('aurelia-templating').NoView;
var Router = require('aurelia-router').Router;


var defaultInstruction = { suppressBind: true };

var RouterViewPort = (function () {
  var RouterViewPort = function RouterViewPort(element, container, viewSlot) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
  };

  RouterViewPort.annotations = function () {
    return [new CustomElement("router-view-port"), new NoView()];
  };

  RouterViewPort.inject = function () {
    return [Element, Container, ViewSlot];
  };

  RouterViewPort.prototype.created = function (executionContext) {
    this.executionContext = executionContext;

    if ("router" in executionContext) {
      executionContext.router.registerViewPort(this, this.element.getAttribute("name"));
    }
  };

  RouterViewPort.prototype.bind = function (executionContext) {
    if (this.executionContext == executionContext) {
      return;
    }

    if ("router" in executionContext) {
      executionContext.router.registerViewPort(this, this.element.getAttribute("name"));
    }
  };

  RouterViewPort.prototype.getComponent = function (type, createChildRouter) {
    var childContainer = this.container.createChild();

    childContainer.registerHandler(Router, createChildRouter);
    childContainer.autoRegister(type.target);

    return type.create(childContainer, defaultInstruction);
  };

  RouterViewPort.prototype.process = function (viewPortInstruction) {
    viewPortInstruction.component.bind(viewPortInstruction.component.executionContext);
    this.viewSlot.swap(viewPortInstruction.component.view);

    if (this.view) {
      this.view.unbind();
    }

    this.view = viewPortInstruction.component.view;
  };

  return RouterViewPort;
})();

exports.RouterViewPort = RouterViewPort;