import {Container} from 'aurelia-dependency-injection';
import {CustomElement, ViewSlot, ViewStrategy, UseView, NoView} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {relativeToFile} from 'aurelia-path';

function makeViewRelative(executionContext, viewPath){
  var origin = Origin.get(executionContext.constructor);
  return relativeToFile(viewPath, origin.moduleId);
}

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
    this.connectToRouterOnExecutionContext();
  }

  bind(executionContext){
    if(this.executionContext == executionContext){
      return;
    }

    this.executionContext = executionContext;
    this.connectToRouterOnExecutionContext();
  }

  getComponent(viewModelInfo, createChildRouter, config){
    var childContainer = this.container.createChild(),
        viewStrategy = config.view || config.viewStrategy,
        viewModel;
    
    childContainer.registerHandler(Router, createChildRouter);
    childContainer.autoRegister(viewModelInfo.value);

    viewModel = childContainer.get(viewModelInfo.value);

    if('getViewStrategy' in viewModel && !viewStrategy){
      viewStrategy = viewModel.getViewStrategy();
    }

    if(typeof viewStrategy === 'string'){
      viewStrategy = new UseView(makeViewRelative(this.executionContext, viewStrategy));
    }

    if(viewStrategy && !(viewStrategy instanceof ViewStrategy)){
      throw new Error('The view must be a string or an instance of ViewStrategy.');
    }

    return viewModelInfo.type.load(this.container, viewModelInfo.value, viewStrategy).then(behaviorType => {
      return behaviorType.create(childContainer, {executionContext:viewModel, suppressBind:true});
    });
  }

  process(viewPortInstruction) {
    viewPortInstruction.component.bind(viewPortInstruction.component.executionContext);
    this.viewSlot.swap(viewPortInstruction.component.view);

    if(this.view){
      this.view.unbind();
    }

    this.view = viewPortInstruction.component.view;
  }

  connectToRouterOnExecutionContext(){
    var executionContext = this.executionContext,
        key, router;

    if ('router' in executionContext && executionContext.router instanceof Router) {
      router = executionContext.router;
    }else{
      for(key in executionContext){
        if(executionContext[key] instanceof Router){
          router = executionContext[key];
          break;
        }
      }
    }

    if(!router){
      throw new Error('In order to use a "router-view" the view\'s executionContext (view model) must have a router property.');
    }

    router.registerViewPort(this, this.element.getAttribute('name'));
  }
}