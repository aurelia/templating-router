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
      model: config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    return Promise.resolve(this.composeLayout(layoutInstruction))
    .then(layoutView => {
      let viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);

      if (viewStrategy) {
        viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
      }

      return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true)
      .then(viewFactory => {
        if (!this.compositionTransactionNotifier) {
          this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
        }

        viewPortInstruction.layout = layoutView ? layoutView.view || layoutView : undefined;

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
    });
  }

  composeLayout(instruction) {
    if (instruction.viewModel || instruction.view) {
      return this.compositionEngine.compose(instruction);
    }
  }

  swap(viewPortInstruction) {
    let work = viewPortInstruction.layout ?
      () => { return this.swapWithLayout(viewPortInstruction); } :
      () => { return this.swapWithoutLayout(viewPortInstruction); };

    viewPortInstruction.controller.automate(this.overrideContext, this.owningView);

    if (this.compositionTransactionOwnershipToken) {
      return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => {
        this.compositionTransactionOwnershipToken = null;
        work();
      });
    }

    work();
  }

  swapWithoutLayout(viewPortInstruction) {
    let previousView = this.view;
    let swapStrategy;
    let viewSlot = this.viewSlot;

    swapStrategy = this.swapOrder in swapStrategies
                 ? swapStrategies[this.swapOrder]
                 : swapStrategies.after;

    swapStrategy(viewSlot, previousView, () => {
      return Promise.resolve(viewSlot.add(viewPortInstruction.controller.view))
      .then(() => {
        if (this.compositionTransactionNotifier) {
          this.compositionTransactionNotifier.done();
          this.compositionTransactionNotifier = null;
        }
      });
    });

    this.view = viewPortInstruction.controller.view;
  }

  swapWithLayout(viewPortInstruction) {
    let previousView = this.view;
    let swapStrategy;
    let layout = viewPortInstruction.layout;

    let viewSlot = new ViewSlot(layout.firstChild, false);
    viewSlot.attached();

    swapStrategy = this.swapOrder in swapStrategies
                   ? swapStrategies[this.swapOrder]
                   : swapStrategies.after;

    swapStrategy(viewSlot, previousView, () => {
      ShadowDOM.distributeView(viewPortInstruction.controller.view, layout.slots, viewSlot);

      if (this.compositionTransactionNotifier) {
        this.compositionTransactionNotifier.done();
        this.compositionTransactionNotifier = null;
      }
    });

    this.view = viewPortInstruction.controller.view;
  }
}
