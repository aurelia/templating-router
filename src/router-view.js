import {Container, inject} from 'aurelia-dependency-injection';
import {createOverrideContext} from 'aurelia-binding';
import {ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, bindable, CompositionTransaction, CompositionEngine, ShadowDOM, SwapStrategies, SwapStrategiesStateful} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import {Origin} from 'aurelia-metadata';
import {DOM} from 'aurelia-pal';

@customElement('router-view')
@noView
export class RouterView {

  static inject() {
    return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
  }

  @bindable swapOrder;
  @bindable layoutView;
  @bindable layoutViewModel;
  @bindable layoutModel;
  element;
  name;
  stateful;
  nonStatefulName;
  hidden = false;

  constructor(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.name = this.element.getAttribute('name') || 'default';
    this.stateful = this.name.indexOf('.') !== -1;
    this.nonStatefulName = this.name.split('.')[0];
    this.router.registerViewPort(this, this.name);

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
    let viewPort = (config.viewPorts ? config.viewPorts[viewPortInstruction.name] : {}) || {};

    childContainer.get(RouterViewLocator)._notify(this);

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
          return null;
        }

        this.swap(viewPortInstruction);
      });
  }

  swap(viewPortInstruction) {
    let layoutInstruction = viewPortInstruction.layoutInstruction;
    let previousView = this.view;
    let viewPort = this.router.viewPorts[viewPortInstruction.name];

    let siblingViewPorts = [];
    for (let vpName in this.router.viewPorts) {
      let vp = this.router.viewPorts[vpName];
      if (vp !== viewPort && vp.nonStatefulName === viewPort.nonStatefulName) {
        siblingViewPorts.push(vp);
      }
    }

    let work = () => {
      if (siblingViewPorts.length > 0) {
        let swapStrategy = SwapStrategiesStateful[this.swapOrder] || SwapStrategiesStateful.after;
        let viewSlot = this.viewSlot;

        let previous = [];
        if (viewPortInstruction.active) {
          previous = siblingViewPorts;
        }
        if (!viewPort.stateful && viewPortInstruction.strategy === 'replace') {
          previous.push(viewPort);
        }
        return swapStrategy(this, previous, () => {
          return Promise.resolve(viewPortInstruction.strategy === 'replace' ? viewSlot.add(this.view) : undefined);
        }).then(() => {
          this._notify();
        });
      }
      else {
        let swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
        let viewSlot = this.viewSlot;

        swapStrategy(viewSlot, previousView, () => {
          return Promise.resolve(viewSlot.add(this.view));
        }).then(() => {
          this._notify();
        });
      }
    };

    let ready = owningView => {
      viewPortInstruction.controller.automate(this.overrideContext, owningView);
      if (this.compositionTransactionOwnershipToken) {
        return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => {
          this.compositionTransactionOwnershipToken = null;
          return work();
        });
      }

      return work();
    };

    if (viewPortInstruction.strategy === 'replace') {
      if (layoutInstruction) {
        if (!layoutInstruction.viewModel) {
          // createController chokes if there's no viewmodel, so create a dummy one
          // should we use something else for the view model here?
          layoutInstruction.viewModel = {};
        }

        return this.compositionEngine.createController(layoutInstruction).then(controller => {
          ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
          controller.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
          controller.view.children.push(viewPortInstruction.controller.view);
          return controller.view || controller;
        }).then(newView => {
          this.view = newView;
          return ready(newView);
        });
      }

      this.view = viewPortInstruction.controller.view;

      return ready(this.owningView);
    }
    else {
      return work();
    }
  }
  
  hide(hide_: boolean) {
    if (this.hidden !== hide_) {
      this.hidden = hide_;
      return this.viewSlot.hide(hide_);
    }
    return Promise.resolve();
  }
  
  _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  }
}

/**
* Locator which finds the nearest RouterView, relative to the current dependency injection container.
*/
export class RouterViewLocator {
  /**
  * Creates an instance of the RouterViewLocator class.
  */
  constructor() {
    this.promise = new Promise((resolve) => this.resolve = resolve);
  }

  /**
  * Finds the nearest RouterView instance.
  * @returns A promise that will be resolved with the located RouterView instance.
  */
  findNearest(): Promise<RouterView> {
    return this.promise;
  }

  _notify(routerView: RouterView): void {
    this.resolve(routerView);
  }
}
