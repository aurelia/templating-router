import {Container, inject} from 'aurelia-dependency-injection';
import {ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {DOM} from 'aurelia-pal';

const timingFunctions = {
  default: 'before',
  // animate the next view in before removing the current view;
  before(viewSlot, view, callback) {
    let promised = callback();
    Promise.resolve(promised).then(()=> viewSlot.remove(view));
  },
  // animate the next view at the same time the current view is removed
  with(viewSlot, view, callback) {
    view && viewSlot.remove(view);
    callback();
  },
  // animate the next view in after the current view has been removed
  after(viewSlot, view, callback) {
    let promised = viewSlot.removeAll(true);
    Promise.resolve(promised).then(callback);
  }
};

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator)
export class RouterView {
  @bindable animationTiming = timingFunctions[timingFunctions.default];

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
    let view = this.view;
    let viewSlot = this.viewSlot;
    let timingFunction = this.animationTiming in timingFunctions
      ? timingFunctions[this.animationTiming]
      : timingFunctions.after;

    if (timingFunction) {
      timingFunction(viewSlot, view, next);
    }

    this.view = viewPortInstruction.controller.view;

    function next() {
      viewPortInstruction.controller.automate();
      viewSlot.add(viewPortInstruction.controller.view);
    }
  }

}
