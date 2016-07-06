import {Container, inject} from 'aurelia-dependency-injection';
import {ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable, CompositionTransaction, CompositionEngine, ShadowDOM} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {DOM} from 'aurelia-pal';

class SwapStrategies {
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
    let promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return Promise.all([viewSlot.remove(previousView, true), promise]);
    }

    return promise;
  }

  // animate the next view in after the current view has been removed
  after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  }
}

const swapStrategies = new SwapStrategies();

@customElement('router-view')
@noView
@inject(DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine)
export class RouterView {
  @bindable swapOrder;
  @bindable layoutView;
  @bindable layoutViewModel;
  @bindable layoutModel;

  constructor(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  created(owningView) {
    this.owningView = owningView;
  }

  bind(bindingContext, overrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  }

  process(viewPortInstruction, waitToSwap) {
    let component = viewPortInstruction.component;
    let childContainer = component.childContainer;
    let viewModel = component.viewModel;
    let viewModelResource = component.viewModelResource;
    let metadata = viewModelResource.metadata;
    let config = component.router.currentInstruction.config;
    let viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] : {};

    // layoutInstruction is our layout viewModel
    let layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    let viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true)
    .then(viewFactory => {
      if (!this.compositionTransactionNotifier) {
        this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
      }

      if (layoutInstruction.viewModel || layoutInstruction.view) {
        viewPortInstruction.layoutInstruction = layoutInstruction;
      }

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
    let work = () => {
      let previousView = this.view;
      let swapStrategy;
      let viewSlot = this.viewSlot;
      let layoutInstruction = viewPortInstruction.layoutInstruction;

      swapStrategy = this.swapOrder in swapStrategies
                  ? swapStrategies[this.swapOrder]
                  : swapStrategies.after;

      swapStrategy(viewSlot, previousView, () => {
        let waitForView;

        if (layoutInstruction) {
          if (!layoutInstruction.viewModel) {
            // createController chokes if there's no viewmodel, so create a dummy one
            // could possibly check if there was no VM and don't use compose, just create a viewfactory -> view?
            layoutInstruction.viewModel = {};
          }

          waitForView = this.compositionEngine.createController(layoutInstruction).then(layout => {
            ShadowDOM.distributeView(viewPortInstruction.controller.view, layout.slots || layout.view.slots);
            return layout.view || layout;
          });
        } else {
          waitForView = Promise.resolve(viewPortInstruction.controller.view);
        }

        return waitForView.then(newView => {
          this.view = newView;
          return viewSlot.add(newView);
        }).then(() => {
          this._notify();
        });
      });
    };

    viewPortInstruction.controller.automate(this.overrideContext, this.owningView);

    if (this.compositionTransactionOwnershipToken) {
      return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => {
        this.compositionTransactionOwnershipToken = null;
        return work();
      });
    }

    return work();
  }

  _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  }
}
