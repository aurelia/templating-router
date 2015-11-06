import {Container, inject} from 'aurelia-dependency-injection';
import {ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {DOM} from 'aurelia-pal';

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator)
export class RouterView {
  constructor(element, container, viewSlot, router, viewLocator) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.router.registerViewPort(this, this.element.getAttribute('name'));
  }

  bind(bindingContext) {
    this.container.viewModel = bindingContext;
  }

  process(viewPortInstruction, waitToSwap) {
    let component = viewPortInstruction.component;
    let childContainer = component.childContainer;
    let viewModel = component.viewModel;
    let viewModelResource = component.viewModelResource;
    let metadata = viewModelResource.metadata;

    let viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(viewFactory => {
      viewPortInstruction.controller = metadata.create(childContainer,
        BehaviorInstruction.dynamic(
          this.element,
          viewModel,
          viewFactory
        )
      );

      if (waitToSwap) {
        return;
      }

      this.swap(viewPortInstruction);
    });
  }

  swap(viewPortInstruction) {
    let removeResponse = this.viewSlot.removeAll(true);

    if (removeResponse instanceof Promise) {
      return removeResponse.then(() => {
        viewPortInstruction.controller.automate();
        this.viewSlot.add(viewPortInstruction.controller.view);
        this.view = viewPortInstruction.controller.view;
      });
    }

    viewPortInstruction.controller.automate();
    this.viewSlot.add(viewPortInstruction.controller.view);
    this.view = viewPortInstruction.controller.view;
  }
}
