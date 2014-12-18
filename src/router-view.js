import {Container} from 'aurelia-dependency-injection';
import {CustomElement, ViewSlot, NoView} from 'aurelia-templating';
import {Router} from 'aurelia-router';

var defaultInstruction = {suppressBind:true};

export class RouterView {
  static annotations(){
    return [
      new CustomElement('router-view'),
      new NoView()
    ];
  }

  static inject() { return [Element,Container,ViewSlot]; }
  constructor(element, container, viewSlot) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
  }

  created(executionContext){
    this.executionContext = executionContext;

    if ('router' in executionContext) {
      //TODO: tell router about the module id of it's execution context
      //This should be used to make moduleIds relative in the route config.
      executionContext.router.registerViewPort(this, this.element.getAttribute('name'));
    }
  }

  bind(executionContext){
    if(this.executionContext == executionContext){
      return;
    }

    if ('router' in executionContext) {
      executionContext.router.registerViewPort(this, this.element.getAttribute('name'));
    }
  }

  getComponent(type, createChildRouter){
    var childContainer = this.container.createChild();

    childContainer.registerHandler(Router, createChildRouter);
    childContainer.autoRegister(type.target);

    return type.create(childContainer, defaultInstruction);
  }

  process(viewPortInstruction) {
    viewPortInstruction.component.bind(viewPortInstruction.component.executionContext);
    this.viewSlot.swap(viewPortInstruction.component.view);

    if(this.view){
      this.view.unbind();
    }

    this.view = viewPortInstruction.component.view;
  }
}