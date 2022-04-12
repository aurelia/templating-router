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
  Router
} from 'aurelia-router';
import { Origin } from 'aurelia-metadata';
import { DOM } from 'aurelia-pal';
import { IRouterViewViewPortInstruction } from './interfaces';

class EmptyLayoutViewModel {

}

/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
export class RouterView {

  /**@internal */
  static inject() {
    return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
  }

  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   *
   * There is no view to compose by default in a router view
   * This custom element is responsible for composing its own view, based on current config
   */
  static $view: IStaticViewConfig = null;
  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   */
  static $resource: IStaticResourceConfig = {
    name: 'router-view',
    bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context'] as any
  };

  /**
   * Swapping order when going to a new route. By default, supports 3 value: before, after, with
   * - before = new in -> old out
   * - after = old out -> new in
   * - with = new in + old out
   *
   * These values are defined by swapStrategies export in aurelia-templating/ aurelia-framework
   * Can be extended there and used here
   */
  swapOrder?: 'before' | 'after' | 'with';

  /**
   * Layout view used for this router-view layout, if no layout-viewmodel specified
   */
  layoutView?: any;

  /**
   * Layout view model used as binding context for this router-view layout
   * Actual type would be {string | Constructable | object}
   */
  layoutViewModel?: any;

  /**
   * Layout model used to activate layout view model, if specified with `layoutViewModel`
   */
  layoutModel?: any;

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

  /**
   * @internal
   * the view slot for adding / removing Routing related views created dynamically
   */
  viewSlot: ViewSlot;

  /**
   * @internal
   * Used to mimic partially functionalities of CompositionEngine
   */
  viewLocator: ViewLocator;

  /**
   * @internal
   * View composed by the CompositionEngine, depends on layout / viewports/ moduleId / viewModel of routeconfig
   */
  view: View;

  /**
   * @internal
   * The view where this `<router-view/>` is placed in
   */
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
   * Composition transaction notifier instance. Created when this router-view composing its instruction
   * for the first time.
   * Null on 2nd time and after.
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
    // add this <router-view/> to router view ports lookup based on name attribute
    // when this router is the root router-view
    // also trigger AppRouter registerViewPort extra flow
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    // Each <router-view/> process its instruction as a composition transaction
    // there are differences between intial composition and subsequent compositions
    // also there are differences between root composition and child <router-view/> composition
    // mark the first composition transaction with a property initialComposition to distinguish it
    // when the root <router-view/> gets new instruction for the first time
    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  created(owningView: View): void {
    this.owningView = owningView;
  }

  bind(bindingContext: any, overrideContext: OverrideContext): void {
    // router needs to get access to view model of current route parent
    // doing it in generic way via viewModel property on container
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  }

  /**
   * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
   */
  process($viewPortInstruction: any, waitToSwap?: boolean): Promise<void> {
    // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
    const viewPortInstruction = $viewPortInstruction as IRouterViewViewPortInstruction;
    const component = viewPortInstruction.component;
    const childContainer = component.childContainer;
    const viewModel = component.viewModel;
    const viewModelResource = component.viewModelResource as unknown as ResourceDescription;
    const metadata = viewModelResource.metadata;
    const config = component.router.currentInstruction.config;
    const viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};

    (childContainer.get(RouterViewLocator) as RouterViewLocator)._notify(this);

    // layoutInstruction is our layout viewModel
    const layoutInstruction = {
      viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
      model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    // viewport will be a thin wrapper around composition engine
    // to process instruction/configuration from users
    // preparing all information related to a composition process
    // first by getting view strategy of a ViewPortComponent View
    const viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    // using metadata of a custom element view model to load appropriate view-factory instance
    return metadata
      .load(childContainer, viewModelResource.value, null, viewStrategy, true)
      // for custom element, viewFactory typing is always ViewFactory
      // for custom attribute, it will be HtmlBehaviorResource
      .then((viewFactory: ViewFactory | HtmlBehaviorResource) => {
        // if this is not the first time that this <router-view/> is composing its instruction
        // try to capture ownership of the composition transaction
        // child <router-view/> will not be able to capture, since root <router-view/> typically captures
        // the ownership token
        if (!this.compositionTransactionNotifier) {
          this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
        }

        if (layoutInstruction.viewModel || layoutInstruction.view) {
          viewPortInstruction.layoutInstruction = layoutInstruction;
        }

        const viewPortComponentBehaviorInstruction = BehaviorInstruction.dynamic(
          this.element,
          viewModel,
          viewFactory as ViewFactory
        );
        viewPortInstruction.controller = metadata.create(childContainer, viewPortComponentBehaviorInstruction);

        if (waitToSwap) {
          return null;
        }

        this.swap(viewPortInstruction);
      });
  }

  swap($viewPortInstruction: any): void | Promise<void> {
    // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
    const viewPortInstruction: IRouterViewViewPortInstruction = $viewPortInstruction;
    const viewPortController = viewPortInstruction.controller;
    const layoutInstruction = viewPortInstruction.layoutInstruction;
    const previousView = this.view;

    // Final step of swapping a <router-view/> ViewPortComponent
    const work = () => {
      const swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
      const viewSlot = this.viewSlot;

      swapStrategy(
        viewSlot,
        previousView,
        () => Promise.resolve(viewSlot.add(this.view))
      ).then(() => {
        this._notify();
      });
    };

    // Ensure all users setups have been completed
    const ready = (owningView_or_layoutView: View) => {
      viewPortController.automate(this.overrideContext, owningView_or_layoutView);
      const transactionOwnerShipToken = this.compositionTransactionOwnershipToken;
      // if this router-view is the root <router-view/> of a normal startup via aurelia.setRoot
      // attemp to take control of the transaction

      // if ownership can be taken
      // wait for transaction to complete before swapping
      if (transactionOwnerShipToken) {
        return transactionOwnerShipToken
          .waitForCompositionComplete()
          .then(() => {
            this.compositionTransactionOwnershipToken = null;
            return work();
          });
      }

      // otherwise, just swap
      return work();
    };

    // If there is layout instruction, new to compose layout before processing ViewPortComponent
    // layout controller/view/view-model is composed using composition engine APIs
    if (layoutInstruction) {
      if (!layoutInstruction.viewModel) {
        // createController chokes if there's no viewmodel, so create a dummy one
        // but avoid using a POJO as it creates unwanted metadata in Object constructor
        layoutInstruction.viewModel = new EmptyLayoutViewModel();
      }

      // using composition engine to create compose layout
      return this.compositionEngine
        // first create controller from layoutInstruction
        // and treat it as CompositionContext
        // then emulate slot projection with ViewPortComponent view
        .createController(layoutInstruction as CompositionContext)
        .then((layoutController: Controller) => {
          const layoutView = layoutController.view;
          ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
          // when there is a layout
          // view hierarchy is: <router-view/> owner view -> layout view -> ViewPortComponent view
          layoutController.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
          layoutView.children.push(viewPortController.view);
          return layoutView || layoutController;
        })
        .then((newView: View | Controller) => {
          this.view = newView as View;
          return ready(newView as View);
        });
    }

    // if there is no layout, then get ViewPortComponent view ready as view property
    // and process controller/swapping
    // when there is no layout
    // view hierarchy is: <router-view/> owner view -> ViewPortComponent view
    this.view = viewPortController.view;

    return ready(this.owningView);
  }

  /**
   * Notify composition transaction that this router has finished processing
   * Happens when this <router-view/> is the root router-view
   * @internal
   */
  _notify() {
    const notifier = this.compositionTransactionNotifier;
    if (notifier) {
      notifier.done();
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
  resolve: (val?: any) => void;

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
