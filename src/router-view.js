import {Container, inject} from 'aurelia-dependency-injection';
import {ViewSlot, ViewStrategy, customElement, noView} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Metadata, Origin} from 'aurelia-metadata';

@customElement('router-view')
@noView
@inject(Element, Container, ViewSlot, Router)
export class RouterView {
  constructor(element, container, viewSlot, router) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.router.registerViewPort(this, this.element.getAttribute('name'));
  }

  bind(bindingContext){
    this.container.viewModel = bindingContext;
  }

  process(viewPortInstruction, waitToSwap) {
    var component = viewPortInstruction.component,
        viewStrategy = component.view,
        childContainer = component.childContainer,
        viewModel = component.bindingContext,
        viewModelResource = component.viewModelResource,
        metadata = viewModelResource.metadata;

    if(!viewStrategy && 'getViewStrategy' in viewModel){
      viewStrategy = viewModel.getViewStrategy();
    }

    if(viewStrategy){
      viewStrategy = ViewStrategy.normalize(viewStrategy);
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, viewStrategy, true).then(viewFactory => {
      viewPortInstruction.behavior = metadata.create(childContainer, {
        bindingContext:viewModel,
        viewFactory:viewFactory,
        suppressBind:true,
        host:this.element
      });

      if(waitToSwap){
        return;
      }

      this.swap(viewPortInstruction);
    });
  }

  swap(viewPortInstruction){
    var removeResponse = this.viewSlot.removeAll(true);

    if(removeResponse instanceof Promise){
      return removeResponse.then(() => {
        viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.bindingContext);
        this.viewSlot.add(viewPortInstruction.behavior.view);
        this.view = viewPortInstruction.behavior.view;
      });
    } else{
      viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.bindingContext);
      this.viewSlot.add(viewPortInstruction.behavior.view);
      this.view = viewPortInstruction.behavior.view;
    }
  }
}
