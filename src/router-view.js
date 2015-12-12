import {Container, inject} from 'aurelia-dependency-injection';
import {ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {DOM} from 'aurelia-pal';


class SwapStrategies {
  static default = 'after';

  // animate the next view in before removing the current view;
  before(viewSlot, previousView, callback) {
    let promise = Promise.resolve(callback());
    if (previousView !== undefined) {
      return promise.then(() => viewSlot.remove(previousView, true));
    }
    return promise;
  }

  // animate the next view at the same time the current view is removed
  with(viewSlot, previousView, callback) {
    if (previousView !== undefined) {
      viewSlot.remove(previousView, true);
    }
    return callback();
  }

  // animate the next view in after the current view has been removed
  after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  }
}


const swapStrategies = new SwapStrategies();

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator)
export class RouterView {
  @bindable swapOrder;
  defaultSwapOrder = SwapStrategies.default;

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
    let previousView = this.view;
    let viewSlot = this.viewSlot;
    let swapStrategy;

    swapStrategy = this.swapOrder in swapStrategies
                 ? swapStrategies[this.swapOrder]
                 : swapStrategies[this.defaultSwapOrder];

    swapStrategy(viewSlot, previousView, addNextView);
    this.view = viewPortInstruction.controller.view;

    function addNextView() {
      viewPortInstruction.controller.automate();
      return viewSlot.add(viewPortInstruction.controller.view);
    }
  }
}
