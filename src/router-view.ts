import { Container } from 'aurelia-dependency-injection';
import { createOverrideContext, OverrideContext } from 'aurelia-binding';
import {
  ViewSlot,
  ViewLocator,
  BehaviorInstruction,
  CompositionTransaction,
  CompositionEngine,
  ShadowDOM,
  SwapStrategies,
  ResourceDescription,
  HtmlBehaviorResource,
  CompositionTransactionNotifier,
  View,
  CompositionTransactionOwnershipToken,
  Controller,
  ViewFactory,
  CompositionContext,
  IStaticResourceConfig,
  IStaticViewConfig
} from 'aurelia-templating';
import {
  Router,
  ViewPortInstruction,
  ViewPort
} from 'aurelia-router';
import { Origin } from 'aurelia-metadata';
import { DOM } from 'aurelia-pal';

class EmptyViewModel {

}

/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
export class RouterView implements ViewPort {

  /**@internal */
  static inject() {
    return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
  }

  /**@internal */
  static $view: IStaticViewConfig = null;
  /**@internal */
  static $resource: IStaticResourceConfig = {
    name: 'router-view',
    bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel'] as any
  };

  /**
   * Swapping order when going to a new route. By default, supports 3 value: before, after, with
   * - Before = new in -> old out
   * - After = old out -> new in
   * - with = new in + old out
   *
   * These values are defined by swapStrategies export in aurelia-templating/ aurelia-framework
   */
  swapOrder: string;

  layoutView: any;

  layoutViewModel: string | Function | object;

  layoutModel: any;

  /**
   * Element associated with this <router-view/> custom element
   */
  readonly element: Element;

  /**
   * Current router associated with this <router-view/>
   */
  readonly router: Router;

  /**
   * Container at this <router-view/> level
   */
  container: Container;

  /**@internal */
  viewSlot: ViewSlot;

  /**@internal */
  viewLocator: ViewLocator;

  /**@internal */
  view: View;

  /**@internal */
  owningView: View;

  /**
   * @internal
   * Composition Transaction of initial composition transaction, when this <router-view/> is created
   */
  compositionTransaction: CompositionTransaction;

  /**
   * @internal
   * CompositionEngine instance, responsible for composing view/view model during process changes phase of this <router-view/>
   */
  compositionEngine: CompositionEngine;

  /**
   * @internal
   */
  compositionTransactionNotifier: CompositionTransactionNotifier;

  /**
   * @internal
   */
  compositionTransactionOwnershipToken: CompositionTransactionOwnershipToken;

  /**
   * @internal
   */
  overrideContext: OverrideContext;

  constructor(
    element: Element,
    container: Container,
    viewSlot: ViewSlot,
    router: Router,
    viewLocator: ViewLocator,
    compositionTransaction: CompositionTransaction,
    compositionEngine: CompositionEngine
  ) {
    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    // This means the first <router-view/> created in an Aurelia application (one Aurelia instance)
    // composition finish event will be delayed until compositionNotifier invokes done()
    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  created(owningView: View) {
    this.owningView = owningView;
  }

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  }

  process(viewPortInstruction: ViewPortInstruction, waitToSwap?: boolean) {
    const component = viewPortInstruction.component;
    const childContainer = component.childContainer;
    const viewModel = component.viewModel;
    const viewModelResource: ResourceDescription = component.viewModelResource as any;
    const metadata = viewModelResource.metadata;
    const config = component.router.currentInstruction.config;
    const viewPort = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};

    (childContainer.get(RouterViewLocator) as RouterViewLocator)._notify(this);

    // layoutInstruction is our layout viewModel
    const layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    const viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata
      .load(childContainer, viewModelResource.value, null, viewStrategy, true)
      // Wrong typing from aurelia templating
      // it's supposed to be a Promise<ViewFactory>
      .then((viewFactory: ViewFactory | HtmlBehaviorResource) => {
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
            viewFactory as ViewFactory
          )
        );

        if (waitToSwap) {
          return null;
        }

        this.swap(viewPortInstruction);
      });
  }

  swap(viewPortInstruction: ViewPortInstruction) {
    const layoutInstruction = viewPortInstruction.layoutInstruction;
    const previousView = this.view;

    const work = () => {
      let swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
      let viewSlot = this.viewSlot;

      swapStrategy(viewSlot, previousView, () => {
        return Promise.resolve(viewSlot.add(this.view));
      }).then(() => {
        this._notify();
      });
    };

    const ready = (owningView: View) => {
      viewPortInstruction.controller.automate(this.overrideContext, owningView);
      if (this.compositionTransactionOwnershipToken) {
        return this.compositionTransactionOwnershipToken
          .waitForCompositionComplete()
          .then(() => {
            this.compositionTransactionOwnershipToken = null;
            return work();
          });
      }

      return work();
    };

    if (layoutInstruction) {
      if (!layoutInstruction.viewModel) {
        // createController chokes if there's no viewmodel, so create a dummy one
        layoutInstruction.viewModel = new EmptyViewModel();
      }

      return this.compositionEngine
        .createController(layoutInstruction as CompositionContext)
        .then((controller: Controller) => {
          ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
          controller.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
          controller.view.children.push(viewPortInstruction.controller.view);
          return controller.view || controller;
        })
        .then((newView: View | Controller) => {
          this.view = newView as View;
          return ready(newView as View);
        });
    }

    this.view = viewPortInstruction.controller.view;

    return ready(this.owningView);
  }

  /**@internal */
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

  /*@internal */
  promise: Promise<any>;

  /*@internal */
  resolve: (val?: any) => any;

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

  /**@internal */
  _notify(routerView: RouterView): void {
    this.resolve(routerView);
  }
}
